var jwt=require('jsonwebtoken');
const {User}=require('../model/user');
const { Op } = require('@sequelize/core');


module.exports={
    verifyToken: async(req,res,next)=>{
        var token=req.headers.authorization;
        try{
            if(token){
                var payload=await jwt.verify(token,"isbSDuniijniuniubsrvkjnIUNJDFSVIJNIinhjdsinviniqq")
                req.user=payload;
                User.findOne({where:{
                    [Op.and]:{
                        email:payload.email,
                        username:payload.username
                    }
                    }}).then((user)=>{
                        if(user){
                            next()
                        }
                        else{
                            res.status(300).json({error:'invalid-token'})
                        }
                        
                    
                })
                .catch((e)=>next(e))
            }
            else{
                res.status(300).json({error:'token required in header under Authorization'})
                }
        }
        catch(error){
           res.status(300).json({error:'invalid token'})
        }
    }
}