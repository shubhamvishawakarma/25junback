const mongoose=require("mongoose");
const brandSchema=new mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    brand:{
        type:Array
    }

});
module.exports=mongoose.model('brand',brandSchema);
