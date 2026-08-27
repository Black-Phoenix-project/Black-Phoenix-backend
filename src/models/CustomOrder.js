const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '' },
    requirements: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'done', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomOrder', customOrderSchema);
