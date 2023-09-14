const mongoose = require("mongoose");
var Schema = mongoose.Schema;

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

const Comment = mongoose.model("Comments",commentSchema);
module.exports=Comment ;