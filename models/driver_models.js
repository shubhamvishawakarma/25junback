const mongoose=require("mongoose");
const driverSchema=new mongoose.Schema({
    
    phone:{
        type:Number,
        required:false,
    },
    
    fcm_id:{
        type:String,
        required:false,
    },
    
    email:{
        type:String,
        required:false,
    },
    
    fname:{
        type:String,
        required:false,
    },

    lname:{
        type:String,
        required:false,
    },
    
    address:{
        type:String,
        required:false,
    },
    
    otp:{
        type:Number,
        required:false,
    },

    frontId_iamge:{
        type:String,
    
    },
    backId_iamge:{
        type:String,
        },

    vehical_iamge:{
            type:String,
            },
    
   document:{
                type:String,
            },
    
            
   driverProfile:{
    type:String,
},
    driver_status:{
        type:Number,
        default:0
    },
    
    active_status:{
        type:Number,
    },
    verified_status:{
        type:Number,
    },
    status:{
        type:Number,
        default:0
    },
    
    geo_location:{
        type:{type:String},
        coordinates:[]
    },
    
    city:{
    type:String
    },
    dob:{
        type:String
        },

    money_mobile_number:{
    type:Number
   },

   password:{
    type:String
   },

    wallet:{
    type:Number,
    default:0
   },

    },{timestamps:true});
    driverSchema.indexes({location:"2dsphere"});
module.exports=driverModel=mongoose.model("driver",driverSchema);