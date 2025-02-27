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
const { router: routeHandler } = require('./middleware')
app.use('/mw', routeHandler);
// ------------------------------------------------------------------------------------


// ----------------------------Scenario 02------------------------------------------------
app.use('/api', (req, res, next) => {
    console.log("Route Handler 1");
    next();
    console.log("After next again Route Handler 1")
})

app.use('/api', (req, res, next) => {
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

// case 01 --> if res.send() is present after next() and no next routing handler exists; 
app.use('/url', (req, res, next) => {
    console.log("Route Handler");
    next();
    console.log("After next: Route Handler");
    res.send("Req-res cycle completes but will throw an error");
})
// from this we'll get a status 200 OK response. but due to next() express expects another routing
// handler which is not present in this case. Hence, throws an error and app will get crashed. 

// case 02 --> no res.send() is present but next() is present in routing handler
app.use('/url1', (req, res, next) => {
    console.log("Route Handler");
    next();
    console.log("After next: Req will not hangs indefinitely due to next()");
})

// case 03 --> no res.send() and no next() is present 
app.use('/url2', (req, res) => {
    console.log("Req hangs indefinitely.")
})

// ---------------------------------------------------------------------------------------

// ----------------------Scenario 04 - (no res.send() but multiple handlers)-----------------
app.use('/url3',
    (req, res, next) => {
        console.log("Handler 1");
        next();
    },
    (req, res, next) => {
        console.log("Handler 2");
        next()
    },
    (req, res, next) => {
        console.log("Handler 3")
        // next();
    })

// multiple handlers and consider 2 cases -> in last handler  -> next() is present and not present. 

// if next() -> present -> last handler then due to this next() will get "cannot get /url3" error. 
// cuz if next() is present then somehow express is expecting another handler or next matching route 
// but it is not the case. Hence, "cannot get /url3" error will be received. 

// if next() -> present❌❌ then req will hangs indefinitely. 
// -----------------------------------------------------------------------------------------------

// --------------------------------Scneario 05--------------------------------------------------
// if res.send() is present after next() and next routing handler exists
app.use('/url4',
    (req, res, next) => {
        console.log("Handler 1");
        next();
        console.log("H1: After next()")
        res.send("Sent from H1!!!")
    },
    (req, res) => {
        console.log("Handler 2")
    }
)

// Here we're calling res.send() after next() but here when next() is called, another handler exists
// that's why it is showing no error. 
// ---------------------------------------------------------------------------------------------

// -----------------Scenario 06---------------------------------------------------------------

app.use('/url5', 
    (req, res, next) => {
        console.log("Handler 1");
        next();
        console.log("H1: After next()")
        res.send("Sent from H1!!!")
    }, 
    (req, res, next) => {
        console.log("Handler 2"); 
        next(); 
    }
)

// basically we're definitely sending response from handler 1 after next() but we're also calling
// next() from handler 2. 
// now due to this next() in Handler 2, express will comes out from the 2nd handler's scope. 
// express is trying to find a next matching route or next routing handler. 
// both are not present so express will comes back to 2nd handler and try to execute code after next()
// nothing is present so it'll go back to 1st handler and execute code after next().
// saw that res has been sent from Handler 1. 
// but due to the next() present in 2nd handler and also no next routing handler exists. 
// But express still expects next handler or next matching route which is not present in this case. 
// Hence, even after returning a response to POSTMAN it'll throw an error which will crash the server. 
// ------------------------------------------------------------------------------------------


// ----------------------------------Scenario 07------------------------------------------
app.use('/url6', (req, res, next) => {
    res.send("Response Sent before next!!!"); 
    console.log("Handler: After res.send() before next()")
    next(); 
    console.log("Handler: After res.send() and after next()")
})
// ----------------------------------------------------------------------------------------

// -----------------------Scenario 08-------------------------------------------------
app.use('/url7', 
    (req, res, next) => {
        console.log('Handler 1'); 
        next(); 
        console.log('After Next: Handler 1')
    },
    (req, res, next) => {
        console.log('Handler 1'); 
        next(); 
        console.log('After Next: Handler 1')
        res.send('Response sent by 2nd Handler'); 
    },
    (req, res, next) => {
        console.log('Handler 3'); 
        next(); 
        console.log('After next: Handler 3')
    }
)   // res sent but crashed the server due to cannot remove headers wala error
// as next() was called from last handler and also res.send() is called after next() in 2nd handler.
// -----------------------------------------------------------------------------------

//--------------------------------------Scenario 09---------------------------------------
// creating authMiddleware file as well as admin file for route handling related to admin API. 
const {admin: adminAuthMiddlware} = require('./middlewares/authMiddleware')
app.use('/admin', adminAuthMiddlware)

const {router: adminRouter} = require('./routes/adminRoute')
app.use('/admin', adminRouter); 

// ----------------------------------------------------------------------------------------

app.get('/', (req, res) => res.send('Home route created using HTTP method'))

app.listen(3000, () => console.log("Server listening at Port 3000"))