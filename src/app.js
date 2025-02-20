const express = require('express');

const app = express();

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


app.get('/', (req, res) => res.send('Home route created using HTTP method'))

app.listen(3000, () => console.log("Server listening at Port 3000"))