const User = require('../models/User') 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
function handleErrors(err){
    let errors = {username:'',email:'', password:''};
    
    if(err.message=== 'Incorrect username'){
        errors.email = 'user not registered'
    }
    if(err.message === 'Incorrect email'){
        errors.email = 'e-mail not registered'
    }
    if(err.message === 'Incorrect password'){
        errors.password = 'incorrect password'
    }
    if(err.code===11000){
        if(err.keyValue.username){
            errors.username = "username already exists";
        }
        if(err.keyValue.email){
            errors.email = "email already exists";
        }
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    } 
    return errors;
}

const maxAge = 3*24*60*60;

function createToken(id,username){
    return jwt.sign({id,username},'icandothisallday', {expiresIn: maxAge})
}



module.exports.signup_post = async (req,res) =>{
    const {username,email,password} = req.body;
    console.log(req.body);
    try{
        const user = await User.create({username,email,password});
        const token = createToken(user._id,user.username);
        console.log("token",token)
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user}); 
    }
    catch(err){
        const errors = handleErrors(err);
        console.log(errors)
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id,user.username);
        console.log("token",token)
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req,res) =>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
    
}

module.exports.profile_get = (req,res)=>{
    const token = req.cookies.jwt;
    console.log(req.cookies)
    if(!token){
      return res.status(401).json({error:'Token not found'})
    }
    jwt.verify(token,'icandothisallday',{},(err,info)=>{
      if(err) {
        return res.status(401).json({error:'Invalid token'})
      }
      res.json(info);
    })
    
  }