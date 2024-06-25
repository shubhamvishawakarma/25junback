// creat vender model schema
const mongoose=require('mongoose');
const cartSchema = new mongoose.Schema({
userId:{
	type: mongoose.Schema.Types.ObjectId, 
  ref: 'user_data',
  
},
products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      attributes:[{
        name:{
            type:String
        },
        value:{
            type:String
        },

    }],
      qty: {
        type: Number,
      },
    },
  ],
booking_status:{
  type:Number,
  default:0,
},
status:{
  type:Number,
 

},

      
},{timestamps:true});
module.exports =cartModel= mongoose.model("cart",cartSchema);