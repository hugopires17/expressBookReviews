const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Verifica se username e password foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  // Verifica se o nome de usuário já está registrado
  if (isValid(username)) {
    return res.status(409).json({ message: "Nome de usuário já registrado." });
  }

  // Salva o novo usuário
  users.push({ username, password });

  return res.status(200).json({ message: "Usuário registrado com sucesso!" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      res.send(book);
  } else {
      res.status(404).send({ message: "Livro não encontrado." });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  for (let key in books) {
      if (books[key].author === author) {
          matchingBooks.push({ isbn: key, ...books[key] });
      }
  }

  if (matchingBooks.length > 0) {
      res.send(matchingBooks);
  } else {
      res.status(404).send({ message: "Autor não encontrado." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const matchingBooks = [];

    for (let key in books) {
        if (books[key].title === title) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }

    if (matchingBooks.length > 0) {
        res.send(matchingBooks);
    } else {
        res.status(404).send({ message: "Título não encontrado." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.send(book.reviews);
    } else {
        res.status(404).send({ message: "Nenhuma avaliação encontrada para este ISBN." });
    }
});

module.exports.general = public_users;
