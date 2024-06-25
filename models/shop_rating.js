//  import dependacy   
const mongoose=require("mongoose");
const shopratingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    rating_status:{
        type:Number,
        default:0
    },
    rating:{
        type:String,
        default:0
    },
    comment:{
        type:String,
       
    }

});

module.exports=shopratingModel=mongoose.model("shoprating",shopratingSchema);