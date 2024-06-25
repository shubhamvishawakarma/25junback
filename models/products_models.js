// import dependacy
const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
    venderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"vender_data"
    },
    product_name:{
        type:String
    },
    frnz_product_name:{
        type:String
    },
    description:{
        type:String
    },
    frnz_description:{
        type:String
    },
    productType:{
        type:String

    },
    

    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    subcategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subcategory"
    },
    sub_subcategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"sub_subcategory"
    },
   
    product_code:{
        type:String
    },
    brand_name:{
        type:String
    },
    productPreparation_time:{
        type:String,
        default:0
    },

    productSize:{
        type:String
    },

    product_details:{
        type:String
    },
    frnz_product_details:{
        type:String
    },
     
    warranty:{
        type:String
    },
 
    note:{
        type:String
    },
    product_variation:[{
        attribute_name:{
            type:String
        },
        attribute_values:{
            type:[String]
        },

    }],

    unit_price:{
        type:Number
    },
    sale_price:{
        type:Number
    },
    discount:[{
        discount_type:{
            type:String
        },
        discount_value:{
            type:Number
        },

    }],

    Tax:[{
        tax_name:{
            type:String
        },
        tax_value:{
            type:Number
        },

    }],
    stock:{
        type:Number
    },

    minimum_order:{
        type:Number
    },

    deliveryType:{
        type:String
    },
    product_weight:{
        type:String
    },
    returnType:[{
        type:{
            type:Boolean
        },
        value:{
            type:Number,
            default:0
        },

    }],
    

    image1:{
        type:String

    },
    image2:{
        type:String

    },
    image3:{
        type:String

    },
    image4:{
        type:String

    },
    image5:{
        type:String

    },
    video:{
        type:String

    },
    
    like_status:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0
    },
    product_status:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:0
    },
    adds:{
        type:Number,
        default:0
    },
    hot_of_deals_status:{
        type:Number,
        default:0
    },
    
    


},{timestamps:true});
module.exports=productsModel=mongoose.model("product",productSchema);