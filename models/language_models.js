//import dependacy
const mongoose=require("mongoose");
const languageSchema=new mongoose.Schema({  
    language_name:{
        type:String
    }
    
});
module.exports=languageModel=mongoose.model("language",languageSchema);