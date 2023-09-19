const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment.model");
const commentSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const imageSchema = new Schema({
    userName : {
        type: String,
        required : true
    },
    postTitle:{
        type:String ,
        required: false,
        },
    like:{
        type : Number,
        default : 0,
        },
    img : {
        data: Buffer,
        contentType: String,
        name: String
    },
    mint : {
        type:Boolean,
        default:false
    },
    comments : [commentSchema]
})

const Image = mongoose.model('Image',imageSchema);
module.exports = Image;
