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
app.use(express.static('./public'));

// app.use(express.static('public'));
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', err => catchError(err));
client.connect()
  .then(() => {
    app.listen(PORT, ()=>{
      console.log(`turned up on ${PORT}`)
    })
  })

app.get('/', homePage);
app.get('/searches', searchPage);
app.get('/searches/form', formPage);
// app.get('/searches/show', showPage);
app.post('/books', addBook)
app.get('/books/:id',getBook);
// app.post('/searches/new', addBook);
app.post('/searches', searchForBooks);



function homePage(request, response) {
  const sql = 'SELECT * FROM books;';
  // console.log('in newsearch for books');

  client.query(sql)
    .then(sqlResults => {
      const bookArray = sqlResults.rows;
      console.log(bookArray);
      response.render('pages/index', {books: bookArray});      
    })
    .catch(catchError);
}

function showPage(request, response){
  let {title, author, description, bookshelf} = request.body;
  let sql = 'INSERT INTO books (title, author, description, bookshelf) VALUES ($1, $2, $3, $4) RETURNING ID;';
  let safeValues = [title, author, description, bookshelf];

  client.query(sql, safeValues)
    .then(results =>{
      const id = results.rows[0].id;
      response.redirect(`/books/${id}`)
    })
    .catch(catchError);
}

function searchPage(request, response){
  response.render('pages/searches/new');
}

function getBook(request, response){
  let id = request.params.id;
  let sql = 'SELECT * FROM books WHERE id= $1;';
  let safeValues = [id];
  client.query(sql, safeValues)
    .then(result =>{
      let bookWeGet = results.rows[0];
      response.render('pages/books/details', {book: bookWeGet});
    })
    .catch(catchError);
    
}

function addBook(request, response){
  console.log('you made it============================')
let {book_image, title, author, description, isb, bookshelf} = request.body;
let sql = 'INSERT INTO books (book_image, title, author, description, isb, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
let values = [book_image, title, author, description, isb, bookshelf];
return client.query(sql, values)
  .then(response.redirect('/'))
  .catch(catchError);
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
      // console.log(results.body.items[0].volumeInfo.imageLinks.thumbnail);
      const bookArray = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      })
      // console.log(bookArray);
      response.status(200).render('pages/searches/show', {bookArray: bookArray});
    })
  
    .catch(catchError);
}

function catchError(error){
  console.error(error);
  alert('Sorry there is an error, please try again later.')
}


function Book(bookObj) {
  console.log(bookObj, '=====================================================================================================================');
  // const bookImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.book_image = (bookObj && bookObj.imageLinks && bookObj.imageLinks.thumbnail) || `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';
  // this.book_image = `https://i.imgur.com/J5LVHEL.jpg`;
  this.author = bookObj.author || 'no author available';
  this.description = bookObj.description || 'no description available';
  this.isb = bookObj.isb || 'no isb available';
  this.bookshelf = bookObj.bookshelf || 'no input';

}

// app.listen(PORT, () => { console.log(`turned up on ${PORT}`) });
