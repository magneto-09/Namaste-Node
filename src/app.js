const express = require('express');

const app = express();

const dotenv = require('dotenv');

dotenv.config(); // loads the enivronment variables. 


//------------- 🚀🚀🚀🚀🚀🚀 Routing Handlers and middlewares 🚀🚀🚀🚀🚀🚀 ---------------------

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
        console.log('Handler 2');
        next();
        console.log('After Next: Handler 2')
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
const { admin: adminAuthMiddlware } = require('./middlewares/authMiddleware')
app.use('/admin', adminAuthMiddlware)

const { router: adminRouter } = require('./routes/adminRoute')
app.use('/admin', adminRouter);

// ----------------------------------------------------------------------------------------

// ---------------------Scenario 10 - creating custom error middleware----------------------------

app.use('/url8', (req, res, next) => {
    console.log("Route Handler");
    next(new Error("Something went wrong!")); // Pass an error to trigger error middleware
    console.log("After next: Route Handler 1");
})

// app.use((err, req, res, next) => {
//     console.log("custom error middleware called"); 
//     return res.status(500).send(err.message); 
// })

// when you'll not create a custom error middleware then express has its own default error middleware
// that runs when any error is found. 

// And whenever we've to call the error middleware then we've to pass the err as an argument to the
// next(); 

// that is why it has advised to write your logic in try-catch block. 
// ---------------------------------------------------------------------------------------------

// -----------------------------------Scenario 11 -(using try-catch)---------------------------

app.use('/url9', (req, res, next) => {
    let flag = 0;

    try {
        console.log('Route Handler');
        flag = 1;
        if (flag === 1) throw new Error('Flag is 1. It means client is not an admin.')
        else res.send('Response Sent!!!!!!')
    } catch (err) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log("custom error middleware called");
    return res.status(500).send(err.message);
})
// --------------------------------------------------------------------------------------------


// ---------------------Scenario 12 - (error middleware using '/' )------------------------

// 2 cases -> error middleware after handler or before handler

// case 2 :- error middleware before handler
app.use('/', (err, req, res, next) => {
    console.log("custom error middleware called");
    return res.status(500).send(err.message);
})

// routing handler
app.use('/url10', (req, res, next) => {
    console.log("Route Handler");
    next(new Error("Something went wrong!!!!!"));
    console.log("After next: Route Handler");
})

// case 1 :- error middleware after handler
/*
    app.use('/', (err, req, res, next) => {
    console.log("custom error middleware called");
    return res.status(500).send(err.message);
    })
*/

// basically error handler before the route handler makes no sense at all. Always. 

// check the doc -> namste Node - Season 02 for the explanation. 
// -----------------------------------------------------------------------------------------

// ---------------------Scenario 13 - using app.use() and app.httpMethods() together----------------
app.use('/dashboard', (req, res, next) => {
    console.log('Handler that uses app.use(). Think of it as middleware for dashboard');
    next();
    console.log('After next: Handler 1')
})

app.get('/dashboard', (req, res) => {
    console.log('Dashboard Home');
    res.send('Dashboard Home Page.');
})

app.get('/dashboard/login', (req, res) => {
    console.log('Login Page');
    res.send('Login Successful');
})

app.get('/dashboard/signUp', (req, res) => {
    console.log('Signup Page');
    res.send('Please Signup!!!!');
})

// when /dashboard hits then 1st matching route will be the one that uses app.use(); 
// it's routing handler will get executed. then next() will be called and then next matching route 
// will be called. i.e. app.get('/dashboard) 

// lly, when /dashboard/login hits then 1st matching route will be the one that uses app.use();
// it's routing handler will get executed. then next() will be called and then next matching route 
// will be called. i.e. app.get('/dashboard/login) 
// -------------------------------------------------------------------------------------------------

// ------------------Ep 18 - (middlewares and error handlers) 🚀🚀🚀------------------------------


//------------- 🚀🚀🚀🚀🚀🚀 Routing Handlers and middlewares 🚀🚀🚀🚀🚀🚀 ---------------------


// --------------Ep 19 - (Database Schemas & Model, Mongoose) 🚀🚀🚀--------------------------------

const { connectDB } = require('./config/database')

connectDB().then(() => {
    console.log('Database connected successfully!!!!')

    app.listen(3000, () => console.log("Server listening at Port 3000"))
})
    .catch((err) => {
        console.log('Database connection Failed!!!!!')
    })


// creating new collection and filling the data by calling the inserUser() manually -> BAD WAY❌❌
require('./model/user')


// Inserting Data to the DB by creating APIs 
const { dummyModel: Dummy } = require('./model/dummy');

// Case 01 --> Sending the hardcode data (or, static data) to db via APIs
app.post('/dummySignup', async (req, res, next) => {

    const dataObj = {
        firstName: "Rupam",
        lastName: "Pakhira",
        age: 23,
        hobby: "GAY"
    }
    const newData = new Dummy(dataObj);  // creating an instance of Dummy Model i.e. document

    try {
        await newData?.save();  // saving the data into dummy collection
        console.log('dummy data added successfully')
        res.send(JSON?.stringify(dataObj))
    }
    catch (e) {
        next(e);
    }
})

// --------------Ep 19 - (Database Schemas & Model, Mongoose) 🚀🚀🚀--------------------------------



// --------------Ep 20 - (Diving into the APIs) 🚀🚀🚀--------------------------------

// Case 02 --> Saving the dynamic data into DB via APIs. sending data via req.body. 
const { dummy2Model: Dummy2 } = require('./model/dummy2')

app.use(express.json()); 
// global middleware -> applied to all the API endpoints that we'll create after this line. 

app.post('/dummy2Signup', async(req, res, next) => {

    console.log(req.body); // it'll give me the entire obj. 

    const { firstName, lastName, email, password } = req.body; 
    // since we're getting the data in the form of JSON. Hence, we've to add a middleware named as
    //  app.use(express.json()) that basically attaches the incoming JSON with req.body
    // without this middleware, req.body will remain undefined. 

    const dataObj = {
        firstName, 
        lastName, 
        email, 
        password
    }

    const newData = new Dummy2(dataObj);  // instance of model --> document

// Instead of destructuring and creating dataObj, 
// we can literally pass enitre req.body while creating a new instance. cuz, 🌟 req.body === dataObj.🌟 

    try {
        await newData?.save(); 
        res.status(200).send(JSON?.stringify(dataObj)); 
        console.log('Data added successfully'); 
    } catch (error) {
        console.log('Error occured')
        next(error); 
    }
})

// --------------Ep 20 - (Diving into the APIs) 🚀🚀🚀--------------------------------


// --------------------------------------------------------------------------------------------------

app.get('/', (req, res) => res.send('Home route created using HTTP method'))
