//import depandancy here
const mongoose =require("mongoose");
const termSchema=new mongoose.Schema({
    title:{
        type:String
    },
    text:{
        type:String
    },
    type:{
        type:Number
    },

},{timestamps:true});
module.exports=termModel=mongoose.model("term_and_condiction",termSchema);