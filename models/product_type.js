const mongoose=require("mongoose");
const productTypeSchema=new mongoose.Schema({
   
    productType:{
        type:String
    }

});
module.exports=mongoose.model('product_type',productTypeSchema);