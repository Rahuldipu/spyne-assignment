import { CustomHttpError } from "../errors/CustomError.js";
import { logger } from "../loggers/logger.js";
import { Comment, Like, Post } from "../models/post.model.js";

const createPost = async (req, res, next) => {
    try {
        logger.info("Create post API requested");
        const { text, hashtags } = req.body;
        const imageUrl = req.file ? req.file.location : null;

        const newPost = new Post({
            user: req.user._id,
            text,
            imageUrl,
            hashtags: hashtags.split(","),
        });

        const savedPost = await newPost.save();

        logger.info("Post created successfully");

        return res.status(201).json({
            status: "success",
            data: savedPost,
            message: "Post created successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        logger.info("Update post API requested");
        const { id } = req.params;
        const { text, hashtags } = req.body;

        // Checking whether post exist or not
        let post = await Post.findOne({ _id: id });
        if (!post) throw new CustomHttpError(404, "Post not found.");

        const imageUrl = req.file ? req.file.location : post.imageUrl;

        // Updating post
        post = await Post.findOneAndUpdate(
            { _id: id },
            { text, imageUrl, hashtags: hashtags.split(",") },
            { new: true }
        );

        logger.info("Post updated successfully");

        return res.status(200).json({
            status: "success",
            data: post,
            message: "Post updated successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

// TODO - Delete media from s3 Bucket
const deletePost = async (req, res, next) => {
    try {
        logger.info("Delete post API requested");
        const { id } = req.params;

        // Checking whether post exist or not
        let post = await Post.findOne({ _id: id, user: req.user._id });
        if (!post) throw new CustomHttpError(404, "Post not found or you don't have access to delete this post");

        // Deleting connected likes and comments
        await Comment.deleteMany({ post: post._id });
        await Like.deleteMany({ post: post._id });

        logger.info("Connected Like and Comment deleted");

        await Post.findOneAndDelete({ _id: id });

        logger.info("Post deleted successfully");

        res.status(204).end();
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const postSearchByTags = async (req, res, next) => {
    try {
        logger.info("Post search by tags API requested");
        const { tags } = req.query;
        const tagList = tags.split(",");

        const posts = await Post.find({ hashtags: { $in: tagList } });

        logger.info("Post successfully fetched by given tags");
        return res.status(200).json({
            status: "success",
            data: posts,
            message: "Post fetched successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const postSearchByText = async (req, res, next) => {
    try {
        logger.info("Post search by text API requested");
        const { text } = req.query;

        const posts = await Post.find({ text: new RegExp(text, "i") });
        logger.info("Post successfully fetched by given text");

        return res.status(200).json({
            status: "success",
            data: posts,
            message: "Post fetched successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const postComment = async (req, res, next) => {
    try {
        logger.info("Post comment API requested");
        const { id } = req.params;
        const { text, parent } = req.body;

        // Checking whether post exist or not
        let post = await Post.findOne({ _id: id });
        if (!post) throw new CustomHttpError(404, "Post not found.");

        const newComment = new Comment({
            post: id,
            user: req.user._id,
            text,
            parent,
        });
        const comment = await newComment.save();

        logger.info("Comment added successfully");

        return res.status(201).json({
            status: "success",
            data: comment._doc,
            message: "Comment added successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const postLike = async (req, res, next) => {
    try {
        logger.info("Post like API requested");
        const { id } = req.params;

        // Checking whether post exist or not
        let post = await Post.findOne({ _id: id });
        if (!post) throw new CustomHttpError(404, "Post not found.");

        // Checking whether post already liked by logged-in user or not
        let like = await Like.findOne({ post: id, user: req.user._id });
        if (like)
            return res.status(201).json({
                status: "success",
                data: like,
                message: "Post already liked by the user",
            });

        const newLike = new Like({ post: id, user: req.user._id });
        like = await newLike.save();

        logger.info("User successfully liked the post");

        return res.status(201).json({
            status: "success",
            data: like._doc,
            message: "Post liked successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const commentLike = async (req, res, next) => {
    try {
        logger.info("Comment like API requested");
        const { id } = req.params;

        // Checking whether Comment exist or not
        let comment = await Comment.findOne({ _id: id });
        if (!comment) throw new CustomHttpError(404, "Comment not found.");

        // Checking whether comment already liked by logged-in user or not
        let like = await Like.findOne({ comment: id, user: req.user._id });
        if (like)
            return res.status(201).json({
                status: "success",
                data: like,
                message: "Comment already liked by the user",
            });

        const newLike = new Like({ comment: id, user: req.user._id });
        like = await newLike.save();

        logger.info("Comment liked successfully");

        return res.status(201).json({
            status: "success",
            data: like._doc,
            message: "Comment liked successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        logger.info("Update comment API requested");
        const { id } = req.params;
        const { text } = req.body;

        // Checking whether comment exist or not
        let comment = await Comment.findOne({ _id: id, user: req.user._id });
        if (!comment) throw new CustomHttpError(404, "Comment not found or you don't have access to update this comment");

        comment = await Comment.findOneAndUpdate({ _id: id }, { text }, { new: true });

        logger.info("Comment updated successfully");

        return res.status(201).json({
            status: "success",
            data: comment,
            message: "Comment updated successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        logger.info("Delete comment API requested");
        const { id } = req.params;

        // Checking whether comment exist or not
        let comment = await Comment.findOne({ _id: id, user: req.user._id });
        if (!comment) throw new CustomHttpError(404, "Comment not found or you don't have access to update this comment");

        // Deleting likes of comment
        await Like.deleteMany({ comment: comment._id })

        await Comment.findOneAndDelete({ _id: id });

        logger.info("Comment deleted successfully");

        return res.status(204).end();
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

// TODO - Can be done by message queue or socket
const increaseView = async (req, res, next) => {
    try {
        logger.info("Increase view API requested");
        const { id } = req.params;

        // Checking whether post exist or not
        let post = await Post.findOne({ _id: id });
        if (!post) return res.status(404).json({ error: 'Post not found.' });

        // Increasing the view by 1
        post = await Post.findOneAndUpdate({ _id: id }, { $inc: { viewCount: 1 } }, { new: true });
        logger.info("View increased by 1");
        
        return res.status(201).json({
            status: "success",
            data: post,
            message: "View increased successfully",
        });
    } catch (error) {
        logger.error("Something went wrong");
        return next(error);
    }
}

export {
    createPost,
    updatePost,
    deletePost,
    postSearchByTags,
    postSearchByText,
    postComment,
    postLike,
    commentLike,
    updateComment,
    deleteComment,
    increaseView,
};
