const User = require('../models/User');
const Post = require('../models/Post');
const Bookmarks = require('../models/Bookmarks');
const Notifications = require('../models/Notifications');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { trusted, connect } = require('mongoose');
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
            // console.log(postDoc)
            res.json({ postDoc })
        }
        catch (err) {
            const errors = handleErrors(err);
            // console.log("errors ",errors);
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
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already upvoted the post
        const alreadyUpvoted = post.upvotes.includes(user);
        const alreadyDownvoted = post.downvotes.includes(user);

        if (alreadyUpvoted) {
            // Remove user from upvotes array and decrease upvote count
            post.upvote = post.upvote - 1;
            post.upvotes = post.upvotes.filter(upvoter => upvoter !== user);
        } else {
            if (alreadyDownvoted) {
                post.downvote = post.downvote - 1;
                post.downvotes = post.downvotes.filter(downvoter => downvoter !== user);
            }
            // Add user to upvotes array and increase upvote count
            post.upvote = post.upvote + 1;
            post.upvotes.push(user);
        }

        // Save the updated post
        await post.save();

        res.status(200).json({ up: post.upvote, down: post.downvote });
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.put_downvote = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already downvoted the post
        const alreadyDownvoted = post.downvotes.includes(user);
        const alreadyUpvoted = post.upvotes.includes(user);
        if (alreadyDownvoted) {
            // Remove user from downvotes array and decrease downvote count
            post.downvote = post.downvote - 1;
            post.downvotes = post.downvotes.filter(downvoter => downvoter !== user);
        } else {
            if (alreadyUpvoted) {
                post.upvote = post.upvote - 1;
                post.upvotes = post.upvotes.filter(upvoter => upvoter !== user);
            }
            // Add user to downvotes array and increase downvote count
            post.downvote = post.downvote + 1;
            post.downvotes.push(user);
        }

        // Save the updated post
        await post.save();
        res.status(200).json({ up: post.upvote, down: post.downvote });
        // res.status(200).json({ message: 'Downvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_like = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already liked the post
        const alreadyLiked = post.loves.includes(user);

        if (alreadyLiked) {
            // Remove user from loves array and decrease like count
            post.likes = post.likes - 1;
            post.loves = post.loves.filter(liker => liker !== user);
        } else {
            // Add user to loves array and increase like count
            post.likes = post.likes + 1;
            post.loves.push(user);
        }

        // Save the updated post
        await post.save();
        res.status(200).json(post.likes);
        // res.status(200).json({ message: 'like toggled successfully' });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.save_post = async (req, res) => {
    const { postid } = req.params;
    const { user, cmtId } = req.body;
    try {
        const postDoc = await Post.findById(postid);
        let i;
        for (i = 0; i < postDoc.comments.length; i++) {

            if (postDoc.comments[i]._id.toString() === cmtId) {
                postDoc.comments[i].booked = true;
            }
        }
        await postDoc.save();
        const userDoc = await User.findById(user);
        const doc = await Bookmarks.findOne({
            userinfo: user
        })
        // console.log(postDoc);
        // console.log('ejk',!doc)
        if (!doc) {
            // console.log('ijenejk')
            const newDoc = await Bookmarks.create({
                userinfo: user,
                saves: [postDoc],
            })

            res.json(newDoc);
            // console.log("newdoc ", newDoc)
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
        }).populate('saves', ['title', 'description', 'category', 'subcategory', 'section', 'createdAt', 'comments']);
        // console.log("saves ", posts.saves);
        res.json(posts.saves);
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

module.exports.unsavepost = async (req, res) => {
    const { postid } = req.params;
    const { id } = req.body;
    // console.log(id);
    try {
        const postDoc = await Post.findById(postid);
        let i;
        for (i = 0; i < postDoc.comments.length; i++) {
            postDoc.comments[i].booked = false;
        }
        await postDoc.save();
        const posts = await Bookmarks.findOne({
            userinfo: id
        })
        const index = posts.saves.findIndex(post => post._id.toString() === postid);
        if (index !== -1) {
            posts.saves.splice(index, 1);
            await posts.save();
        }
        // console.log("index ", posts.saves);

        res.json(posts.saves);
    }
    catch (err) {
        res.status(400).json({ error: 'Internal server error' });
    }
}

module.exports.get_sortedposts = async (req, res) => {
    const { head, subhead, sec } = req.params;
    try {
        //Popular, Most Useful, Recent, None
        let posts;
        if (sec === "Popular") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ upvote: -1 })
        }
        else if (sec === "Most Useful") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ likes: -1 })
        }
        else if (sec === "Recent") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ createdAt: -1 })
        }
        else {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            })
        }

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
}

module.exports.put_comments = async (req, res) => {
    const { postid } = req.params;
    const { user, comment } = req.body;
    try {
        const post = await Post.findById(postid);
        post.comments.push({ user, comment });
        await post.save();
        res.json(post.comments);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_comments = async (req, res) => {
    const { postid } = req.params;
    try {
        const post = await Post.findById(postid);
        res.json(post.comments);
    }
    catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_fullPost = async (req, res) => {
    const { id } = req.params;
    // console.log("id ",id);
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        const author = await User.findById(post.author);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        // Merge the author data into the post object
        const postWithAuthor = {
            ...post.toObject(), // Convert Mongoose document to plain JavaScript object
            author: {
                _id: author._id,
                username: author.username,
                // Add more author fields if needed
            }
        };

        res.json(postWithAuthor);

        // const authname = post.author.username;
        // console.log(post);
        // res.json(post);

    }

    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.get_upvotecount = async (req, res) => {
    const { id } = req.params;
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        // const authname = post.author.username;


        res.json(post.upvote);
    }
    catch (error) {
        console.error('Error fetching upvotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_downvotecount = async (req, res) => {
    const { id } = req.params;
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        // const authname = post.author.username;


        res.json(post.downvote);
    }
    catch (error) {
        console.error('Error fetching downvotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_likecount = async (req, res) => {
    const { id } = req.params;
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        // const authname = post.author.username;


        res.json(post.likes);
    }
    catch (error) {
        console.error('Error fetching downvotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_cmtupvotes = async (req, res) => {
    const { pid, cid } = req.params;
    // console.log("pid",pid);
    // console.log("cid",cid);
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(pid);
        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                // console.log("1")
                comment = cmt;
            }
        }
        // const authname = post.author.username;
        // console.log(comment.comUpvote);

        res.json(comment.comUpvote);
    }
    catch (error) {
        console.error('Error fetching comment upvotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_cmtdownvotes = async (req, res) => {
    const { pid, cid } = req.params;
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(pid);
        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                comment = cmt;
            }
        }
        // const authname = post.author.username;


        res.json(comment.comDownvote);
    }
    catch (error) {
        console.error('Error fetching comment upvotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_comupvote = async (req, res) => {
    const { pid, cid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(pid);

        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                comment = cmt;
            }
        }

        // Check if the user has already upvoted the comment
        const alreadyUpvoted = comment.upvoters.includes(user);
        const alreadyDownvoted = comment.downvoters.includes(user);
        if (alreadyUpvoted) {
            // Remove user from upvotes array and decrease upvote count
            comment.comUpvote = comment.comUpvote - 1;
            comment.upvoters = comment.upvoters.filter(upvoter => upvoter !== user);
        } else {
            if (alreadyDownvoted) {
                comment.comDownvote = comment.comDownvote - 1;
                comment.downvoters = comment.downvoters.filter(downvoter => downvoter !== user);
            }
            // Add user to upvotes array and increase upvote count
            comment.comUpvote = comment.comUpvote + 1;
            comment.upvoters.push(user);
        }

        // Save the updated post
        // await comment.save();
        await post.save();
        res.status(200).json({ up: comment.comUpvote, down: comment.comDownvote });
        // res.status(200).json({ message: 'upvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_comdownvote = async (req, res) => {
    const { pid, cid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(pid);
        console.log(post)
        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                comment = cmt;
            }
        }

        // Check if the user has already downvoted the comment
        const alreadyDownvoted = comment.downvoters.includes(user);
        const alreadyUpvoted = comment.upvoters.includes(user);
        if (alreadyDownvoted) {
            // Remove user from downvotes array and decrease downvote count
            comment.comDownvote = comment.comDownvote - 1;
            comment.downvoters = comment.downvoters.filter(downvoter => downvoter !== user);
        } else {
            if (alreadyUpvoted) {
                comment.comUpvote = comment.comUpvote - 1;
                comment.upvoters = comment.upvoters.filter(upvoter => upvoter !== user);
            }
            // Add user to downvotes array and increase downvote count
            comment.comDownvote = comment.comDownvote + 1;
            comment.downvoters.push(user);
        }

        // Save the updated post
        // await comment.save();
        await post.save();
        res.status(200).json({ up: comment.comUpvote, down: comment.comDownvote });
        // res.status(200).json({ message: 'Downvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_notification = async (req, res) => {
    const { id } = req.params;
    const { user, post, by, comment, category, subcategory, section } = req.body;
    console.log('user', user);
    console.log('post', post);
    console.log('by', by);
    console.log('comment', comment);
    console.log('category', category);
    console.log('subcategory', subcategory);
    console.log('section', section);
    try {
        const doc = await Notifications.findOne({
            userinfo: user
        })
        if (!doc) {
            const newDoc = await Notifications.create({
                userinfo: user,
                notifs: [{ commentText: comment, postDetails: post, by, category, subcategory, section }],
            })

            res.json(newDoc);
        }

        else {
            doc.notifs.push({ commentText: comment, postDetails: post, by, category, subcategory, section });
            await doc.save();
            res.json(doc);
        }

        // console.log("notificaion dhi ", doc);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.get_notifications = async (req, res) => {
    const { userid } = req.params;
    // console.log('userid  ', userid)
    try {
        const notifications = await Notifications.findOne({ userinfo: userid });

        res.json(notifications.notifs);

    }
    catch (err) {
        res.status(500).json({ error: 'Cannot find user' });
    }
}

module.exports.get_searchresults = async (req, res) => {
    const { searchValue } = req.params;
    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: searchValue, $options: 'i' } }, // Case-insensitive search
                { description: { $regex: searchValue, $options: 'i' } }
            ]
        });
        // console.log(posts);
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
        // console.log(postsWithAuthorInfo)
        res.json(postsWithAuthorInfo);

    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}