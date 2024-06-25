//  import dependacy   
const mongoose=require("mongoose");
const likeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    like_status:{
        type:Number,
        default:0
    }

});
module.exports=likeModel=mongoose.model("like",likeSchema);