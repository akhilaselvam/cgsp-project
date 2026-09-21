const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['student', 'agriculture', 'physicallyChallenged', 'health']
  },
  department: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: {
    type: String,
    required: true
  },
  lastDate: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);