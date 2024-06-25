const mongoose=require("mongoose");
const giftSchema=new mongoose.Schema({
    sender_userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },

    receiver_userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    message:{
        type:String
    },
    selectOne:{
        type:Number
    },
    name:{
        type:String
    },
    contact_medium:{
        type:String
    },
    amount:{
        type:Number
    },
    card_no:{
        type:Number
    },
    status:{
        type:Number,
        default:0
    },
    gift_status:{
        type:Number,
        default:0
    },
    
    
   

},{timestamps:true});
module.exports=giftModel=mongoose.model("gift",giftSchema);