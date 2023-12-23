const mongoose = require('mongoose')
const { stringify } = require('uuid')


const postSchmema = mongoose.Schema({
    image : {
        type:String
    },

    caption : {
        type : String
    },

    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'

    }],
    
    username : {
        type:String
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel'
    },

    timestamp: {
        type: Date,
        default: Date.now
      }
})

const postModel = mongoose.model('postModel' ,postSchmema)

module.exports = postModel