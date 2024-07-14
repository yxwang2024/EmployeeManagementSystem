const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
});

function sendEmail(toEmail,subject,html) {
  return transporter.sendMail({
    to: toEmail,
    subject: subject,
    html: html
  });
}

module.exports = { sendEmail };



// //test sending email
// const emailService = require('./services/emailServices');

// const toEmail = 'fechuwa@gmail.com';
// const subject = 'Test 1';
// const html = '<h1>Hi how are you</h1>';
// emailService.sendEmail(toEmail,subject,html);