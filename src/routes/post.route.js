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

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/createPost':
 *   post:
 *     tags:
 *       - Post Routes
 *     summary: Create a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 default: My first post
 *               hashtags:
 *                 type: string
 *                 default: tech,blog
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post("/createPost", verify, upload.single("image"), createPost);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/updatePost/{id}':
 *   put:
 *     tags:
 *       - Post Routes
 *     summary: Update a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 default: My first post
 *               hashtags:
 *                 type: string
 *                 default: tech,blog
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.put("/updatePost/:id", verify, upload.single("image"), updatePost);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/deletePost/{id}':
 *   delete:
 *     tags:
 *       - Post Routes
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 */
router.delete("/deletePost/:id", verify, deletePost);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/searchByTag':
 *   get:
 *     tags:
 *       - Post Routes
 *     summary: Search post by tags
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tags
 *         in: query
 *         schema:
 *           type: string
 *         description: Tags associated with the post
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.get("/searchByTag", verify, postSearchByTags);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/searchByText':
 *   get:
 *     tags:
 *       - Post Routes
 *     summary: Search post by text
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: text
 *         in: query
 *         schema:
 *           type: string
 *         description: Text associated with the post
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.get("/searchByText", verify, postSearchByText);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/postComment/{id}':
 *   post:
 *     tags:
 *       - Post Routes
 *     summary: Add comment on a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 default: Nice post
 *               parent:
 *                 type: string
 *                 default: ID of parent comment else remove this field
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.post("/postComment/:id", verify, postComment);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/postLike/{id}':
 *   post:
 *     tags:
 *       - Post Routes
 *     summary: Like a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.post("/postLike/:id", verify, postLike);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/commentLike/{id}':
 *   post:
 *     tags:
 *       - Post Routes
 *     summary: Like a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.post("/commentLike/:id", verify, commentLike);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/updateComment/{id}':
 *   put:
 *     tags:
 *       - Post Routes
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 default: Updated comment
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.put("/updateComment/:id", verify, updateComment);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/deleteComment/{id}':
 *   delete:
 *     tags:
 *       - Post Routes
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 */
router.delete("/deleteComment/:id", verify, deleteComment);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * '/v1/post/increaseView/{id}':
 *   post:
 *     tags:
 *       - Post Routes
 *     summary: Increase view of a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
router.post("/increaseView/:id", verify, increaseView);

export default router;
