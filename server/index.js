const express = require('express');
require('dotenv').config();
// console.log(process.env.JWT_SECRET);
const mongoose = require('mongoose');
const cors = require('cors');
const webRoutes = require('./routes/webRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

// middleware
app.use(cors({origin: ['https://guidethrough-frontend.vercel.app'],methods:["POST","GET","PUT"],credentials:true}));
//added from stackoverflow
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));
app.use(cookieParser());

app.use(express.json());
app.options('*', cors()); // Enable preflight for all routes

const dbURI = process.env.DB_URL;
mongoose.connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// app.get('*', checkUser);



app.use(webRoutes);
