const mongoose = require('mongoose');

const dummySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    hobby: { type: String }
})

// create model -> JS wrapper around dummySchema. it's a constructor function. 
const dummyModel = mongoose.model('dummy', dummySchema); 


module.exports = {
    dummyModel, 
}