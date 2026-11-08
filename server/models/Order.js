const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String, price: Number, qty: Number,
  }],
  shipping: { fullName: String, address: String, city: String, postalCode: String, phone: String },
  paymentMethod: { type: String, default: 'COD' },
  total: { type: Number, required: true },
  status: { type: String, default: 'Placed' },
}, { timestamps: true }));
