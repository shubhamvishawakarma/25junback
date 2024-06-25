const mongoose = require("mongoose");
const venderDeleteSchema = new mongoose.Schema({
  venderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vender_data"
  },

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driver"
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

module.exports=mongoose.model("venderdelete", venderDeleteSchema);

