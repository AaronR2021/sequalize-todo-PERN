var express = require('express');
const {User,Todo}=require('../model/user')
var router = express.Router();
var jwt = require('jsonwebtoken');
const {verifyToken}= require('../middleware/auth');
const { user } = require('pg/lib/defaults');
const { Op } = require('@sequelize/core');

// CRUD OPERATIONS
router.post('/create-todo',verifyToken,async function(req, res, next) {
  //CREATE 
 const {todo}=req.body;
 //check for token user
 const user=await User.findOne({where:{
   email:req.user.email,
 }});

 user?await user.createTodo({todo}):res.status(300).json({error:"user not logged in"})

 res.status(200).json({success:'added todo to your list'})
})//C
.get('/todos',verifyToken,async function(req,res,next){
  //READ
  const {email}=req.user;
  User.findOne({
    where:{email},
    attributes:['id']
  })
  .then(user=>{
    const {id}=user;
    user.getTodos({
      where:{
         user_id:id
            },
    attributes:[['id','todo-id'],'todo','created_at']
      
  }).then(todo=>{
      res.status(200).json({todo})
    })
  })
  .catch((err)=>{res.status(300).json({error:'something went wrong'})})

})//R
.post('/:postId',verifyToken,async function(req,res,next){
  //updata the post
  const postId=req.params.postId
  const todo=req.body.todo.toString();
  //check if you have permission to update post
  User.findOne({
    where:{
      email:req.user.email
    },
    attributes:['id']
  }).then(user=>{
    if(!user){
      res.status(300).json({error:'user does not exist'})
    }

    //get userid
    const {id}=user;
    Todo.update(
      {
        /*what you want to updata */
        todo:todo
      },
      {/*under what conditions you want to update */
        where:{
          [Op.and]:{
            user_id:id,
            id:postId
          }
        }
      }).then(count=>{
        if(count.length>0){
          res.status(200).json({message:'sucessfully updated'})
        }
        else{
          res.status(300).json({error:'could not update todo'})
        }

      })
  })
  
})//U
.get('/delete/:postId',verifyToken,async function(req,res,next){
  //DELETE TODO POST
  const postId=req.params.postId;
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
    const id=user.id;

      //user verified!
      Todo.destroy({
        where:{
          [Op.and]:{
            user_id:id,
            id:postId
          }
        }
      }).then(count=>{
        if(count>0){
          res.status(200).json({success:'sucessfully deleted post'})
        }
        else{
          res.status(300).json({error:'could not delete post'})
        }
      })
    }
  
  })

})//D

module.exports = router;
