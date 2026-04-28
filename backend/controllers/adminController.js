const User = require('../models/User');
const Prediction = require('../models/Prediction');

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalPredictions, totalFarmers] = await Promise.all([
      User.countDocuments(),
      Prediction.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
    ]);

    // Top crops
    const topCrops = await Prediction.aggregate([
      { $group: { _id: '$result.crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Monthly predictions (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyPredictions = await Prediction.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // User growth (last 6 months)
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalUsers, totalPredictions, totalFarmers, topCrops, monthlyPredictions, userGrowth });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await Prediction.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their predictions deleted.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/predictions
exports.getAllPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find().populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Prediction.countDocuments(),
    ]);

    res.json({ predictions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports/csv
exports.exportCSV = async (req, res, next) => {
  try {
    const predictions = await Prediction.find().populate('userId', 'name email').sort({ createdAt: -1 }).lean();

    const rows = predictions.map(p => ({
      date: p.createdAt?.toISOString().split('T')[0],
      user: p.userId?.name || 'N/A',
      email: p.userId?.email || 'N/A',
      N: p.inputs.N, P: p.inputs.P, K: p.inputs.K,
      temperature: p.inputs.temperature, humidity: p.inputs.humidity,
      ph: p.inputs.ph, rainfall: p.inputs.rainfall,
      crop: p.result.crop, confidence: p.result.confidence,
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => r[h]).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=agrosmart_report.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
