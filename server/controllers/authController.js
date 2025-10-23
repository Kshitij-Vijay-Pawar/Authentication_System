import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {

    const {name, email, password} = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({success: false, message: 'Missing Details'});
    }

    try {
        
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(409).json({success: false, message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });


        // Sending welcome email 
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Platform',
            text: `Hello ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`
        };
        await transporter.sendMail(mailOptions);


        return res.status(201).json({success: true, message: 'User registered successfully'});

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
        console.log("hello")
        console.log(error.message);
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: 'Email and Password are required'});
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        

        if (!isMatch) {
            return res.status(401).json({success: false, message: 'Invalid password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({success: true, message: 'Logged in successfully'});

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({success: true, message: 'Logged out successfully'});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

// Send verification OTP to user's email

export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;    // Changed from req.params to req.body since userId is attached to body in middleware
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        if(user.isAccountVerified) {
            return res.status(400).json({success: false, message: 'Account already verified'});
        }

        // Generate OTP and expiry time
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Verification OTP',
            text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team`
        }
        
        await transporter.sendMail(mailOptions);
        return res.status(200).json({success: true, message: 'Verification OTP sent to Email'});
        
    } catch (error) {
        return res.status(500).json({success: false, message: 'Error sending OTP: ' + error.message});
    }
}


// Verify OTP and activate user account
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if (!userId || !otp) {
        return res.status(400).json({success: false, message: 'Missing Details'});
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({success: false, message: 'User does not exist'});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({success: false, message: 'Invalid OTP'});
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: 'OTP has expired'});
        }
        
        // Account verified successfully
        user.isAccountVerified = true;
        user.verifyOtp = '';            // Clear OTP after successful verification
        user.verifyOtpExpireAt = 0;     // Clear expiry time
        await user.save();

        return res.status(200).json({success: true, message: 'Account verified successfully'});

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({success: true, message: 'User is authenticated'});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

// Send Password Reset OTP to user's email
export const sendResetOtp = async (req, res) => {

    const {email} = req.body;
        if (!email) {
            return res.status(400).json({success: false, message: 'Email is required'});
        }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        // Generate OTP and expiry time
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Password Reset OTP',
            text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team`
        }
        
        await transporter.sendMail(mailOptions);
        return res.status(200).json({success: true, message: 'Password Reset OTP sent to Email'});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}


// Reset User Password using OTP
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({success: false, message: 'Missing Details'});
    }

    try {
        
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: 'User does not exist'});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({success: false, message: 'Invalid OTP'});
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: 'OTP has expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';            // Clear OTP after successful password reset
        user.resetOtpExpireAt = 0;     // Clear expiry time
        await user.save();

        return res.status(200).json({success: true, message: 'Password reset successfully'});

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}