// import dependancy
const mongoose=require("mongoose");
const returnpolicySchema=new mongoose.Schema({
    title:{
        type:String
    },
    text:{
        type:String
    },
    

});
// export about_us schema from here
module.exports=returnModel=mongoose.model("returnpolicy",returnpolicySchema);