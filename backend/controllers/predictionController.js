const Prediction = require('../models/Prediction');

// POST /api/predict — Call ML service and save prediction
exports.predict = async (req, res, next) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    if ([N, P, K, temperature, humidity, ph, rainfall].some(v => v === undefined || v === null)) {
      return res.status(400).json({ message: 'All 7 input fields are required.' });
    }

    // Call ML service
    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';
    const mlResponse = await fetch(`${mlUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ N: +N, P: +P, K: +K, temperature: +temperature, humidity: +humidity, ph: +ph, rainfall: +rainfall }),
    });

    if (!mlResponse.ok) {
      const err = await mlResponse.json().catch(() => ({}));
      const msg = Array.isArray(err.detail) 
        ? err.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ') 
        : (err.detail || 'ML service error.');
      return res.status(502).json({ message: msg });
    }

    const mlResult = await mlResponse.json();
    console.log('ML Service Result:', mlResult);

    // Save to database
    const prediction = await Prediction.create({
      userId: req.user._id,
      inputs: { N: +N, P: +P, K: +K, temperature: +temperature, humidity: +humidity, ph: +ph, rainfall: +rainfall },
      result: {
        crop: mlResult.crop,
        confidence: mlResult.confidence,
        allPredictions: mlResult.all_predictions || [],
      },
    });

    res.status(201).json({ prediction });
  } catch (error) {
    next(error);
  }
};

// GET /api/history — Get current user's prediction history
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = { userId: req.user._id };
    if (search) {
      query['result.crop'] = { $regex: search, $options: 'i' };
    }

    const [predictions, total] = await Promise.all([
      Prediction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Prediction.countDocuments(query),
    ]);

    res.json({ predictions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
