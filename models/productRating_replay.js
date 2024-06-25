//  import dependacy   
const mongoose=require("mongoose");
const replayratingSchema=new mongoose.Schema({
    ratingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"rating"
    },
   
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    message:{
        type:String,
       
    }

},{timestamps:true});

module.exports=replayratingModel=mongoose.model("replay_rating",replayratingSchema);