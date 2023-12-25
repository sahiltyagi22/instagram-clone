require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB is connected");
})
.catch((err)=>{
    console.log(err);
})



app.listen(3000 , ()=>{
    console.log("server is running ");
})