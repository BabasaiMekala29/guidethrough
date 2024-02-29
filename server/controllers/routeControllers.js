const User = require('../models/User')
const Post = require('../models/Post')
const Bookmarks = require('../models/Bookmarks')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { trusted } = require('mongoose');
function handleErrors(err) {
    let errors = { username: '', email: '', password: '', title: '', description: '' };

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
    if (err.message.includes('Post validation failed')) {
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
        // console.log(user);
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
        try {
            const postDoc = await Post.create({
                ...req.body,
                author: info.id
            })
            res.json({ postDoc })
        }
        catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }

    })
}

module.exports.get_posts = async (req, res) => {
    try {
        const { head, subhead } = req.params;

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

module.exports.get_userposts = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({
            author: id
        })
        res.json({ posts });
    }
    catch (err) {
        res.status(400).json({ err });
    }


}

module.exports.delete_post = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // If the post exists, delete it
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.edit_post = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    // console.log(title,description)
    try {
        // Find the post by ID
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post with the new data
        post.title = title;
        post.description = description;
        await post.save();

        res.json(post); // Send back the updated post
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_upvote = async (req, res) => {
    const { postid } = req.params;
    const { upvote, user } = req.body;
    const post = await Post.findById(postid);
    try {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post with the new data
        if (!post.upvotes.includes(user)) {
            post.upvote = upvote
            post.upvotes.push(user);
            await post.save();
        }
        res.json(post);

    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.put_downvote = async (req, res) => {
    const { postid } = req.params;
    const { downvote, user } = req.body;
    const post = await Post.findById(postid);
    try {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post with the new data
        if (!post.downvotes.includes(user)) {
            post.downvote = downvote
            post.downvotes.push(user);
            await post.save();
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.put_like = async (req, res) => {
    const { postid } = req.params;
    const { likes, user } = req.body;
    const post = await Post.findById(postid);
    try {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post with the new data
        if (!post.loves.includes(user)) {
            post.likes = likes
            post.loves.push(user);
            await post.save();
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.save_post = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;
    try {
        const postDoc = await Post.findById(postid);
        const userDoc = await User.findById(user);
        const doc = await Bookmarks.findOne({
            userinfo: user
        })
        // console.log(doc);
        // console.log('ejk',!doc)
        if (!doc) {
            console.log('ijenejk')
            const newDoc = await Bookmarks.create({
                userinfo: user,
                saves: [postDoc],
            })

            res.json(newDoc);
            console.log("newdoc ", newDoc)
        }

        else {
            if (!doc.saves.includes(postDoc._id)) {
                doc.saves.push(postDoc);
                await doc.save();
            }
            res.json(doc);
        }

    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_savedposts = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Bookmarks.findOne({
            userinfo: id
        }).populate('saves', ['title', 'description', 'category', 'subcategory', 'section', 'createdAt']);
        console.log("saves ",posts.saves);
        res.json(posts.saves);
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

module.exports.unsavepost = async (req, res) => {
    const { postid } = req.params;
    const { id } = req.body;
    console.log(id);
    try{
        const posts = await Bookmarks.findOne({
            userinfo: id
        })
        const index = posts.saves.findIndex(post => post._id.toString() === postid);
        if (index !== -1) {
            posts.saves.splice(index, 1);
            await posts.save();
        }
        console.log("index ",index);
        
        res.json(posts.saves);
    }
    catch (err) {
        res.status(400).json({ error: 'Internal server error' });
    }
    


}