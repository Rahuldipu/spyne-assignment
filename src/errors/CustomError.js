class CustomHttpError extends Error {
    httpStatusCode;
    timestamp;

    constructor(httpStatusCode, message) {
        if (message) {
            super(message);
        } else {
            super("A generic error occured");
        }

        this.httpStatusCode = httpStatusCode;
        this.timestamp = new Date().toISOString();

        // attaching a call stack to the current class,
        // preventing the constructor call to appear in the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export {
    CustomHttpError
}
