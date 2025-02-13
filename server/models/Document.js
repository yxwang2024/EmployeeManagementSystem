// const mongoose = require('mongoose');
import mongoose from 'mongoose';
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
    unique: true,
    required: true
  }
});

const Document = mongoose.model('Document', documentSchema);

export default Document;