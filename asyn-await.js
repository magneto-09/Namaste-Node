
const asyncFunctionPromise = async () => 100 * 200;

console.log(asyncFunctionPromise());

// this is one way to get the acces of data that is currently wrapped inside promise. 
asyncFunctionPromise().then((data) => console.log("data", data)); 

let data;
// let's create an Immediately invoked funcn expresion
(async () => {
    data = await (asyncFunctionPromise());
    console.log(data);
})()


// Whole Idea is whenever we're returning something from async function, that data will be wrapped 
// inside promises implicitly by JS. 

// And to use this data -> we've 2 options -> either use .then() or use await. 


