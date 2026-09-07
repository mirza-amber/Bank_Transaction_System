const asyncHandler = (func)=>{
    return async (req, res, next)=>{
        try{
            await func(req, res, next);
        }
        catch(error){
            console.log("Error: ", error);
            console.log("Stack: ", error.stack);
            res.status(error.statuscode || 500).json(
                {
                success : false,
                message : error.message
            }
            )
        }
    }
}

module.exports.asyncHandler = asyncHandler;