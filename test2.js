console.log("Hey, test 2")

 const fx = () => 10+20; 

 var x=300; 

//  console.log("module-export", module.exports);

 module.exports = {fx, x}; 

// module.exports = {...module.exports, y:25}; 
// module.exports.y=25; 

let obj =  module.exports

console.log("object", module.exports===obj)