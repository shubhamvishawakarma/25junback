//  import dependacy   
const mongoose=require("mongoose");
const bannerTypeSchema=new mongoose.Schema({
    bannerType:{
        type:String,
        require:true
    }
    

});
module.exports=bannerType=mongoose.model("bannerType",bannerTypeSchema);