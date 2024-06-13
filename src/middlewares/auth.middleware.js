import jwt from "jsonwebtoken";

import { CustomHttpError } from "../errors/CustomError.js";
import User from "../models/user.model.js";

export const verify = async (req, res, next) => {
    try {
        const authHeader = req.headers["cookie"];
        if (!authHeader)
            throw new CustomHttpError(401, "You are not authorised to access this resource");

        const cookie = authHeader.split("=")[1];

        jwt.verify(cookie, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new CustomHttpError(
                    401,
                    "This session has expired, Please login again."
                );
            }

            const { id } = decoded;
            const user = await User.findById(id);
            const { password, ...data } = user._doc;
            req.user = data;

            next();
        });
    } catch (error) {
        next(error);
    }
};
