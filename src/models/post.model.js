import { Schema, model, SchemaTypes } from "mongoose";

const postSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
        },
        text: String,
        imageUrl: String,
        hashtags: [String],
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);

const commentSchema = new Schema(
    {
        post: {
            type: SchemaTypes.ObjectId,
            ref: "Post",
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
        },
        text: String,
        parent: {
            type: SchemaTypes.ObjectId,
            ref: "Comment",
        },
    },
    { timestamps: true }
);

const Comment = model("Comment", commentSchema);

const likeSchema = new Schema(
    {
        post: {
            type: SchemaTypes.ObjectId,
            ref: "Post",
        },
        comment: {
            type: SchemaTypes.ObjectId,
            ref: "Comment",
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Like = model("Like", likeSchema);

export { Post, Comment, Like };
