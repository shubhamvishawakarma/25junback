const mongoose=require("mongoose");
const viewShopSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    status:{
        type:Number,
        default:0
    },
   

},{timestamps:true});
module.exports=viewshopModel=mongoose.model("viewshop",viewShopSchema);