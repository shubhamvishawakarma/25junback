const mongoose = require('mongoose');

const refferalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data'
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data'
    },
    
    status: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
       
    },
   
}, { timestamps: true });

module.exports = mongoose.model("refferal", refferalSchema );
