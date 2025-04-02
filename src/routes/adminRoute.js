const express = require('express'); 

const router = express.Router(); // rotuer instance


router.get('/', (req, res)=> res.send('Home Admin Route')); 

router.get('/allUserData', (req, res)=> res.send('All user data fetched for the admin'));



module.exports = {
    router
}