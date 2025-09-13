const express = require('express');
const router = express.Router();
const checkoutController = require('../Controller/Checkout.Controller');
const { authUser } = require('../Middleware/userMiddleware.authUser');
const monitorActivity = require('../Middleware/UserActivity.middleware.js')

router.post('/', authUser,monitorActivity.logUserActivity, checkoutController.checkout);

module.exports = router;
