class ApiErrors extends Error{
    constructor(statuscode, message = "Something wrong", errors=[], stack = "" ){
        super(message); // Not super(this.message) because "this" isn't initialized until after the parent constructor has been called.

        this.statuscode = statuscode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = errors

        if(stack) this.stack = stack
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports.ApiErrors = ApiErrors;