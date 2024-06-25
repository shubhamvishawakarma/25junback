const mongoose=require("mongoose");
const attributesSchema=new mongoose.Schema({
    attribute_name:{
        type:String
    },
    attribute_values:{
        type:Array
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
   
});
module.exports=mongoose.model('attributes',attributesSchema);
