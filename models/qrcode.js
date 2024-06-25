const mongoose=require("mongoose");
const qrcodeSchema=new mongoose.Schema({
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
   
    qrcode_name:{
        type:String
    },
    type:{
        type:String
    },
    qrcode:{
        type:String
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    

},{timestamps:true});
module.exports=mongoose.model("qrcode",qrcodeSchema);