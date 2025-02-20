const express = require('express');

const router = express.Router(); // create router when need to handle routes in different file. 


// --------------------------Scenario 01 (Dynamic route before all static routes)-----------------
/*
router.get('/:id', (req, res)=> res.send('dynamic route handling'));

router.get('/', (req, res)=> res.send("Routing called from routeHandler File"))

router.get('/xyz', (req, res)=> res.send('subroute handling from the same different file'))
*/

// rule says put all static route at first and then dynamic routes at last. 
// Reason -> Express routing mechanism. 
// ---------------------------------------------------------------------------------------------

// ----------------------Scenario 02 (All static Routes then Dynamic Route)-------------------

/*
router.get('/', (req, res) => res.send("Routing called from routeHandler File"))

router.get('/xyz', (req, res) => res.send('subroute handling from the same different file'))

router.get('/:id', (req, res) => res.send('dynamic route handling')); // dynamic route
*/

// the only problem that still exists here is let's say if someone is accessing /users/hello
// then again dynamic route will get called cuz of the fact how express routing mechanism works. 

// ---------------------------------------------------------------------

// -----------Scenario 03 (All static Routes then Dynamic Route + handling Scenario-02 Prob)----------

// /:id -> +ve numbers only and we'll restrict /:id to this. 

router.get('/', (req, res) => res.send("Routing called from routeHandler File"))
router.get('/xyz', (req, res) => res.send('subroute handling from the same different file'))

// dynamic route
router.get('/:id(\\d+)', (req, res) => {
    const { id } = req.params;
    const numId = Number(id);

    if (numId < 0) res.send('Invalid id is provided');

    res.send('dynamic route handling')
}); 

// ---------------------------------------------------------------




module.exports = {
    router
}