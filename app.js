const express = require('express');
const bodyParser= require('body-parser')
const routes= require('./routes/index')
const mongoose = require('mongoose')

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('connected to db');
});

const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
  req.user = {
    _id: '6493617da90c8877bb9c66cc'
  };
  next();
});

app.use(routes)

app.listen(PORT, () => {
  console.log(`server is on the ${PORT}`)
});