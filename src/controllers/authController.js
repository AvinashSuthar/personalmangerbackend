const crypto = require('crypto');
const User = require('../models/userModel');
const sendMail = require('../utils/mailer');
const bcrypt = require('bcryptjs');
exports.forgetPass = async (req, res)=>{
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'user does not exist' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
    const mail = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification OTP</title>
    </head>
    <body>
        <p>Dear User,</p>
        <p>Your One Time Password (OTP) for email verification is:</p>
        <h1 style="font-size: 2em; margin-bottom: 20px;">${otp}</h1>
        <p>Please use this OTP to verify your email address. This OTP is valid for 10 minutes.</p>
        <p>If you did not request this OTP, please ignore this email. Your account security is important to us.</p>
        <p>Thank you for using our service.</p>
        <p>Best regards,</p>
        <p>Personal Manager <br> Avinash Suthar</p>
    </body>
    </html>`
    sendMail(email, 'OTP for Email Verification', mail, (err, info) => {
      if (err) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(201).json({ message: 'OTP sent to email' });
    });
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  } catch (error) {
    console.log('Error in signup:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Email not verified' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    user.isVerified = false;
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log('Error in resetPassword:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};




exports.signup = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
    const mail = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification OTP</title>
</head>
<body>
    <p>Dear User,</p>
    <p>Your One Time Password (OTP) for email verification is:</p>
    <h1 style="font-size: 2em; margin-bottom: 20px;">${otp}</h1>
    <p>Please use this OTP to verify your email address. This OTP is valid for 10 minutes.</p>
    <p>If you did not request this OTP, please ignore this email. Your account security is important to us.</p>
    <p>Thank you for using our service.</p>
    <p>Best regards,</p>
    <p>Personal Manager <br> Avinash Suthar</p>
</body>
</html>`
    sendMail(email, 'OTP for Email Verification', mail, (err, info) => {
      if (err) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(201).json({ message: 'OTP sent to email' });
    });
    const newUser = new User({ username: "", email,  otp, otpExpires });
    await newUser.save();
  } catch (error) {
    console.log('Error in signup:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ error: 'Invalid OTP or email' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
