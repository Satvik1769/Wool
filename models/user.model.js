const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    email : String,
    password : String

})
const User = mongoose.model('User', userSchema);

module.exports = User;