const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: { type: Number, required: true, min: 0 },
    scope: { type: String, enum: ['global', 'product'], default: 'global' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    active: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discount', discountSchema);
