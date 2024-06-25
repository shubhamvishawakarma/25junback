/*............import dependancies.........*/
const mongoose=require("mongoose");
const bannerSchema=new mongoose.Schema({
	
	banner_image:{
		type:String
	},
	banner_url:{
		type:String
	},
	banner_type:{
		type:String
	},
	active_status:{
		type:Number,
		default:0
	},
	resource_type:{
		type:String
	},
	
},{timestamps:true});


/*.............exports userSchema from here............*/
module.exports =bannerModel=mongoose.model("banner",bannerSchema);