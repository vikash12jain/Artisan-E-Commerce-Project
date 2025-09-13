const express = require('express');
const router = express.Router();
const cartController = require('../Controller/Cart.Controller');
const userMiddleware = require('../Middleware/userMiddleware.authUser');
const monitorActivity = require('../Middleware/UserActivity.middleware.js')

router.post('/add', userMiddleware.authUser,monitorActivity.logUserActivity, cartController.addToCart);
router.delete('/remove/:productId', userMiddleware.authUser,monitorActivity.logUserActivity, cartController.removeFromCart);
router.get('/', userMiddleware.authUser,monitorActivity.logUserActivity, cartController.getCart);
router.delete('/clear', userMiddleware.authUser,monitorActivity.logUserActivity, cartController.clearCart);

module.exports = router;