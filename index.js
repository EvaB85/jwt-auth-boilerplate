require ('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt')
const auth = require('./routes/auth');
//ADDED
const locked = require('./routes/locked');


const app = express();
// This line lets us accept POST data from axios
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

mongoose.connect('mongodb://localhost/jwtAuth');

app.use(express.static(__dirname + '/client/build'));

app.use('/auth', auth);
//ADDED
app.use('/locked', expressJWT({secret: process.env.JWT_SECRET}).unless({method: 'POST'}), locked);

// commented out below b/c using bcrypt
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
})

var port = process.env.PORT || 3000;

var server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
});

module.exports = server;
