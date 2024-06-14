import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { CustomHttpError } from "../errors/CustomError.js";
import { logger } from "../loggers/logger.js";

const registerUser = async (req, res, next) => {
    try {
        logger.info("Register user API requested");
        const { name, email, mobile, password } = req.body;

        // Request body validation
        if (!name || !email || !mobile || !password) {
            throw new CustomHttpError(400, "Required fields are missing");
        }

        const newUser = new User({
            name,
            email,
            mobile,
            password,
        });

        // Checking whether user exist with same details or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomHttpError(
                400,
                "It seems you have already an account, Please login."
            );
        }

        // Saving new user
        const savedUser = await newUser.save();
        const { password: pas, ...userData } = savedUser._doc;

        logger.info("User registered")

        return res.status(201).json({
            status: "success",
            data: userData,
            message: "Thank you for registering with us.",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        logger.info("Login user API requested");
        const { email, password } = req.body;

        // Request body validation required for succefull login
        if (!email || !password) {
            throw new CustomHttpError(
                400,
                "You are missing either email or password."
            );
        }

        // Checking whether exist with given email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new CustomHttpError(
                400,
                "User doesn't exist with provided email."
            );
        }

        // Matchng password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        logger.info("Password comparison done")

        if (!isPasswordValid)
            throw new CustomHttpError(400,
                "Invalid email or password. Please try again with the correct credentials."
            );

        const token = user.generateAccessToken(); // generate session token for user
        
        logger.info("User logged-in");

        res.status(200).json({
            status: "success",
            accessToken: token,
            message: "You have successfully logged in.",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const currentUser = async (req, res, next) => {
    try {
        logger.info("Get current user API requested");
        res.status(200).json({
            status: "success",
            data: req.user,
            message: "Logged in user data fetched successfully",
        })
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

export { registerUser, login, currentUser };
