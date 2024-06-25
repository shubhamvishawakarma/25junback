const mongoose=require("mongoose");
const ChatSchema=new mongoose.Schema({
    venderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    friendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"driver"
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin"
    },

    text:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
    send_status:{
        type:Number,
       
    },
    
   

},{timestamps:true});
module.exports=ChatModel=mongoose.model("chat",ChatSchema);