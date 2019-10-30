DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  picture VARCHAR (255),
  title VARCHAR(100),
  author VARCHAR(50),
  descriptioon VARCHAR(255),
  isb VARCHAR(30),
  bookshelf VARCHAR(100)
);
