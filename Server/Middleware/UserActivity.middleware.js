const UserActivity = require('../Models/UserActivity.model')
exports.logUserActivity = async (req, res, next) => {
    try {
        
        if (req.user) {
                await UserActivity.create({
                userId: req.user._id,
                fullname: req.user.fullname,
                email: req.user.email,
                route: req.originalUrl,
                method: req.method,
                ip: req.ip,
                isadmin: req.user.isAdmin
            });
        }
        else{
            await UserActivity.create({
                email: "---STRANGER---",
                route: req.originalUrl,
                method: req.method
            });
        }
    } catch (err) {
        console.error('Failed to log user activity:', err);
    }
    next();
};

