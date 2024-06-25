const mongoose=require("mongoose");
const venderOfferChatSchema=new mongoose.Schema({
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    select_directly:{
        type:String
    },
    offerType:{
        type:String
    },
    limitPeruser:{
        type:String
    },
    start_date:{
        type:String
    },
    end_date:{
        type:String
    },
    offer_status:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:0
    },
    timestamp: { 
        type: Date,
         default: Date.now 
        }

});
module.exports=mongoose.model("venderOffer",venderOfferChatSchema);