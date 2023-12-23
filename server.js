const app = require('./app')
const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1/instagram')
.then(()=>{
    console.log("DB is connected");
})
.catch((err)=>{
    console.log(err);
})



app.listen(3000 , ()=>{
    console.log("server is running ");
})