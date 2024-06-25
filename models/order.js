const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    attributes:Array,
    image: String,
    product_name: String,
    shop_name: String,
    qty: Number,
    subtotal: Number,
    discount: Number,
    tax: Number,
    shipping_charge: Number,
    commission:Number,
    total: Number,
    checkout_status: {
        type: Number,
        default: 0
    },
    qrcode: String,
    payment_status: String,
    order_status: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data'
    },
    checkoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'checkout'
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender_data',
        required: true
    },
    orderId: Number,
    products: [productSchema],
    status: {
        type: Number,
        default: 0
    },
    check_status: {
        type: Number,
        default: 0
    },
    customer_otp: {
        type: Number,
       
    },
    transjectionId: {
        type: Number,
       
    },
    qrcodes: {
        type:String,
       
    },
    pay_place: {
        type:String,
       
    },
    delivery_charge: {
        type:Number,
        default: 0
       
    },

    qrcodes: {
        type:String,
       
    },


    orderVerification_code: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
