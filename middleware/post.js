const Image = require("../models/image.model")
module.exports = {
    postImage  :  (req,res,next)=>{
        var obj = {
            userName: req.body.userName,
            postTitle: req.body.postTitle,
            img: req.body.photo,
            mint : req.body.mint
        }
        console.log(obj);
        const newImage = new Image(obj);

        newImage.save()
               .then(() => res.json('User Added'))
               .catch(err => res.status(400).json('Error: ' + err));
    }
}