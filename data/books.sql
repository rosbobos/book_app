DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  book_image VARCHAR(255),
  title VARCHAR(100),
  author VARCHAR(50),
  description VARCHAR(255),
  isb VARCHAR(30),
  bookshelf VARCHAR(100)
);

INSERT INTO books (title, author, bookshelf) VALUES ('Harry potter', 'J.K. Rowling', 'da best');
