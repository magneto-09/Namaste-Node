// require('./test1')

// //  console.log(globalThis); 

//  console.log(globalThis === global)

// const {fx: xc, x:vfx} =  require('./test2.js')

// // var x=100; 


// console.log(vfx, xc());


// ************** Ep---04 ****************************
// const {add, sub, multiply, divide, rem} = require('./arithmetic-operations'); 

const {remainder:rem} = require('./arithmetic-operations/Remainder')

// add(10, 20); 
// sub(10, 20); 
// multiply(10, 20);
// divide(10, 20); 
// rem(101, 20); 

// ******************** Ep - 05 *****************************
module.exports = {rem}; 

// console.log(module); 
// console.log("children", module.children); 
// console.log(module.paths); 


