const mongoose=require("mongoose");
const chargeSchema=new mongoose.Schema({
    delivery_charge:{
       type:Number
    },
    commission:{
        type:Number
    }

});
module.exports=mongoose.model('charge',chargeSchema);
