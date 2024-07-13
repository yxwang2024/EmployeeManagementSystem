const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;