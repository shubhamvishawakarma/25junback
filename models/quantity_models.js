const mongoose=require("mongoose");
const quantitySchema=new mongoose.Schema({
    catetoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    quantity:{
        type:Array
    }

});
module.exports=mongoose.model('quantity',quantitySchema);