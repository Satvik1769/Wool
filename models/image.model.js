const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const imageSchema = new Schema({
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
    img : {
        data: Buffer,
        contentType: String
    },
    mint : {
        type:Boolean,
        default:false
    }
})

const Image = mongoose.model('Image',imageSchema);
module.exports = Image;