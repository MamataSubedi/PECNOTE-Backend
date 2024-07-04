const express=require("express");
const app=express();
const bodyParser = require("body-parser");



app.use(bodyParser.json());
const cors = require("cors")
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Database Connection start
const mongoose=require("mongoose");
mongoose.connect('mongodb://0.0.0.0:27017/hello').then(()=>{
    console.log("connection successfull")
  
}).catch((error)=>
{
    console.log(error)
})


const ChatRoute = require("./Routes/ChatRoute")
app.use("/chat", ChatRoute);

const MessageRoute = require("./Routes/MessageRoute")
app.use("/message", MessageRoute);

const authroute=require("./Routes/routes")
app.use("/api/auth",authroute);

const noteroute=require("./Routes/sellNoteRoute")
app.use("/api/auth",noteroute);




app.listen(8000,()=>

    console.log('server is running in port 8000')
)

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });