const express = require('express');
const router = express.Router();
const checkoutController = require('../Controller/Checkout.Controller');
const { authUser } = require('../Middleware/userMiddleware.authUser');

router.post('/', authUser, checkoutController.checkout);

module.exports = router;
