const express = require('express');

const app = express();

// ----------------------------Ep(16 + 17)🚀🚀🚀--------------------------------------------------

// -----------------Scenario 01--------------------------------------------------
app.use("/path", (req, res) => res.send("path handler, it is")) // route

app.use("/path/xyz", (req, res) => res.send("still path's handler will execute")) // subroute

// answer -> partial matching. no next() is present in route handler. hence for subroute
// route handler is getting called

// ---------------------------------------------------------------------------------

// -------------------Scenario 02------------------------------------------------

app.use('/hello/xyz', (req, res) => res.send("subroute is getting called"))

app.use('/hello', (req, res) => res.send('route handler, it is'))

// order of routing matter very much with app.use()
// and for /hello/abc --> still route handler will get executed. if we don't want then
// define /hello/abc before /hello

// -------------------------------------------------------------------


// -------------------Scenario 04 - (Route handling from diff file)-------------------------------

const { router: fileRouteHandler } = require('./routeHandling')

app.use('/fileRoute', fileRouteHandler);

// ------------------------------------------------------------

// -------------------Scenario 03 - (Always Present at last if adding using app.use())---------------

// app.use('/', (req, res) => res.send("Home route created at last cuz using app.use()"));

// in this code we're handling case for '/'. And suppose in /fileRoute if '/' is not defined. 
// { '/' this present in /fileRoute is basically relative to /fileRoute. }
// And if it is not present then it'll eventually check the '/' present in this app.js 
// and hence calls the req handler of app.use('/'); 

// basically any route that is not present in routeHandling will be taken care by this '/' 
// cuz every route starts with / (slash)
// ------------------------------------------------------------------


// ------------------------Ep (16 + 17)🚀🚀🚀------------------------------------------------------


// ------------------Ep 18 - (middlewares and error handlers) 🚀🚀🚀------------------------------

// console.log(app._router.stack); // array that stores all the routes as an object. 

// ----------------------Scenario 01---------------------------------------------------
const {router: routeHandler} = require('./middlewares')
app.use('/mw', routeHandler); 
// ------------------------------------------------------------------------------------


// ----------------------------Scenario 02------------------------------------------------
app.use('/api', (req, res, next)=>{
    console.log("Route Handler 1");
    next(); 
    console.log("After next again Route Handler 1")
})

app.use('/api', (req, res, next)=>{
    console.log("Route Handler 2"); 
    res.send('completing req-res cycle from Route Handler 2'); 
    // next(); 
})

app.use('/api/123', (req, res) => {
    console.log("sub-route handler")
    res.send("completing req-res cycle.")
})

// when hitting /api --> next() is present in 1st matching handler 
// hence, 2nd handlers will get executed cuz got the next matching route. 
// although we don't follow this. if having multiple handlers for same path. always put it in the
// same app.use() only. (if using app.use() for route handling which we generally don't follow)

// when hitting /api/123 -> same response, routing handler will get executed due to 
// partial matching of the route.  

// even if next() is present in Route Handler 2 then it'll throw an error when hitting /api/123. 
// also --> A chain is being formed.  🚀🚀

// Route Handler 1 before next() -> Route handler 2 before next() -> sub-route Handler -> 
// -> Route Handler 2 after next() -> Route Handler 1 after next()

// -------------------------------------Scenario 03-------------------------------------

// case 01 --> if res.send() is present after next(); 
app.use('/url', (req, res, next) => {
    console.log("Route Handler"); 
    next(); 
    console.log("After next: Route Handler");
    res.send("Req-res cycle completes but will throw an error"); 
})

// case 02 --> no res.send() is present but next() is present in routing handler
app.use('/url1', (req, res, next)=> {
    console.log("Route Handler"); 
    next(); 
    console.log("After next: Req will not hangs indefinitely due to next()");
})

// case 03 --> no res.send() and no next() is present 
app.use('/url2', (req, res) => {
    console.log("Req hangs indefinitely.")
})

// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------

app.get('/', (req, res) => res.send('Home route created using HTTP method'))

app.listen(3000, () => console.log("Server listening at Port 3000"))