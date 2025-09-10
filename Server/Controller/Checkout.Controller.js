// controllers/checkoutController.js
const Product = require('../Models/Product.model');
const Order = require('../Models/Order.model');

exports.checkout = async (req, res) => {
  const userId = req.user?.id || null;
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!items.length) {
    return res.status(400).json({ message: 'Cart empty' });
  }

  // --- fallback logic starts here ---
  const orderItems = [];
  let total = 0;
  const updatedProducts = []; // track decremented products

  try {
    for (const it of items) {
      const requestedQty = Number(it.quantity || 0);

      // Atomically decrement if enough stock
      const updated = await Product.findOneAndUpdate(
        { _id: it.productId, quantity: { $gte: requestedQty } },
        { $inc: { quantity: -requestedQty, sold: requestedQty } },
        { new: true }
      );

      if (!updated) {
        // rollback already decremented products
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

    // Create order (no transaction, just one write)
const order = await Order.create({
  user: userId,
  items: orderItems,
  total,
  status: 'placed',
});

// --- clear the user’s cart after successful order ---
if (userId) {
  try {
    const Cart = require('../Models/Cart.model');
    await Cart.deleteMany({ user: userId });
  } catch (e) {
    console.warn('Failed to clear cart after checkout', e);
  }
}

return res.json({ order });


    return res.json({ order });
  } catch (err) {
    // rollback in case of error
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
