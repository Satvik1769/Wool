const router = require('express').Router();
const Posts = require("../models/posts.model");
const fs = require("fs");
var path = require("path")
const { postImage } = require("../middleware/post")
var multer = require("multer");
var path = require("path");
var Image =require("../models/image.model")


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

          return {
            userName: image.userName,
            postTitle: image.postTitle,
            img: {
              contentType: image.img.contentType,
              data: base64Image,
              mint:image.mint,
              like:image.like
            },
          };
        });
        //console.log(imagesWithBase64)
       //  res.json(imagesWithBase64);
       // res.render("images",{items : images})
       console.log(imagesWithBase64)
      

        res.json(imagesWithBase64)
         
      
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
 }) 

 router.route("/Posts").post((req,res)=>{
    upload(req,res,err=>{
        if(err){
            console.log(err);
            return res.status(500).json({error : 'File upload failed'})
        }
        else{
            const newImage = new Image({
                userName : req.body.userName,
                postTitle : req.body.postTitle,
                img  :{
                    data: fs.readFileSync(path.join(__dirname , '../uploads/' + req.file.filename)),
                    contentType  : "image/jpeg"
                },
                mint : req.body.mint

            })
            newImage.save()
            .then(()=>{
           
                
                res.status(200).json({message:'Success'})
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).json({error : 'Server Error '})
            })
        }
    })
 });

 module.exports =router;