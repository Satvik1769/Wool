const router = require('express').Router();
const User = require("../models/user.model")
const userController = require('../controllers/user/userController');
const bcrypt = require("bcryptjs")

// Register a new User
router.route("/getUser").get((req,res)=>{
    User.find()
    .then(users =>{ 
        console.log(users);
        res.json(users)
    })
    .catch((e) => res.status(400).json('Error ' + e));

})

router.route("/signup").post(async(req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);
    const userName = req.body.userName;
    const email=  req.body.email ;
    const password= hasPassword;
    const newUser = new User({
        userName:userName,
        email : email ,
        password : password
    });

    newUser.save().then(()=>res.json("User Added")).catch((e)=>res.status(400).json('Error ' + e))
});

// // Login
// router.post('/login', userController.login);

module.exports = router;