const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  file: String,
}, { timestamps: true });

module.exports = mongoose.model("Doubt", doubtSchema);
