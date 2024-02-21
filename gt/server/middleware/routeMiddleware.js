const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    
    if(token){
        jwt.verify(token,'icandothisallday',(err,decodedToken)=>{
            if(err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        console.log("No token");
        res.redirect('/login');
    }
}

const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    
    if(token){
        jwt.verify(token,'icandothisallday', async (err,decodedToken)=>{
            if(err) {
                console.log(err.message);
                
                next();
            }
            else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                
                next();
                
            }
        })
    }
    else{
        
        next();
    }
    
}

module.exports = { requireAuth,checkUser };