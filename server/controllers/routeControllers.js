const User = require('../models/User')
const Post = require('../models/Post')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { trusted } = require('mongoose');
function handleErrors(err) {
    let errors = { username: '', email: '', password: '',title:'',description:'' };

    if (err.message === 'Incorrect username') {
        errors.email = 'user not registered'
    }
    if (err.message === 'Incorrect email') {
        errors.email = 'e-mail not registered'
    }
    if (err.message === 'Incorrect password') {
        errors.password = 'incorrect password'
    }
    if (err.code === 11000) {
        if (err.keyValue.username) {
            errors.username = "username already exists";
        }
        if (err.keyValue.email) {
            errors.email = "email already exists";
        }
        return errors;
    }
    // console.log(err.message)
    if(err.message.includes('Post validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    
    if (err.message.includes('user validation failed')) {
        // console.log(err.message)
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

function createToken(id, username) {
    return jwt.sign({ id, username }, 'icandothisallday', { expiresIn: maxAge })
}

module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);  
    try {
        const user = await User.create({ username, email, password });
        const token = createToken(user._id, user.username);
        // console.log("token",token)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        // console.log(errors)
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id, user.username);
        // console.log("token",token)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}



module.exports.profile_get = (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Token not found' })
    }
    jwt.verify(token, 'icandothisallday', {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        //   console.log(info)
        res.json(info);
    })
    // jwt.verify(req.token, 'icandothisallday', (err, decoded) => {
    //     if (err) {
    //       res.sendStatus(403); // Forbidden if token is invalid
    //     } else {
    //       // Token is valid, proceed with handling the request
    //       res.json(decoded); // Send back decoded token information as response
    //     }
    //   });

}

module.exports.create_post = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Token not found' })
    }
    jwt.verify(token, 'icandothisallday', {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        //   console.log(info)
        // console.log(req.body);
        try{
            const postDoc = await Post.create({
                ...req.body,
                author: info.id
            })
            res.json({postDoc})
        }
        catch(err){
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
        
    })
}

module.exports.get_posts = async (req, res) => {
    try {
        const { head,subhead } = req.params;

        // Query posts based on category and subcategory
        const posts = await Post.find({ 
            category: head, 
            subcategory: subhead 
        })
        const authorIds = posts.map(post => post.author);

        // Query authors based on their IDs
        const authors = await User.find({ _id: { $in: authorIds } });

        // Create a map of author IDs to authors for easy lookup
        const authorMap = authors.reduce((map, author) => {
            map[author._id] = author;
            return map;
        }, {});

        // Update each post object with author details
        const postsWithAuthorInfo = posts.map(post => {
            return {
                ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                author: authorMap[post.author]
            };
        });

        res.json(postsWithAuthorInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
        // console.log(posts)
        // res.json(posts);
        
    
}