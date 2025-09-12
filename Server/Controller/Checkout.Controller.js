const Product = require('../Models/Product.model');
const Order = require('../Models/Order.model');
const userModel = require('../Models/User.model')

exports.checkout = async (req, res) => {
  const userId = req.user?.id || null;
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!items.length) {
    return res.status(400).json({ message: 'Cart empty' });
  }
  const orderItems = [];
  let total = 0;
  const updatedProducts = [];

  try {
    for (const it of items) {
      const requestedQty = Number(it.quantity || 0);
      const updated = await Product.findOneAndUpdate(
        { _id: it.productId, quantity: { $gte: requestedQty } },
        { $inc: { quantity: -requestedQty, sold: requestedQty } },
        { new: true }
      );

      if (!updated) {
        for (const u of updatedProducts) {
          await Product.updateOne(
            { _id: u.productId },
            { $inc: { quantity: u.quantity, sold: -u.quantity } }
          );
        }
        return res.status(409).json({
          message: 'Some items out of stock',
          details: [{ productId: it.productId }],
        });
      }

      updatedProducts.push({ productId: it.productId, quantity: requestedQty });

      orderItems.push({
        productId: updated._id,
        name: updated.name,
        price: updated.price,
        quantity: requestedQty,
        subTotal: updated.price * requestedQty,
      });
      total += updated.price * requestedQty;
    }
const order = await Order.create({
  user: userId,
  items: orderItems,
  total,
  status: 'placed',
});
if (userId) {
  try {
    await userModel.findByIdAndUpdate(
  userId,
  { cart: [] },
  { new: true }
);

  } catch (e) {
    console.warn('Failed to clear cart after checkout', e);
  }
}

return res.json({ order });


    return res.json({ order });
  } catch (err) {
    for (const u of updatedProducts) {
      await Product.updateOne(
        { _id: u.productId },
        { $inc: { quantity: u.quantity, sold: -u.quantity } }
      );
    }
    return res
      .status(500)
      .json({ message: 'Checkout failed', error: err.message });
  }
};
