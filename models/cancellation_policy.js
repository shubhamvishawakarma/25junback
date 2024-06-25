// import dependancy
const mongoose=require("mongoose");
const cancellationPolicySchema=new mongoose.Schema({
    title:{
        type:String
    },
    text:{
        type:String
    },
    

});
// export about_us schema from here
module.exports=aboutModel=mongoose.model("cancellationpolicy",cancellationPolicySchema);