const {Router} = require('express');
const Post = require('../models/Post')
const routeController = require('../controllers/routeControllers')
const router = Router();

// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['Authorization'];
//     console.log(bearerHeader)
//     if (typeof bearerHeader !== 'undefined') {
//       const bearerToken = bearerHeader.split(' ')[1]; // Extract token from "Bearer <token>"
//       req.token = bearerToken; // Set token in request object for further processing
//       next(); // Move to next middleware or route handler
//     } else {
//       // If no token provided
//       res.sendStatus(403); // Forbidden
//     }
//   }

router.post('/signup', routeController.signup_post);
router.post('/login', routeController.login_post);
router.post('/logout', routeController.logout_get);
router.get('/profile',routeController.profile_get);
router.post('/post',routeController.create_post);
router.get('/category/:head/:subhead', routeController.get_posts);
router.get('/user/:id',routeController.get_userposts);
router.get('/post/:id',routeController.delete_post);
router.put('/edit/post/:id',routeController.edit_post)
module.exports = router;