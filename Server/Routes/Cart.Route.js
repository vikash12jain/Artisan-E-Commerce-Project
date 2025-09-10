const express = require('express');
const router = express.Router();
const cartController = require('../Controller/Cart.Controller');
const userMiddleware = require('../Middleware/userMiddleware.authUser');

router.post('/add', userMiddleware.authUser, cartController.addToCart);
router.delete('/remove/:productId', userMiddleware.authUser, cartController.removeFromCart);
router.get('/', userMiddleware.authUser, cartController.getCart);
router.delete('/clear', userMiddleware.authUser, cartController.clearCart);

module.exports = router;