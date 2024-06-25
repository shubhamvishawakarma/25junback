// import dependancy
const mongoose=require("mongoose");
const emergancysupportSchema=new mongoose.Schema({
    contact_name:{
        type:String
    },
    phone:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
   

});
// export about_us schema from here
module.exports=emergancy_supportModel=mongoose.model("emergancy_support",emergancysupportSchema);