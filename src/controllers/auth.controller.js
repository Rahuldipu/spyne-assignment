import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { CustomHttpError } from "../errors/CustomError.js";

const registerUser = async (req, res, next) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            throw new CustomHttpError(400, "Required fields are missing");
        }

        const newUser = new User({
            name,
            email,
            mobile,
            password,
        });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomHttpError(
                400,
                "It seems you have already an account, Please login."
            );
        }
        const savedUser = await newUser.save();
        const { password: pas, ...userData } = savedUser._doc;

        return res.status(201).json({
            status: "success",
            data: userData,
            message: "Thank you for registering with us.",
        });
    } catch (error) {
        console.log("Something went wrong");
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomHttpError(
                400,
                "You are missing either email or password."
            );
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new CustomHttpError(
                400,
                "User doesn't exist with provided email."
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            throw new CustomHttpError(400,
                "Invalid email or password. Please try again with the correct credentials."
            );

        let options = {
            maxAge: 24 * 60 * 60 * 1000, // would expire in 1 day
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = user.generateAccessToken(); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
        });
    } catch (error) {
        console.log("Something went wrong");
        return next(error);
    }
};

const currentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "success",
            data: req.user,
            message: "Logged in user data fetched successfully",
        })
    } catch (error) {
        console.log("Something went wrong");
        return next(error);
    }
}

export { registerUser, login, currentUser };
