var express = require('express');
var {User,Todo}=require('../model/user')
const { Sequelize } = require('sequelize');
const { Op } = require('@sequelize/core');
var jwt = require('jsonwebtoken');
const {verifyToken}= require('../middleware/auth');


var router = express.Router();

/* CRUD OPERATION */
router
.get('/',(req,res,next)=>{
  User.findAll({}).then(data=>res.status(200).json({data}))
})
.post('/signup',async (req,res,next)=>{
   //sign up
   let {email,password,username}=req.body;
  
   //validate
   if(email.length<1||password.length<1||username.length<1){
     res.status(300).json({error:'missing credentials'})
   }
   
   //create user
   User.create({
     email:email.toLowerCase(),
     password,
     username
    },{
      fields:['email','password','username']
    })
   .then((data)=>{

     //user created successfully
     const userJson=data.toJSON()
     const payload={email:userJson.email,username:userJson.username}
     //create jtw token
     var token = jwt.sign(payload,"isbSDuniijniuniubsrvkjnIUNJDFSVIJNIinhjdsinviniqq");
     //send jwt token with payload
     res.json({...payload,token})
   })
   .catch(err=>{
     //user already exists
     res.status(500).json({error:'username/email already exists'})
 
   })
})
.post('/login',async (req,res,next)=>{
  //login with credentials

  //get credentials
  const {email,password}=req.body;

  //check email exists
  User.findOne({where:{email:email}})
.then(async function(user){     

    if(!user){
      res.status(300).json({error:'please sign up before login'})
    }
    else if( ! await user.validate(password)){
      res.status(300).json({error:'incorrect password'})
    }
    else{
      //user created successfully
      const userJson=user.toJSON()
      const payload={email:userJson.email,username:userJson.username}
      //create jtw token and send
      var token = jwt.sign(payload,"isbSDuniijniuniubsrvkjnIUNJDFSVIJNIinhjdsinviniqq");
      res.status(200).json({success:'successfull login',...payload,token})
    } 
  }) 

  //send back token with email and username
})
.get('/delete',verifyToken,async (req,res,next)=>{
  User.findOne({
    where:{
      email:req.user.email
    },
    attributes:['id']
  }).then(user=>{
    if(!user){
      res.status(300).json({error:'user does not exist'})
    }
    else{
      //valid user
      User.destroy({
        where:{
        email:req.user.email
      }
    }).then(count=>{
      if(count>0){
        res.status(200).json({success:'user deleted successfully'})
      }
      else{
        res.status(300).json({error:'unable to delete user'})
      }
    })
    }
  })
})

module.exports = router;
