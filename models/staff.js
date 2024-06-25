const mongoose=require("mongoose");
const staffSchema=new mongoose.Schema({
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
   
    staff_image:{
        type:String
    },
    fname:{
        type:String
    },
    fcm_Id:{
        type:String
    },
    
    lname:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    dob:{
        type:String
    },
    position:{
        type:String
    },
    restrictions: { 
        type: Map,
        of: [String], 
        required: true 
      },
    password:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
    active_status:{
        type:Number,
       
    },
    
   

},{timestamps:true});
module.exports=mongoose.model("staff",staffSchema);