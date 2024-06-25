// creat vender model schema
const mongoose=require('mongoose');
const checkoutSchema = new mongoose.Schema({
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
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender_data',
        required: true,
      },
      
      image: {
        type: String,
       
      },
      product_name: {
        type: String,
       
      },
      attributes:[{
        name:{
            type:String
        },
        value:{
            type:String
        },

    }],
      shop_name: {
        type: String,
       
      },
      
      qty: {
        type: Number,
      },
      subtotal: {
        type: Number,
      },
      discount: {
        type: Number,
      },
      tax: {
        type: Number,
      },
      shipping_charge: {
        type: Number,
      },
      total: {
        type: Number,
      },
      checkout_status:{
        type:Number,
        default:0,
      },
    },
  ],
check_status:{
  type:Number,
  default:0,
},
status:{
  type:Number,
  default:0,
},
total_item:{
    type:Number,

  },
  total_price:{
    type:Number,

  },
  save_amount:{
    type:Number,

  },
  addressId:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user_address',
  },
  
  address:{
    type:String,
   
  },
 
  delivery_place:{
      type:String,
  
    },
    payType:{
      type:String,
  
    },
    paymentMode:{
      type:String,
  
    },
    payment_status:{
           type:String,
    },
    grand_total:{
      type:Number,
  
    },
    note:{
      type:String,
  
    },

  
      
},{timestamps:true});
module.exports =checkoutModel= mongoose.model("checkout",checkoutSchema);