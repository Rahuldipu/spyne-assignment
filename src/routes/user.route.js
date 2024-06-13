import express from "express";
import { verify } from "../middlewares/auth.middleware.js";
import {
    createUser,
    deleteUser,
    followUser,
    getAllUsers,
    searchUser,
    unfollowUser,
    updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/createUser", verify, createUser);
router.put("/updateUser/:id", verify, updateUser);
router.delete("/deleteUser/:id", verify, deleteUser);
router.get("/allUsers", verify, getAllUsers);
router.get("/search", verify, searchUser);
router.post("/follow", verify, followUser);
router.post("/unfollow", verify, unfollowUser);

export default router;
