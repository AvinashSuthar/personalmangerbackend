const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const USER = process.env.USER;
const PASS = process.env.PASS;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: USER,
    pass: PASS
  }
});

const sendMail = (to, subject, text, callback) => {
  const mailOptions = {
    from: USER,
    to,
    subject,
    html: text
  };
  transporter.sendMail(mailOptions, callback);
};

module.exports = sendMail;
