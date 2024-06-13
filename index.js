import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectMongoDB from "./src/clients/mongodb.client.js";
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import postRouter from "./src/routes/post.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        message: "Server is up and running",
    });
});

connectMongoDB();

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/post", postRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
