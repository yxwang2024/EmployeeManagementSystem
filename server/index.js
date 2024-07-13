// const nodemailer =require('nodemailer');
// require('dotenv').config();
// const emailService = require('./services/emailServices');



// //test sending email
// const toEmail = 'fechuwa@gmail.com';
// const subject = 'Test 1';
// const html = '<h1>Hi how are you</h1>';
// emailService.sendEmail(toEmail,subject,html);

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});