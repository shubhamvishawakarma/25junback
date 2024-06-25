// Import dependancy here\
const mongoose=require("mongoose");
const user_addressSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user_data",
    },
    place_type:{
        type:String
    },
    state:{
        type:String
    },
    city_name:{
        type:String
    },
    pin_code:{
        type:String
    },
    building_no:{
        type:String
    },
    landmark:{
        type:String
    },
    village_name:{
        type:String
    },
    location:{
        type:{
            type:String
        },
        coordinates:[]
    
    },
    status:{
        type:Number,
        default:0
    },

});
user_addressSchema.indexes({locations:"2dsphere"});
module.exports=userAddressMode=mongoose.model("user_address",user_addressSchema);