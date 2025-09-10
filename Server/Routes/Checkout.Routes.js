const express = require('express');
const router = express.Router();
const checkoutController = require('../Controller/Checkout.Controller');
const { authUser } = require('../Middleware/userMiddleware.authUser'); // optional - use if you want authenticated checkout

// Public or protected route: pick one. If you want only logged-in users to checkout, add authUser.
router.post('/', authUser, checkoutController.checkout);

module.exports = router;
