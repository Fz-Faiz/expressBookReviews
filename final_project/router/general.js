const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 1. Get the book list available in the shop (Task 10)
public_users.get('/', async function (req, res) {
  try {
    const response = await Promise.resolve(books); 
    res.send(JSON.stringify(response, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// 2. Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Using a Promise as required
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// 3. Get book details based on author (Task 12)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Using Async/Await as required
    const booksByAuthor = await Promise.resolve(
      Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase())
    );
    
    if (booksByAuthor.length > 0) {
      res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// 4. Get all books based on title (Task 13)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await Promise.resolve(
      Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
    );

    if (booksByTitle.length > 0) {
      res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// 5. Get book review (Standard GET)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// 6. Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user (missing username/password)."});
});

module.exports.general = public_users;