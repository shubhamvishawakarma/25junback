//import mongoose dependaces
const mongoose=require("mongoose");
const venderSchema=new mongoose.Schema({
firstName:{
        type:String,
    },
lastName:{
        type:String,
    },
dob:{
    type:String,
},
residenceyCity:{
    type:String,
},
mobile_number:{
    type:String
},
email:{
    type:String,
    
},
upload_backsideId:{
    type:String,
    },
upload_frontId:{
        type:String,
        },

typeOfbusiness:{
    type:String
},
shop_name:{
    type:String
},
frnz_shop_name:{
    type:String
},
shop_address:{
    type:String
},

country:{
    type:String
},
city:{
    type:String
},

location:{
    type:{
        type:String
    },
    coordinates:[]

},
serviceType:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"maincategory"

},
workHours:[{
    day_name:{
        type:String,

    },
    status:{
        type:Boolean
    },
    open_time:{
        type:String
    },
    close_time:{
        type:String
    },

}],
shop_logo:{
    type:String,

},
vender_profile:{
    type:String,
    },

store_description:{
        type:String,
        }, 

      frnz_store_description:{
            type:String,
            }, 
         
shop_licence:{
    type:String
   },
bank_name:{
    type:String
},
acc_number:{
    type:Number
},
bankAccount_name:{
    type:String
},
swift_code:{
    type:String
},
mobile_money_number:{
    type:Number
},

vender_status:{
    type:Number,
    default:0
},
validation_status:{
    type:Number,
    default:0
},
fcm_Id:{
    type:String
},
otp:{
    type:String
},

password:{
    type:String
},
active_status:{
    type:Number,
    default:0
},
status:{
    type:String,
    default:0
},

wallet:{
    type:Number,
    default:0
},

temporaryClose_data:[{
    start_date:{
        type:String,

    },
    end_date:{
        type:String
    },
    status:{
        type:Number,
        default:0
    }
   

}],

vacationMode_data:[{
    start_date:{
        type:String,

    },
    end_date:{
        type:String
    },
    status:{
        type:Number,
        default:0
    }
   

}],

minimum_order:{
    type:Number

},


},{timestamps:true});
venderSchema.indexes({location:"2dsphere"});

/*  export vender modele*/
module.exports=venderModel= mongoose.model('vender_data',venderSchema);