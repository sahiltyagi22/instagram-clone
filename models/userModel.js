const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    email :{
        type : String
    } , 
    
    username : {
        type : String
    },

    password : {
        type : String
    },

    name : {
        type : String
    },

    profileImage :{
        type : String
    },

    bio :{
        type:String
    },

    posts :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'postModel'
    }]
})

userSchema.plugin(plm)

const userModel = mongoose.model('userModel' , userSchema)

module.exports = userModel
