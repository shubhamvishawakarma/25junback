//  import dependacy   
const mongoose=require("mongoose");
const report_productSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_data"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
   
    status:{
        type:Number,
        default:0
    },
    
    title:{
        type:String,
       
    },
    text:{
        type:String,
       
    }

});

module.exports=mongoose.model("report_product",report_productSchema);