const mongoose=require("mongoose");
const sleeveSchema=new mongoose.Schema({
    catetoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    sleeve:{
        type:Array
    }

});
module.exports=mongoose.model('sleeve',sleeveSchema);