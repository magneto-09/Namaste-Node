const express = require('express'); 
const router = express.Router(); 

// -----------------------------------Scenario 01-------------------------------------

// since, res has already been sent from the 1st handler itself so there is no significance of calling
//  next().
// with next(), express will definitely pass the control to the 2nd handler but as soon as it'll see
// res.send() in the 2nd handler, 
// it'll throw an error ->  Cannot set headers after they are sent to the client
router.get('/', (req, res, next)=>{
    res.send('Response 1 !!!!')
    next(); 
}, 
(req, res) => {
    // res.send("Response 2!!!");
    console.log("2nd handler got executed. But can't send res.send() again")
}
)
// ----------------------------------------------------------------------------------------------

// -----------------------Scenario - 02----------------------------------------------

// as soon as next() gets called then express will pass the control to the next handler. 
// basically next() generally finds the next matching route but here in the same route we're having
// multiple handlers. hence, as soon as next() is called then it'll check the next handler. 

// so anything that you're writing beyond next() in the same handler will get executed only when we're
// returning from the next handler if next handler is synchronous. 
router.get('/cf', (req, res, next)=>{
    console.log("1st handler got executed"); 
    next(); 
    // res.send('Response 1 !!!!')
    const x=6;
    console.log(x*2); 
}, 
(req, res) => {
    console.log("from 2nd handler")
    res.send("Response 2!!!");
}
)
// --------------------------------------------------------------------------------------

// -------------------Scneario 03 (When next routing handler -> async)----------------------
router.get('/rp', (req, res, next) => {
    console.log("Handler 1: Before next()");
    next();
    console.log("Handler 1: After next()");  
}, 
async (req, res) => {
    console.log("Handler 2: Executing...");
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    console.log("Handler 2: After delay");
    res.send("Final Response");
});

// ---------------------------------------------------------------------------------------


module.exports={
    router
}