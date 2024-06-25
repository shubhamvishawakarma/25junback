// Import dependency
const mongoose = require("mongoose");

// Define subcategory schema
const subcategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    english_subcategory_name: {
        type: String
    },
    french_subcategory_name: {
        type: String
    },
    subcategory_image: {
        type: String
    },
    active_status: {
        type: Number,
        default: 0
    }
});

// Create and export subcategory model
const SubcategoryModel = mongoose.model("subcategory", subcategorySchema);
module.exports = SubcategoryModel;
