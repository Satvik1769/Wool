const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var conn = mongoose.Collection;

const imageSchema = new Schema({
    name : {
        type: String,
        requied: true
    },
    desc : String,
    img : {
        data: Buffer,
        contentType: String
    }
})

const Image = mongoose.model('Image',imageSchema);
module.exports = Image;