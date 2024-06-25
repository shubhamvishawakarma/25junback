// import dependancy
const mongoose=require("mongoose");
const contact_usSchema=new mongoose.Schema({
    client_name:{
        type:String
    },
    phone_no:{
        type:String
    },
    email:{
        type:String
    },
    whatsapp_number:{
        type:String
    }

});
// export about_us schema from here
module.exports=contactModel=mongoose.model("contact_us",contact_usSchema);