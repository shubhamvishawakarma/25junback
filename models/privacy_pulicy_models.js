// import dependancy
const mongoose=require("mongoose");
const pulicySchema=new mongoose.Schema({
    title:{
        type:String
    },
    text:{
        type:String
    },
    
     type:{
            type:Number
        },
   

});
// export about_us schema from here
module.exports=pulicyModel=mongoose.model("privacy_pulicy",pulicySchema);