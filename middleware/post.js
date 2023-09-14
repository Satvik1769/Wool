const Image = require("../models/image.model")
module.exports = {
    postImage  :  (req,res,next)=>{
        var obj = {
            name: req.body.name,
            desc: req.body.desc,
            img: req.body.photo
        }
        console.log(obj);
        const newImage = new Image(obj);

        newImage.save()
               .then(() => res.json('User Added'))
               .catch(err => res.status(400).json('Error: ' + err));
    }
}