const mongoose=require("mongoose");
const friendSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },

    friendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    
    status:{
        type:Number,
        default:0
    },
    friend_status:{
        type:Number,
        default:0
    },
    
    
   

},{timestamps:true});
module.exports=mongoose.model("friend",friendSchema);