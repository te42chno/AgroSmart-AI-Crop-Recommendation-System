const { readData, writeData, generateId } = require('../config/dataStore');

class Prediction {
  static async create(predData) {
    const data = readData();
    const newPred = {
      _id: generateId(),
      ...predData,
      createdAt: new Date().toISOString()
    };
    data.predictions.push(newPred);
    writeData(data);
    return newPred;
  }

  static async countDocuments(query = {}) {
    const data = readData();
    if (Object.keys(query).length === 0) return data.predictions.length;
    let result = data.predictions;
    if (query.userId) result = result.filter(p => p.userId === query.userId);
    return result.length;
  }

  static async deleteMany(query) {
    const data = readData();
    data.predictions = data.predictions.filter(p => p.userId !== query.userId);
    writeData(data);
  }

  static find(query = {}) {
    const data = readData();
    let result = data.predictions;

    if (query.userId) {
      result = result.filter(p => p.userId === query.userId);
    }
    if (query['result.crop'] && query['result.crop'].$regex) {
      const regex = new RegExp(query['result.crop'].$regex, query['result.crop'].$options);
      result = result.filter(p => regex.test(p.result.crop));
    }

    const queryObj = {
      populate: (field, select) => {
        if (field === 'userId') {
          const users = readData().users;
          result = result.map(p => {
            const user = users.find(u => u._id === p.userId);
            return { ...p, userId: user ? { name: user.name, email: user.email } : null };
          });
        }
        return queryObj;
      },
      sort: () => {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return queryObj;
      },
      skip: (n) => {
        queryObj.skipCount = n;
        return queryObj;
      },
      limit: (n) => {
        return result.slice(queryObj.skipCount || 0, (queryObj.skipCount || 0) + n);
      },
      lean: () => {
         return result;
      }
    };
    return queryObj;
  }

  static async aggregate(pipeline) {
    const data = readData();
    
    // Top crops
    if (pipeline[0].$group && pipeline[0].$group._id === '$result.crop') {
      const counts = {};
      data.predictions.forEach(p => {
        const crop = p.result.crop;
        counts[crop] = (counts[crop] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([k, v]) => ({ _id: k, count: v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }
    
    // Monthly predictions
    if (pipeline[0].$match && pipeline[0].$match.createdAt) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const groups = {};
      data.predictions.forEach(p => {
        const date = new Date(p.createdAt);
        if (date >= sixMonthsAgo) {
          const month = date.toISOString().slice(0, 7);
          groups[month] = (groups[month] || 0) + 1;
        }
      });
      return Object.entries(groups)
        .map(([k, v]) => ({ _id: k, count: v }))
        .sort((a, b) => a._id.localeCompare(b._id));
    }
    
    return [];
  }
  
  static async insertMany(docs) {
    const data = readData();
    const newDocs = docs.map(d => ({...d, _id: generateId(), createdAt: new Date().toISOString()}));
    data.predictions.push(...newDocs);
    writeData(data);
    return newDocs;
  }
}

module.exports = Prediction;
