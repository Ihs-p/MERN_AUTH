const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } = require("../config/emailTemplates");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.json({ success: false, message: "missing details" });

  try {
    const existringuser = await User.findOne({ email });
    if (existringuser)
      return res.json({ success: false, message: "User already exists" });

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedpassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.jwt_secret,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to our app",
      text: `welcome to our app,your account has been created with this email id: ${email}  `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({
      success: false,
      message: "email and password are required",
    });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.json({ success: false, message: "inavalid email" });

    const ismMatch = await bcrypt.compare(password, user.password);

    if (!ismMatch)
      return res.json({ success: false, message: "inavalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.jwt_secret,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification otp",
      // text: `your otp is ${otp}.  verify your account using this otp`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),

    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "verification otp is send to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      return res.json({ success: false, message: "invalid otp" });
    }

    if (user.verifyOtpExpAt < Date.now()) {
      return res.json({ success: false, message: "otp expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpAt = 0;
    await user.save();
    res.json({ success: true, message: "email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const isAuthenticated = async (req, res, next) => {
  
  try {

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
  
// send password reset otp
const sendResetOtp = async (req, res, next) => {

  const {email} = req.body

  if(!email){
    return res.json({ success: false, message: "email is required" });
  }
  
  try {

    const user = await User.findOne({email})
    if(!user){
      return res.json({ success: false, message: "user not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));


    user.resetOtp = otp;
    user.resetOtpExpAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset otp",
      // text: `your otp for resetting your password is ${otp}.  use this otp to proceed with resetting your password`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: " otp is send to email" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}


const resetPassword = async (req, res, next) => {
  const {email, otp, newPassword} = req.body
  if(!email || !otp || !newPassword){
    return res.json({ success: false, message: "missing details" });
  }  
  try {
    const user = await User.findOne({email})
    if(!user){
      return res.json({ success: false, message: "user not found" });
    }
    if(user.resetOtp !== otp || user.resetOtp === ""){
      return res.json({ success: false, message: "invalid otp" });
    }
    if(user.resetOtpExpAt < Date.now()){  
      return res.json({ success: false, message: "otp expired" });    
    }

    const hashedpassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedpassword;
    user.resetOtp  = ''
    user.resetOtpExpAt = 0
    await user.save();

    return res.json({ success: true, message: "password reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
module.exports = { register, login, logout, sendVerifyOtp, verifyEmail,isAuthenticated, sendResetOtp, resetPassword };
