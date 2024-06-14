import express from "express";
import {
    currentUser,
    login,
    registerUser,
} from "../controllers/auth.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * '/v1/auth/register':
 *  post:
 *     tags:
 *     - Auth Routes
 *     summary: Register a user
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
router.post("/register", registerUser);

/**
 * @openapi
 * '/v1/auth/login':
 *  post:
 *     tags:
 *     - Auth Routes
 *     summary: Login as a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: 1234567
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
router.post("/login", login);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /v1/auth/me:
 *   get:
 *     tags:
 *       - Auth Routes
 *     summary: Get logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched Successfully
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
router.get("/me", verify, currentUser);

export default router;
