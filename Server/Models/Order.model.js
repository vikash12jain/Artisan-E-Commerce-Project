const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subTotal: { type: Number, required: true }, // price * quantity (captured at order time)
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional for guest flow
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'placed' }, // placed, paid, cancelled, refunded
  shipping: { type: Object }, // optional shipping info snapshot
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
