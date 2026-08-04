const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getStats, getUsers, deleteUser, getAllPredictions, exportCSV } = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, roleCheck('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/predictions', getAllPredictions);
router.get('/reports/csv', exportCSV);

module.exports = router;
