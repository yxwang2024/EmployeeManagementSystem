const nodemailer =require('nodemailer');
require('dotenv').config();
const emailService = require('./services/emailServices');



//test sending email
const toEmail = 'fechuwa@gmail.com';
const subject = 'Test 1';
const html = '<h1>Hi how are you</h1>';
emailService.sendEmail(toEmail,subject,html);