'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');
const superagent = require('superagent');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// app.use(express.static('public'));
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  console.error(err);
})

app.get('/', newSearch);
// TODO: check to get all app.get for functions for new pages
// app.get('/searches/show', )
app.post('/searches', searchForBooks);


function newSearch(request, response) {
  const sql = 'SELECT * FROM books;';

  client.query(sql)
    .then(sqlResults => {
      const bookArray = sqlResults.rows;
      response.render('pages/index', {books: bookArray});      
    })
}

function searchForBooks(request, response) {
  console.log(request.body.search);
  const bookSearchedFor = request.body.search[0];
  const typeOfSearch = request.body.search[1];


  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if (typeOfSearch === 'title') {
    url += `+intitle:${bookSearchedFor}`;
  }
  
  if (typeOfSearch === 'author') {
    url += `+inauthor:${bookSearchedFor}`;
  }
  
  superagent.get(url)
    .then(results => {
      // console.log(results.body.items);
      const bookArray = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      })
      console.log(bookArray);
      response.status(200).render('pages/searches/show', {bookArray: bookArray});
    })
  
    .catch(error => {
      console.error('ruh roh, we messed up!');
    })
}



function Book(bookObj) {
  const bookImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';

}

app.listen(PORT, () => { console.log(`turned up on ${PORT}`) });
