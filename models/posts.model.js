const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Comment = require("./comment.model")
const User = require("./user.model");
const Image = require("./image.model");
const postSchema = new Schema({
    userName : {
        type: String,
        unique : true,
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
    comment :[{
        type : Schema.Types.ObjectId,
        ref : Comment
    }],
    imageUrl : [{
        type : Schema.Types.ObjectId,
        ref : Image
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    mint : {
        type:Boolean,
        default:false
    }
       
})

const Posts = mongoose.model('Posts',postSchema);
module.exports=Posts