/**
 * Created by 49862 on 2017/8/12.
 */
var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":String,
      "productNum":String
    }
  ],
  "addressList":Array
})
module.exports=mongoose.model("user",userSchema)
