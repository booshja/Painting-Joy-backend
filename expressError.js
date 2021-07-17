class ExpressError extends Error {
    /** Extend JS Error for customization */
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

/** 400 Bad Request Error */
class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

/** 401 Unauthorized Error */
class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

/** 403 Forbidden Error */
class ForbiddenError extends ExpressError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

/** 404 Not Found Error */
class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

module.exports = {
    ExpressError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
};
