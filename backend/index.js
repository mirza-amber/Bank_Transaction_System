const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = require("./src/app.js");
const { connectDb } = require("./src/config/db.js");
require('dotenv').config();

connectDb().then(()=>{
    app.on("error",(er)=>{ // This executes only when user explictly calls "app.emit()"f from within the express application, it does not automatically fire up for every error.
            console.log("Error @ on: ", er)
        })
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is active on Port: ${process.env.PORT || 5000}`)  
    })
}).catch((error)=>{
        console.log("Error @ db connect : ", err);
})