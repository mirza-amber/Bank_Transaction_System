const mongoose = require("mongoose")


const connectDb = async ()=>{
    try{
        const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`Connection established: ${connectioninstance.connection.host}`)
    }catch(error){
        console.log("Error: ", error);
        process.exit(1)
    }
}

module.exports.connectDb = connectDb;

/* Promise reolution discussion 
https://chatgpt.com/share/6a9d2bd1-46dc-83e8-90f5-564c6a1786aa
*/

// we can also use await instead of return
// return mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`).then((res)=>{
//     console.log(`\n MongoDB connected ${res.connection.host}`)
// }).catch((error)=>{
//     console.log("Error: ", error);
//     process.exit(1)
// })