import { CustomHttpError } from "../errors/CustomError.js";

export const errorHandler = (err, req, res, next) => {
    let httpStatusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof CustomHttpError) {
        httpStatusCode = err.httpStatusCode;
        message = err.message;
    } else {
        if (process.env.NODE_ENV !== "production") {
            message = err;
        } else if (err instanceof Error) {
            message = err.message;
        }
    }

    let stackTrace = undefined;

    if (process.env.NODE_ENV !== "production") {
        stackTrace = err.stack;
    }

    res.status(httpStatusCode).json({
        error: {
            message: message,
            timestamp: err.timestamp || undefined,
            stackTrace: stackTrace,
        },
    });

    return next(err);
};
