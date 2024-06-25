const mongoose = require('mongoose');

const returnOrderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
       
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
       
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data',
        
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender_data',
        
    },
    return_reason:{
        type:String
    },
    return_status:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:0
    },
   
}, { timestamps: true });

module.exports = mongoose.model("returnorder", returnOrderSchema);
