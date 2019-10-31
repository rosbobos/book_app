'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');
require('ejs');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3001;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  console.error(err);
})
client.connect()
  .then(() => {
    app.listen(PORT, ()=>{
      console.log(`turned up on ${PORT}`)
    })
  })

app.get('/', homePage);
// TODO: check to get all app.get for functions for new pages
// app.get('/searches/show', )
app.post('/searches/new', addBook);
app.post('/searches', searchForBooks);
app.get('/searches', searchPage);
app.get('/searches/form', formPage);


function homePage(request, response) {
  const sql = 'SELECT * FROM books;';
  // console.log('in newsearch for books');

  client.query(sql)
    .then(sqlResults => {
      const bookArray = sqlResults.rows;
      console.log(bookArray);
      response.render('pages/index', {books: bookArray});      
    })
    .catch(err =>{
      console.error(err);
    })
}

function searchPage(request, response){
  response.render('pages/searches/new');
}

function addBook(request, response){
let {book_image, title, author, description, isb, bookshelf} = request.body;
let sql = 'INSERT INTO book_app (book_image, title, author, description, isb, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
let values = [book_image, title, author, description, isb, bookshelf];
return client.query(sql, values)
  .then(response.redirect('/'))
  .catch(err => console.error(err));
}

function formPage(request, response){
  response.render('pages/searches/form');
}

function searchForBooks(request, response) {

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
  // const bookImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.book_image = bookObj.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';
  this.author = bookObj.author || 'no author available';
  this.description = bookObj.description || 'no description available';
  this.isb = bookObj.isb || 'no isb available';
  this.bookshelf = bookObj.bookshelf || 'no input';

}

// app.listen(PORT, () => { console.log(`turned up on ${PORT}`) });
