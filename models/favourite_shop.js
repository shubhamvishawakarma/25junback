//  import dependacy   
const mongoose=require("mongoose");
const favouriteshopSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
   
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    favourite_status:{
        type:Number,
        default:0
    }

});
module.exports=favouriteModel=mongoose.model("favourite",favouriteshopSchema);