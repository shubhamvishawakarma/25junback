// creat vender model schema
const mongoose=require('mongoose');
const assignedDriverSchema = new mongoose.Schema({
driverId:{
	type: mongoose.Schema.Types.ObjectId, 
  ref: 'driver',
  
},
orderId:{
	type: mongoose.Schema.Types.ObjectId, 
  ref: 'order',
  
},

message:{
    type:String,
   
  },

status:{
  type:Number,
  default:0,
},
assigne_status:{
  type:Number,
  default:0,

},


      
},{timestamps:true});
module.exports = mongoose.model("assigne_driver",assignedDriverSchema);