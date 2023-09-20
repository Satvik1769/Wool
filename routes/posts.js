const router = require('express').Router();
const fs = require("fs");
var path = require("path")
const { postImage } = require("../middleware/post")
var multer = require("multer");
var path = require("path");
var Image =require("../models/image.model")
const config = require("../config");
const { exec } = require('child_process');
//import theblockchainapi from "theblockchainapi";

function commitFileToGit(filename, res) {
  const commitMessage = `Add image ${filename}`;

  // Run Git commands to add and commit the file
  exec(`git add ${filename} && git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Git commit failed' });
    }
    console.log('File added and committed to Git repository');
    res.status(200).json({ message: 'Success' });
  });
}


async function getSecretPhrase(){
  const url ="https://api.blockchainapi.com/v1/solana/wallet/generate/secret_recovery_phrase";
options = {
    method : 'POST',
    headers:{
        'Content-Type':"application/json",
        'APIKeyID' : config.BLOCKCHAIN_API_KEY_ID,
        'APISecretKey' : config.BLOCKCHAIN_API_SECRET_KEY
    },

}
 const x =  await fetch(url, options)
.then((response)=>response.json()).then((data)=>data.secret_recovery_phrase)

return x
}

async function getPrivateKey() {
  const url = "https://api.blockchainapi.com/v1/solana/wallet/generate/private_key";
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      'APIKeyID': config.BLOCKCHAIN_API_KEY_ID,
      'APISecretKey': config.BLOCKCHAIN_API_SECRET_KEY
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.b58_private_key;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}

async function getPublicKey() {
  try {
    const privateKey = await getPrivateKey();
    const secret_recovery_phrase = await getSecretPhrase();
    const url = "https://api.blockchainapi.com/v1/solana/wallet/public_key";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'APIKeyID': config.BLOCKCHAIN_API_KEY_ID,
        'APISecretKey': config.BLOCKCHAIN_API_SECRET_KEY,
      },
      body: JSON.stringify({
        wallet: {
          //b58_private_key: privateKey,
          // secret_recovery_phrase : secret_recovery_phrase,
          secret_recovery_phrase : "indoor result cattle what smile debris modify throw brother keen short tray",
          derivation_path: "m/44/501/0/0",
          passphrase :  ""

        }
      })
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data; // Return the data instead of logging it
  } catch (error) {
    console.error(error);
    throw error;
  }
}



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
              name : image.img.name
            },
            mint:image.mint,
            like:image.like,
            _id : image._id,
            
          };
        });

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
          console.log(req.file.filename);
          
            const newImage = new Image({
                userName : req.body.userName,
                postTitle : req.body.postTitle,
                img  :{
                    data: fs.readFileSync(path.join(__dirname , '../uploads/' + req.file.filename)),
                    contentType  : "image/jpeg",
                    name : req.file.filename
                  
                },
                mint : req.body.mint,
                

            })
            newImage.save()
            .then((savedImage)=>{
           console.log("success");
           console.log(__dirname);
           fs.writeFileSync(path.join(__dirname, '../uploads/' + savedImage.img.name + '.jpg'), savedImage.img.data);

           // Commit and push the changes to GitHub
           commitFileToGit(savedImage.img.name + '.jpg', res);
                
               /// res.status(200).json({message:'Success'})
            })
            
            .catch((err)=>{
                console.log(err);
               // res.status(500).json({error : 'Server Error '})
            })
            
        }
    })
 });

 router.route("/getPostId").get(async (req, res) => {
  try {
    const userName = req.query.userName;
    const postTitle = req.query.postTitle;
    const mint = req.query.mint;
    const like = req.query.like;

    const image = await Image.find({
      userName,
      postTitle,
      mint,
      like,
    });

    res.send(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.route("/Posts/:postId/comments").post( async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Image.findById(postId);
      //console.log(post)
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Create a new comment
      const newComment = {
        userName: req.body.userName,
        text: req.body.text,
        
      };
  console.log(newComment)
      // Add the comment to the post's comments array
      post.comments.push(newComment);
  
      // Save the updated post
      const savedPost = await post.save();
  
      res.json(savedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.route("/Posts/:postId/comments").get(async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Image.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json(post.comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.route("/Posts/:postId/like").put(async(req,res)=>{
    try{  
      const postId = req.params.postId;
      const post = await Image.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      console.log(post.like);
      post.like+=1
      const updatedPost = await post.save();
      res.json(updatedPost);
    }
    catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  


  router.route("/Posts/:postId/nft").post(async(req,res)=>{
    try{
        const postId = req.params.postId;
        
        const post = await Image.findById(postId);
       
        const userName = post.userName;
        const image = post.img.name;
        // imageUrl = `http://localhost:3001/uploads/${image}`;
        imageUrl = `https://nft-marketplace-api.onrender.com/uploads/${image}`
        //imageUrl = "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2021/04/spider-man-tobey-maguire.jpg"



        
        const postTitle = post.postTitle;
        const private_key = await getPrivateKey()
       // const public_key = await getPublicKey();
       const public_key = req.body.public_key;
       const secret_recovery_phrase  = req.body.secret_recovery_phrase;
        console.log(public_key)
        console.log(private_key)
        // console.log("public key :" + public_key.public_key);
        
        var short_url = image;
        console.log(imageUrl);
        


        const url= "https://api.blockchainapi.com/v1/solana/nft";
        options = {
          method:"POST",
          headers:{
            'Content-Type':"application/json",
            'APIKeyID' : config.BLOCKCHAIN_API_KEY_ID,
            'APISecretKey' : config.BLOCKCHAIN_API_SECRET_KEY
        },
        body :JSON.stringify( {
          "wait_for_confirmation": true,
          "wallet": {
     
            "secret_recovery_phrase" : secret_recovery_phrase
          },
          "return_compiled_transaction": false,
          "name": `${postTitle}`,
          "symbol": `${postTitle[0] + postTitle[1] + postTitle[2]}`,
          "description": "Buy this Amazing NFT!",
          "image_url": `${imageUrl}`,
          "uri_metadata": {
            "animation_url": "https://www.arweave.net/efgh1234?ext=mp4",
            "attributes": [
              {
                "trait_type": "is_strong",
                "value": "true"
              }
            ]
          },
          "upload_method": "S3",
          "is_mutable": true,
          "is_master_edition": true,
          "seller_fee_basis_points": 100,
        
          "creators":  [public_key]
          ,
          "share": [
            100
          ],
          "network": "mainnet-beta"
        })

        }
        
        const x = fetch(url,options)
        .then((response)=>response.json())
        .then((data)=>res.send(data))
        res.send(x)
    }
    catch(err){
      console.error(err);
    }
  
  
  })

 module.exports =router;
