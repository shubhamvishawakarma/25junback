const mongoose=require("mongoose");
const notificationSchema=new mongoose.Schema({
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    userId:{
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

    title:{
        type:String
    },
    text:{
        type:String
    },
    image:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
    
},{timestamps:true});
module.exports=Notification=mongoose.model("notification",notificationSchema);