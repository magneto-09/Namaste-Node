const mongoose = require('mongoose'); 

const dummy2Schema = new mongoose.Schema({
    firstName:{
        type:String, 
        required:true, 
    },
    lastName:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true, 
    }
})

const dummy2Model = mongoose.model('dummy2', dummy2Schema); // JS wrapper around schema. Constructor

module.exports = {
    dummy2Model,
}