import express from "express";
import { verify } from "../middlewares/auth.middleware.js";
import {
    commentLike,
    createPost,
    deleteComment,
    deletePost,
    increaseView,
    postComment,
    postLike,
    postSearchByTags,
    postSearchByText,
    updateComment,
    updatePost,
} from "../controllers/post.controller.js";
import { upload } from "../utils/s3Upload.util.js";

const router = express.Router();

router.post("/createPost", verify, upload.single("image"), createPost);
router.put("/updatePost/:id", verify, upload.single("image"), updatePost);
router.delete("/deletePost/:id", verify, deletePost);
router.get("/searchByTag", verify, postSearchByTags);
router.get("/searchByText", verify, postSearchByText);
router.post("/postComment/:id", verify, postComment);
router.post("/postLike/:id", verify, postLike);
router.post("/commentLike/:id", verify, commentLike);
router.put("/updateComment/:id", verify, updateComment);
router.delete("/deleteComment/:id", verify, deleteComment);
router.post("/increaseView/:id", verify, increaseView);

export default router;
