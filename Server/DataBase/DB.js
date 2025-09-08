const mongoose = require('mongoose');

const connectToDB = ()=>{
    try{
        mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to database successfully !!!');
    }
    catch(error){
        console.error(error.message());
    }
}
module.exports = connectToDB;
