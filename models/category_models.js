//import dependacy
const mongoose=require("mongoose");
const categorySchema=new mongoose.Schema({
    maincategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"maincategory"
    },
    category_image:{
        type:String
    },
    acrtive_status:{
        type:Number,
        default:0
    },
    category_englishName:{
        type:String
    },
    category_frenchName:{
        type:String
    },
    


});
module.exports=categoryModel=mongoose.model("category",categorySchema);