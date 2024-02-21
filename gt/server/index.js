const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webRoutes = require('./routes/webRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('./middleware/routeMiddleware');
const app = express();

// middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());


const dbURI = 'mongodb://127.0.0.1:27017/Users';
mongoose.connect(dbURI)
  .then((result) => app.listen(4000))
  .catch((err) => console.log(err));

// app.get('*', checkUser);



app.use(webRoutes);