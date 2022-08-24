const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const authRoter = express.Router();

//SIGNUP 

const ads = [
  {title: 'Hello, world (again)!'}
];

authRoter.get("/api/abc", async (req, res) => {
  await res.send(ads);
});

authRoter.post("/api/signup" , async (req , res)=>{
    try{
        const {name , email , password } = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({ msg : "user with same email already exist!"});
    }
    const hashPassword = await bcryptjs.hash(password,8);

    let user = new User({
        email,
        password : hashPassword,
        name,
    });

    user = await user.save();
    res.json(user);
    }catch(e){
        res.status(500).json({error: e.message});
    }
    
});

//SIGNIN

authRoter.post("/api/signin",async(req, res)=>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg : "User this email does not exist"});
        }
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({msg:"incorrect password"});
        }
       const token =  jwt.sign({id : user._id}, "passwordKey");
       res.json({token , ...user._doc});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});

// userBy Token


authRoter.post("/tokenIsValid",async(req, res)=>{
    try{
       const token = req.header("x-auth-token");

       // if token is null then json false

       if(!token) return res.json(false);
      const verified =  jwt.verify(token,"passwordKey")

       // if verified is null then json false

      if(!verified) return res.json(false);
      const user = await User.findById(verified.id);

      // if user is null then json false

      if(!user) return res.json(false);

      //else

      res.json(true);

    }catch(e){
        res.status(500).json({error: e.message});
    }
});

// Get user data

authRoter.get('/', auth , async(req , res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});




module.exports =authRoter;