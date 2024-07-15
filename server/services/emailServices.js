// const nodemailer = require('nodemailer');
// require('dotenv').config();
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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

export {sendEmail};
