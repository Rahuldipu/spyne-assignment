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

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/createUser':
 *  post:
 *     tags:
 *     - User Routes
 *     summary: Create a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - mobile
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              mobile:
 *                type: string
 *                default: 9999999999
 *              password:
 *                type: string
 *                default: 1234567
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 */
router.post("/createUser", verify, createUser);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/updateUser/{id}':
 *  put:
 *     tags:
 *     - User Routes
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              mobile:
 *                type: string
 *                default: 9999999999
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
router.put("/updateUser/:id", verify, updateUser);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/deleteUser/{id}':
 *   delete:
 *     tags:
 *       - User Routes
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 */
router.delete("/deleteUser/:id", verify, deleteUser);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/allUsers':
 *   get:
 *     tags:
 *       - User Routes
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.get("/allUsers", verify, getAllUsers);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/search':
 *   get:
 *     tags:
 *       - User Routes
 *     summary: Search user by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: name of the user
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.get("/search", verify, searchUser);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/follow':
 *  post:
 *     tags:
 *     - User Routes
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userIdToFollow
 *            properties:
 *              userIdToFollow:
 *                type: string
 *                default: userId
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
router.post("/follow", verify, followUser);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/user/unfollow':
 *  post:
 *     tags:
 *     - User Routes
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userIdToUnfollow
 *            properties:
 *              userIdToUnfollow:
 *                type: string
 *                default: userId
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
router.post("/unfollow", verify, unfollowUser);

export default router;
