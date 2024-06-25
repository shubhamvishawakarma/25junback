const mongoose=require("mongoose");
const userQuerySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    title:{
        type:String
    },
    message:{
        type:String
    },
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    status:{
        type:Number,
        default:0
    },
   
   
},{timestamps:true});
module.exports=userQueryModel=mongoose.model("user_query",userQuerySchema);