// Import dependency
const mongoose = require("mongoose");

// Define subcategory schema
const sub_subcategorySchema = new mongoose.Schema({
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory"
    },
    english_sub_subcategory_name: {
        type: String
    },
    french_sub_subcategory_name: {
        type: String
    },
    sub_subcategory_image: {
        type: String
    },
    active_status: {
        type: Number,
        default: 0
    }
});

// Create and export subcategory model
const Sub_subcategoryModel = mongoose.model("sub_subcategory", sub_subcategorySchema);
module.exports = Sub_subcategoryModel;
