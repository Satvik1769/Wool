const router = require('express').Router();
const Posts = require("../models/posts.model");
const { postImage } = require("../middleware/post")
var multer = require("multer");
var path = require("path");
var Image =require("../models/image.model");
var storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
 var upload = multer({storage : storage}).single('image') 

 router.route("/Posts").get(async(req, res)=>{
    try {
        const images = await Image.find();
         const imagesWithBase64 = images.map((image) => {
           const base64Image = Buffer.from(image.img.data).toString("base64");
         //  console.log(image.img.data["type"])
          return {
            name: image.name,
            desc: image.desc,
            img: {
              contentType: image.img.contentType,
              data: base64Image,
            },
          };
        });
        console.log(imagesWithBase64)
         res.json(imagesWithBase64);
        //res.render('images',{images : images})
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
 }) 

 router.route("/Posts").post((req,res)=>{
    upload(req,res,err=>{
        if(err){
            console.log(err);
        }
        else{
            const newImage = new Image({
                name : req.body.name,
                desc : req.body.desc,
                img  :{
                    data : req.file.filename,
                    contentType  : "image/jpg"
                }
            })
            newImage.save()
            .then(()=>{
                res.send("Success")
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    })
 });
 module.exports =router;