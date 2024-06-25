const mongoose=require("mongoose");
const suggestionSchema=new mongoose.Schema({
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    text:{
        type:String
    },
   

},{timestamps:true});
module.exports=mongoose.model('suggestion',suggestionSchema);