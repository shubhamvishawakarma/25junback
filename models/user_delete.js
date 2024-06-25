const mongoose = require("mongoose");
const userDeleteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_data"
  },

  reason: {
    type: String
  },
  text: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports=mongoose.model("userdelete", userDeleteSchema);

