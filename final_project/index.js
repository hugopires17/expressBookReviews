const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = require("express").Router();

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth", function auth(req,res,next){
 // Verifica se existe uma sessão ativa e um token
 if (req.session && req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user; // Armazena os dados do usuário decodificados
        return next();   // Prossegue com a requisição
      } else {
        return res.status(403).json({ message: "Usuário não autenticado" });
      }
    });
  } else {
    return res.status(403).json({ message: "Usuário não logado" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
