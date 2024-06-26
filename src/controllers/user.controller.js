import User from "../models/user.model.js";
import { CustomHttpError } from "../errors/CustomError.js";
import { logger } from "../loggers/logger.js";

const createUser = async (req, res, next) => {
    try {
        logger.info("Create user API requested");
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
                "It seems user exist with same details."
            );
        }
        const savedUser = await newUser.save();
        const { password: pas, ...userData } = savedUser._doc;

        logger.info("User created");

        return res.status(201).json({
            status: "success",
            data: userData,
            message: "New User has been created",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        logger.info("Update user API requested");
        const { id } = req.params;
        const { name, mobile, email } = req.body;

        const user = await User.findOneAndUpdate(
            { _id: id },
            { name, mobile, email },
            { new: true }
        );

        if (!user) throw new CustomHttpError(404, "User not found");

        logger.info("User updated");

        return res.status(200).json({
            status: "success",
            data: user,
            message: "User updated",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        logger.info("Delete user API requested");
        const { id } = req.params;

        // Checking whether user exist with same details or not
        const existingUser = await User.findById(id);
        if (!existingUser) {
            throw new CustomHttpError(400, "It seems user doesn't exist.");
        }

        await User.findOneAndDelete({ _id: id });

        logger.info("User deleted");

        res.status(204).end();
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        logger.info("Get all users API requested");
        const users = await User.find();

        return res.status(200).json({
            status: "success",
            data: users || [],
            message: "Fetched all users",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const searchUser = async (req, res, next) => {
    try {
        logger.info("Search user API requested");
        const { name } = req.query;

        const users = await User.find({ name: new RegExp(name, "i") });

        return res.status(200).json({
            status: "success",
            data: users || [],
            message: "Searched successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
    
};

const followUser = async (req, res, next) => {
    try {
        logger.info("Follow user API requested");
        const { userIdToFollow } = req.body;
        const user = await User.findById(req.user._id);

        const userToFollow = await User.findOne({ _id: userIdToFollow });

        // Checking whether user exist with same details or not
        if (!user || !userToFollow) throw new CustomHttpError(404, 'User not found.');
        
        // Adding user in follow list
        if (!user.following.includes(userIdToFollow)) {
            user.following.push(userIdToFollow);
            userToFollow.followers.push(user._id);
            await user.save();
            await userToFollow.save();
        }
        logger.info("User followed successfully");
        return res.status(200).json({
            status: "success",
            data: {},
            message: "Followed successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

const unfollowUser = async (req, res, next) => {
    try {
        logger.info("Unfollow user API requested");
        const { userIdToUnfollow } = req.body;
        const user = await User.findById(req.user._id);

        const userToUnfollow = await User.findOne({ _id: userIdToUnfollow });

        // Checking whether user exist with same details or not
        if (!user || !userToUnfollow) throw new CustomHttpError(404, 'User not found.');

        // Updating the follower and following list of the user
        user.following = user.following.filter(followingId => followingId !== userIdToUnfollow);

        userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId !== user._id.toString());
        await user.save();
        await userToUnfollow.save();

        logger.info("User unfollowed successfully");

        return res.status(200).json({
            status: "success",
            data: {},
            message: "Unfollowed successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

export { createUser, updateUser, deleteUser, getAllUsers, searchUser, followUser, unfollowUser };
