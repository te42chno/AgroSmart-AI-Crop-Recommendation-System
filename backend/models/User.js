const bcrypt = require('bcryptjs');
const { readData, writeData, generateId } = require('../config/dataStore');

class User {
  static async findOne(query) {
    const data = readData();
    return data.users.find(u => Object.keys(query).every(k => u[k] === query[k])) || null;
  }

  static findById(id) {
    const data = readData();
    const user = data.users.find(u => u._id === id);
    if (!user) return null;
    return {
      ...user,
      select: (fields) => {
        if (fields === '-password') {
          const { password, ...rest } = user;
          return rest;
        }
        return user;
      },
      deleteOne: async () => {
        const d = readData();
        d.users = d.users.filter(u => u._id !== id);
        writeData(d);
      }
    };
  }

  static async create(userData) {
    const data = readData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'farmer',
      createdAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    writeData(data);
    return newUser;
  }

  static async countDocuments(query = {}) {
    const data = readData();
    if (Object.keys(query).length === 0) return data.users.length;
    return data.users.filter(u => Object.keys(query).every(k => u[k] === query[k])).length;
  }

  static find(query = {}) {
    const data = readData();
    let result = data.users;
    
    if (query.$or) {
      result = result.filter(u => {
        return query.$or.some(cond => {
          const key = Object.keys(cond)[0];
          const regex = new RegExp(cond[key].$regex, cond[key].$options);
          return regex.test(u[key]);
        });
      });
    }
    if (query.role) {
      result = result.filter(u => u.role === query.role);
    }

    const queryObj = {
      select: (fields) => {
        if (fields === '-password') result = result.map(({ password, ...rest }) => rest);
        return queryObj;
      },
      sort: (sortObj) => {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return queryObj;
      },
      skip: (n) => {
        queryObj.skipCount = n;
        return queryObj;
      },
      limit: (n) => {
        return result.slice(queryObj.skipCount || 0, (queryObj.skipCount || 0) + n);
      }
    };
    return queryObj;
  }

  static async aggregate(pipeline) {
    const data = readData();
    // Simplified aggregation for user growth
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const groups = {};
    data.users.forEach(u => {
      const date = new Date(u.createdAt);
      if (date >= sixMonthsAgo) {
        const month = date.toISOString().slice(0, 7);
        groups[month] = (groups[month] || 0) + 1;
      }
    });
    
    return Object.entries(groups)
      .map(([k, v]) => ({ _id: k, count: v }))
      .sort((a, b) => a._id.localeCompare(b._id));
  }
  
  static async updatePassword(email, newPassword) {
    const data = readData();
    const user = data.users.find(u => u.email === email);
    if(user){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        writeData(data);
    }
  }
}

module.exports = User;
