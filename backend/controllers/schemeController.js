const Scheme = require('../models/Scheme');

// Get all schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get schemes by category
const getSchemesByCategory = async (req, res) => {
  try {
    const schemes = await Scheme.find({ category: req.params.category });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single scheme by ID (for View Details)
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new scheme (admin only)
const createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    const savedScheme = await scheme.save();
    res.status(201).json(savedScheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update scheme (admin only)
const updateScheme = async (req, res) => {
  try {
    const updatedScheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedScheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(updatedScheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete scheme (admin only)
const deleteScheme = async (req, res) => {
  try {
    const deletedScheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!deletedScheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSchemes,
  getSchemesByCategory,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme
};