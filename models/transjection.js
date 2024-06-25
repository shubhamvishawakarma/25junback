const mongoose=require("mongoose");
const transjectionSchema=new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    transjectionId:{
        type:String
    },
    amount:{
        type:Number,
        default:0
    },
    order_no:{
        type:Number,
        
    },
    payment_status:{
        type:String,

    },
    payment_type:{
        type:String,

    },
    status:{
        type:Number,
        default:0
    }

},{timestamps:true});
module.exports=mongoose.model('transjection',transjectionSchema);