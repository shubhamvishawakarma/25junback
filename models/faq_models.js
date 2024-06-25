// import dependancy
const mongoose=require("mongoose");
const faqSchema=new mongoose.Schema({
    title:{
        type:String
    },
    text:{
        type:String
    }

});
// export about_us schema from here
module.exports=faqModel=mongoose.model("faq",faqSchema);