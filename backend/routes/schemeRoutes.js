const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getAllSchemes,
  getSchemesByCategory,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme
} = require('../controllers/schemeController');

// Public routes
router.get('/', getAllSchemes);
router.get('/detail/:id', getSchemeById);
router.get('/:category', getSchemesByCategory);

// Protected routes (admin only)
router.post('/', protect, createScheme);
router.put('/:id', protect, updateScheme);
router.delete('/:id', protect, deleteScheme);

module.exports = router;