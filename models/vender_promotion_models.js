// Import dependencies
const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
    venderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vender_data"
    },
    cupon_type: {
        type: String
    },
    cupon_code: {
        type: String
    },
    cupon_title: {
        type: String
    },
    sameUser_discountLimit: {
        type: Number
    },
    numberOfcoupon:{
        type: Number
    },
    discountType:{
            type:String
        },

        discountAmount:{
            type:String
        },

    appliesCoupon: {
        type:String
    },
    appliesType: {
        type:String
    },
    id:{
        type:[mongoose.Schema.Types.ObjectId]

    },
    
    expire_date: {
        type:String 
    },
    start_date: {
        type: String
    },
    act_status: {
        type: String,
        default: "0" 
    },
});

module.exports = mongoose.model("venderPromotion", promotionSchema);
