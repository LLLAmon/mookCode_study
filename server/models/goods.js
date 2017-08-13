/**
 * Created by 49862 on 2017/8/10.
 */
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var produtSchema=new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "productImage":String
})
module.exports=mongoose.model('Good',produtSchema,'mook')
