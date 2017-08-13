/**
 * Created by 49862 on 2017/8/13.
 */
var express=require('express');
var router=express.Router();
var User=require('../models/users');
router.post('/login',(req,res,next)=>{
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      res.cookie('userId',doc.userId,{
        path:'/',
        maxAge:1000*60*60
      });
      res.cookie('userName',doc.userName,{
        path:'/',
        maxAge:1000*60*60
      });
      //req.session.user=doc;
      if(doc){
        res.json({
          status:"0",
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
});
router.post('/logout',(req,res,next)=>{
  res.cookie('userId',"",{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:""
  })
});
router.get("/checkLogin",(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:"0",
      msg:"",
      result:req.cookies.userName || ''
    })
  }else{
    res.json({
      status:"1",
      msg:"未登录",
      result:''
    })
  }
})
module.exports=router
