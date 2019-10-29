'use strict';

const express = require('express');
require ('dotenv').config();
require('ejs');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', newSearch);
app.post('/searches', searchForBooks);

function newSearch(request, response) {
  response.render('pages/index');
}

function searchForBooks(request, response) {
  console.log(request.body.search);
  const bookSearchedFor = request.body.search[0];
  const typeOfSearch = request.body.search[1];

  // let url = 
}

app.listen(PORT, () => {console.log(`turned up on ${PORT}`)});
