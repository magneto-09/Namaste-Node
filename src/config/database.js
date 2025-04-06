const mongoose = require('mongoose');

// since we're not using curly braces so we're literally returning the promiseData explictily. 
const connectDB = async () => await mongoose.connect(process.env.MONGODB_URI)

module.exports = {
    connectDB
}