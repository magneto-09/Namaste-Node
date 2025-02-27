
const admin = (req, res, next) => {
    const {token} = req.query; 

    // console.log(req.query); 

    // token = 1 --> Admin
    if(token==='1') next(); 
    else {
        return res.status(401).send('Unauthorised access to the protected route. Not an Admin!!!!')
    }
}

module.exports = {
    admin, 
}