// Imports
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import connectMongoDB from "./src/clients/mongodb.client.js";
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import postRouter from "./src/routes/post.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import { logger } from "./src/loggers/logger.js";
import swaggerDocs from "./swagger.js";

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());

// body-parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to log API requests
app.use((req, res, next) => {
    logger.info(`API Route: ${req.method} ${req.url}`, { meta: req.body });
    next();
})

// Server health check API
app.get("/", (req, res) => {
    logger.info("Server is up and running")
    res.json({
        message: "Server is up and running",
    });
});

// MongoDB connection
connectMongoDB();

// Server routes/endpoints
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/post", postRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

swaggerDocs(app, PORT);
