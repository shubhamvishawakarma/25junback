//  import dependacy   
const mongoose=require("mongoose");
const reportratingSchema=new mongoose.Schema({
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

module.exports=reportratingModel=mongoose.model("report_rating",reportratingSchema);