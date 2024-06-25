//  import dependacy   
const mongoose=require("mongoose");
const innt_ratingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
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

},{timestamps:true});

module.exports=inntratingModel=mongoose.model("inntrating",innt_ratingSchema);