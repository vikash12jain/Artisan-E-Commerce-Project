const  mongoose = require("mongoose");

const blacklistTokenSchema = mongoose.Schema({
token : {
    type:String,
    unique : true,
    required : true
},
createdAt : {
    type :Date,
    default : Date.now,
    expires : 86400
}
})
module.exports = mongoose.model('blackListToken',blacklistTokenSchema); 