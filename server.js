require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')


const uri = process.env.MONGO_URL

mongoose.connect(uri)
.then(()=>{
    console.log("DB is connected");
})
.catch((error)=>{
    console.log(error);
})



app.listen(3000 , ()=>{
    console.log("server is running ");
})