/**
 * Created by 49862 on 2017/8/10.
 */
"use strict"
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods');

mongoose.connect('mongodb://localhost:27017/mook',{useMongoClient:true});
mongoose.connection.on("connected",function(){
  console.log("1")
});
mongoose.connection.on("error",function(){
  console.log("error")
});
mongoose.connection.on("disconnected",function(){
  console.log("disconnected")
})
router.get('/list',function(req,res,next){
  let page=parseInt(req.param("page"));
  let pageSize=parseInt(req.param("pageSize"));
  let sort=parseInt(req.param("sort"));
  let priceLevel=req.param("priceLevel");
  let priceGt='',priceLte='';
  let skip=(page-1)*pageSize;
  let params={};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      res.json({
        status:"0",
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
})
//加入购物车
router.post('/addCart',(req,res,next)=>{
  let userId='100000077',productId=req.body.productId;
  let User=require('../models/users');
  User.findOne({userId:userId},(err,userDoc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach((item)=>{
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        })
        if(goodsItem){
          userDoc.save((err2,doc2)=>{
            if(err2) {
              res.json({
                status: "1",
                msg: err2.message
              })
            }else{
              res.json({
                status: "0",
                msg: '',
                result:'suc'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},(err,doc)=>{
            if(err) {
              res.json({
                status: "1",
                msg: err.message
              })
            }else {
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                userDoc.cartList.push(doc);
                userDoc.save((err2,doc2)=>{
                  if(err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    })
                  }else{
                    res.json({
                      status: "0",
                      msg: '',
                      result:'加入购物车成功'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})
module.exports=router;
