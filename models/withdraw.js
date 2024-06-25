const mongoose=require("mongoose");
const withdrawSchema=new mongoose.Schema({
    venderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"driver"
    },
    
    amount:{
        type:Number
    },
    mobile_money_number:{
        type:Number
    },
    status:{
        type:Number,
        default:0
    },

    status_type:{
        type:Number,
        
    },

    withdraw_status:{
        type:Number,
        default:0
    },

    notes:{
        type:String,
       
    },
    transactionId:{
        type:String,
       
    },
   

},{timestamps:true});
module.exports=viewshopModel=mongoose.model("withdraw",withdrawSchema);