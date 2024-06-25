//import dependacy
const mongoose=require("mongoose");
const maincategorySchema=new mongoose.Schema({ 
   maincategory_image:{
        type:String
    },
    acrtive_status:{
        type:Number,
        default:0
    },
    maincategory_englishName:{
        type:String
    },
    maincategory_frenchName:{
        type:String
    },
    


});
module.exports=maincategoryModel=mongoose.model("maincategory",maincategorySchema);