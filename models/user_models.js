/*............import dependancies.........*/
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
	userName:{
		type:String,
	},
	
	friend_qrcode:{
		type:String,
	},
	payment_qrcode:{
		type:String,
	},
	first_name:{
		type:String,
	},
	last_name:{
		type:String
	},
	mobile_number:{
		type:String
	},
	email:{
		type:String
	},
	password:{
		type:String
	},
	fcm_id:{
		type:String
	},
	user_profile:{
		type:String
	},
	user_referral_code:{
		type:String
	},
	user_status:{
		type:Number,
	    default:0,
	},
	wallet:{
		type:Number,
	    default:0,
	},
	loyalty_point:{
		type:Number,
	    default:0,
	},
	referTo_earn:{
		type:Number,
	    default:0,
	},
	status:{
		type:Number,
	    default:0,
	},
	otp:{
		type:Number
	},
	
	dob:{
		type:String,
		default:" "
	},
	gender:{
		type:String,
		default:" "
		
	},
	socical_media_id:{
		type:String,
		
	},
	type:{
		type:Number
	},

},{timestamps:true});


/*.............exports userSchema from here............*/
module.exports =userModel=mongoose.model("user_data",userSchema);