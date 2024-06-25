//  import dependacy   
const mongoose=require("mongoose");
const ratingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    venderId:{
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

module.exports=ratingModel=mongoose.model("rating",ratingSchema);