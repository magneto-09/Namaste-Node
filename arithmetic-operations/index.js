const {add} = require('./Add');
const {sub} = require('./Subtract')
const {mul:multiply} = require('./Multiply');
const {div: divide} = require('./Divide'); 
const {remainder: rem} = require('./Remainder')

module.exports = {add, sub, multiply, divide, rem}; 