const mongoose=require("mongoose");
const viewsProductSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    status:{
        type:Number,
        default:0
    },
   

},{timestamps:true});
module.exports=venderChatModel=mongoose.model("viewproduct",viewsProductSchema);