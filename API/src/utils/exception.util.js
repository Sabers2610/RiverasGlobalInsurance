class CustomError extends Error {
    constructor(message, code, type) {
        super(message)
        this.name = "CustomError"
        this.code = code
        this.type = type
        Error.captureStackTrace(this, this.constructor)
    }

    toJson() {
        const JSON = {
            type: this.type,
            code: this.code,
            msg: this.message
        }
        return JSON;
    }
}

export default CustomError;