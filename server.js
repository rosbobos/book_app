'use strict';

const express = require('express');
require ('dotenv').config();
require('ejs');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(request, response){
  response.render('pages/index');
});

app.get('/hello', function(request, response){
  response.render('pages/error');
});

app.listen(PORT, () => {console.log(`turned up on ${PORT}`)});
