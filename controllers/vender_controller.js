// import models here
const Vender=require("../models/vender_models");
const Subcategory=require("../models/subcategory_models");
const Category=require("../models/category_models");
const Promotion=require("../models/vender_promotion_models");

const Product=require("../models/products_models");

const Quantity=require("../models/quantity_models");

const Sleeve=require("../models/sleeve_models");
const Sub_subcategory=require("../models/sub_subcategory_models");
const Offer=require("../models/vendor_offer_models");
const Vendordelete = require("../models/vendor_delete");
const Maincategory=require("../models/main_category");
const Brand=require("../models/brand");
const ProductType=require("../models/product_type");
const Term = require("../models/term_and_condiction_models");
const Privacy = require("../models/privacy_pulicy_models");
const shopRating=require("../models/shop_rating");
const Rating=require("../models/rating_models");
const User=require("../models/user_models");
const Replayrating=require("../models/productRating_replay");
const Reportrating=require("../models/report_rating");
const Order=require("../models/order");
const Checkout=require("../models/checkout");
const Like=require("../models/like_models");
const Viewshops=require("../models/view_shops");
const Return_policy=require("../models/return_policy");
const Refund_policy=require("../models/refund_policy");
const Cancellation_policy=require("../models/cancellation_policy");
const About = require("../models/about_us_models");
const Withdraw=require("../models/withdraw");
const Driver=require("../models/driver_models");
const Returnorder=require("../models/return_order");
const Staff=require("../models/staff");
const Qrcode=require("../models/qrcode");
const Chat=require("../models/chat");
const Attribute=require("../models/attributes");
const Notification=require("../models/notification");





// import depandecy here
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { decrypt } = require("dotenv");


// make fundtion and use it
function generate_otp() {
  const Otp=Math.floor(1000 + Math.random()*9000);
  return Otp;

}



function generateQrcode() {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const length = 12;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;

}


/* ...................CREATE VENDER API............*/

const venderSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      residenceyCity,
      mobile_number,
      email,
      typeOfbusiness,
      shop_name,
      frnz_shop_name,
      frnz_store_description,
      shop_address,
      country,
      city,
      latitude,
      longitude,
      serviceType,
      workHours,
      bank_name,
      acc_number,
      store_description,
      bankAccount_name,
      swift_code,
      mobile_money_number,
      fcm_Id,
    } = req.body;

  
    const {upload_frontId,upload_backsideId,vender_profile,shop_logo,shop_licence}=req.files;
    
    if (
      !firstName ||
      !lastName  ||
      !dob       ||
      !residenceyCity ||
      !email         ||
      !shop_address   ||
      !country  ||
      !city  ||
      !serviceType ||
      !workHours  || 
      !mobile_money_number ||
      !vender_profile ||
      !shop_licence  ||
      !mobile_number ||
      !latitude ||
      !longitude
    ) {

      const msg = "required parameters are firstName,lastName,dob," +
                 "residenceyCity,mobile_number,email,typeOfbusiness,shop_address,country," +
                  "city,serviceType,workHours,store_description,acc_number,bankAccount_name,bank_name," +
                  "swift_code,mobile_money_number,shop_name,fcm_Id,latitude,longitude," +
                  "upload_frontId,upload_backsideId,vender_profile,  frnz_shop_name, frnz_store_description,shop_logo,shop_licence";

      return res.status(400).json({
        "result": "false",
        "message":msg
      });
    }
    
    
    
    const OTP=Math.floor(1000 + Math.random()*9000);
  const matchData=await Vender.findOne({mobile_number});
  if(!matchData){
    const workHour =JSON.parse(workHours);
    const insertData = new Vender({
      firstName,
      shop_name,
      lastName,
      dob,
      frnz_shop_name,
      frnz_store_description,
      residenceyCity,
      mobile_number,
      email,
      typeOfbusiness,
      shop_address,
      country,
      city, 
      serviceType,
      bank_name,
      acc_number,
      bankAccount_name,
      store_description,
      swift_code,
      mobile_money_number,
      workHours:workHour,
      fcm_Id,
      otp:OTP,
      location: {
        type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },

        upload_frontId: upload_frontId ? upload_frontId[0].filename : null,
        upload_backsideId: upload_backsideId ? upload_backsideId[0].filename : null,
        vender_profile: vender_profile ? vender_profile[0].filename : null,
        shop_logo: shop_logo ? shop_logo[0].filename : null,
        shop_licence: shop_licence ? shop_licence[0].filename : null,
    });

    const data = await insertData.save();
    res
      .status(200)
      .json({ result: true, message: "Data inserted successfully", data:data });
    }
  else{
    res.status(400).json({ "result": "false", "message": "Seller allready exist" });
  }

}catch (err) {
    console.log(err.mesage)
    res.status(400).json({ result: false, message: err.message });
  }
  };
  

  




// vender verify otp api
const venderVerifyOtp=async(req,res)=>{
  try{
		const {mobile_number,otp}=req.body;
		if(!mobile_number || !otp){
			res.status(400).json({"result":"false","message":"required parameters are mobile_number,otp"});

		}else{
			const findData=await Vender.findOne({mobile_number});
			if(!findData){
				res.status(400).json({"result":"false","message":"You are not register"});
			}else{
				const Data=await Vender.findOne({mobile_number,otp});
				if(Data){
          // Generate a JWT token
					const token = jwt.sign({ venderId:Data._id,email:Data.email,mobile_number:Data.mobile_number }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });
					res.status(200).json({"result":"true","message":"Otp verify sucessfully",data:Data,token});
				}else{
					res.status(400).json({"result":"false","message":"Invalid OTP"});
				}
			}
			
		}

	}catch(err){
		res.status(400).json({"result":"false","message":err.message});
	}

};





//Rsend otp api in vender app
const resendOtp = async (req, res) => {
  try {
		const { mobile_number, email, choose_status } = req.body;

		if (!choose_status) {
			return res.status(400).json({ "result": "false", "message": "Required parameters are mobile_number and choose_status,email (1 for SMS and 2 for email)" });
		} else {
			if (choose_status == 1) {
				const matchData = await Vender.findOne({ mobile_number });

				if (!matchData) {
					return res.status(400).json({ "result": "false", "message": "Mobile number does not match" });
				} else {
					const otp = generate_otp();
					const updatedData = await Vender.findOneAndUpdate({ mobile_number }, { $set: {otp:otp} }, { new: true });
					res.status(200).json({ "result": "true", "message": "OTP sent successfully on phone", data: updatedData });
				}

			} else {
				const matchDatas = await Vender.findOne({email:email});
				if (!matchDatas) {
					res.status(400).json({ "result": "false", "message": "Email is empty" });
				} else {
					const Otp = generate_otp();
					const updatedDatas = await Vender.findOneAndUpdate({email}, { $set: {otp:Otp} }, { new: true });
					res.status(200).json({ "result": "true", "message": "OTP sent successfully on email", data: updatedDatas });
					
				}

			}
		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};





/*.........................create seller password api ........................... */
const createSeller_password=async(req,res)=>{
  try{
    const {sellerId,password,confirm_password}=req.body;
    if(!sellerId || !password || !confirm_password){
      return res.status(400).json({
        "result": "false",
        "message": "Required parameters are sellerId,password,confirm_password",
      });
    }

    if(password !== confirm_password){
      return res.status(400).json({
        "result": "false",
        "message": "password doesn't match",
      });

    }

      const matchData=await Vender.findOne({_id:sellerId});
      if(!matchData){
        res.status(400).json({ "result": "false", "message": "Invalid sellerId "});

      }else{
        const hashedPassword=await bcrypt.hash(password,10);
        const updatedData=await Vender.findOneAndUpdate({_id:sellerId},{password:hashedPassword},{new:true});
        res.status(200).json({"result":"false","message":"Password created sucussfully",data:updatedData});
      }
    

  }catch(err){
    console.log(err)
    res.status(400).json({ "result": "false", "message": err.message });
  }

};




// venfer login with email adrress
const venderLogin_withEmail=async(req,res)=>{
  try{
		const {key,password,fcm_Id}=req.body;
		if(!password || !key){
			return res.status(400).json({"result":"false","message":"required parameters are password and key (send mobile_number or email  in key,fcm_Id)"})
    }
			const Data=await Vender.findOne({$or:[{mobile_number:key},{email:key}]});
			if(!Data){
        const datas=await Staff.findOne({$or:[{phone:key},{email:key}]});

              if(!datas){
                res.status(400).json({"result":"false","message":"You are not register"});
              }else{
                    if(datas.status==2){
                      return res.status(400).json({"result":"false","message":"Your account has been suspended"})
                    }
        
                    const matchData=await Staff.findOne({password,$or:[{phone:key},{email:key}]});
                  
                    if(matchData){
                      if(matchData.active_status=="1"){
                        return res.status(400).json({"result":"false","message":"Your account has been blocked"})
                       }

                      await Staff.findOneAndUpdate({$or:[{phone:key},{email:key}]},{fcm_Id},{new:true});
                      const dinu=matchData.restrictions;
                          res.status(200).json({"result":"true","message":"Staff login sucessfully",
                          data:matchData,
                          restrictions:dinu
                        });
                    }else{
                      res.status(400).json({"result":"false","message":"password does not match"})
                    }
                  }
			}else{
            if(Data.vender_status==0){
              return res.status(400).json({"result":"false","message":"You account have not approved by admin yet"})
            }

            if(Data.vender_status==2){
              return res.status(400).json({"result":"false","message":"Your account has been deleted"})
            }
						const matchData=await Vender.findOne({$or:[{mobile_number:key},{email:key}]});
            // Compare the provided password with the hashed password in the database
				    const passwordMatch = await bcrypt.compare(password, matchData.password);

						if(passwordMatch){
              //generate token
              await Vender.findOneAndUpdate({$or:[{mobile_number:key},{email:key}]},{fcm_Id},{new:true});
					const token = jwt.sign({ venderId:matchData._id,email:matchData.email,mobile_number:matchData.mobile_number}, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });	
             const innt=matchData.serviceType;
             const checktype=await Maincategory.findOne({_id:innt});
             if(checktype.maincategory_englishName=="Innt"){
									res.status(200).json({"result":"true","message":"Vender login sucessfully",
                  data:matchData,
                  token,
                  restrictions:{
                  Products: [
                    "/Products List",
                    "/Add New Products"
                  ],
                  Order: [
                    "/All Orders",
                    "/Pending Orders",
                    "/Confirm Orders",
                    "/Packaging Orders",
                    "/Shipped",
                    "/Delivered Orders",
                    "/Canceled Orders",
                    "/Returned Orders",
                    "/Not Delivered"
                  ],
                  Coupons: [
                    "/Coupon"
                  ],
                  Offer: [
                    "/Offer"
                  ],
                  "Refund Request List": [
                    "/Pending Refund",
                    "/Approved Refund",
                    "/Refunded",
                    "/Rejected Refund"
                  ],
                  "Payment Management": [
                    "/Payment Management"
                  ],
                  Staff: [
                    "/Staffs"
                  ],
                  "QR Codes": [
                    "/QR Codes"
                  ],
                  "Terms & Privacy Policy": [
                    "/Terms & Privacy Policy"
                  ],
                  "Refund & Return Policy": [
                    "/Refund & Return Policy"
                  ],
                  "Cancellation Policy": [
                    "/Cancellation Policy"
                  ],
                  "About Us": [
                    "/About Us"
                  ],
                  Reviews: [
                    "/Reviews"
                  ],
                  Notifications: [
                    "/Notifications"
                  ],
                  Chat: [
                    "/Customers",
                    "/Deliverymen"
                  ],
                  Withdraw: [
                    "/Withdraw"
                  ],
                  "My Bank Info": [
                    "/My Bank Info"
                  ],
                  "My Shop": [
                    "/My Shop"
                  ]}
                });
              }else{
                res.status(200).json({"result":"true","message":"Vender login sucessfully",
                  data:matchData,
                  token,
                  restrictions:{
                  Products: [
                    "/Products List",
                    "/Add New Product"
                  ],
                  Order: [
                    "/All Orders",
                    "/Pending Orders",
                    "/Confirm Orders",
                    "/Packaging Orders",
                    "/Shipped",
                    "/Delivered Orders",
                    "/Canceled Orders",
                    "/Returned Orders",
                    "/Not Delivered"
                  ],
                  Coupons: [
                    "/Coupon"
                  ],
                  Offer: [
                    "/Offer"
                  ],
                  "Refund Request List": [
                    "/Pending Refund",
                    "/Approved Refund",
                    "/Refunded",
                    "/Rejected Refund"
                  ],
                  "Payment Management": [
                    "/Payment Management"
                  ],
                  Staff: [
                    "/Staffs"
                  ],
                  "QR Codes": [
                    "/QR Codes"
                  ],
                  "Terms & Privacy Policy": [
                    "/Terms & Privacy Policy"
                  ],
                  "Refund & Return Policy": [
                    "/Refund & Return Policy"
                  ],
                  "Cancellation Policy": [
                    "/Cancellation Policy"
                  ],
                  "About Us": [
                    "/About Us"
                  ],
                  Reviews: [
                    "/Reviews"
                  ],
                  Notifications: [
                    "/Notifications"
                  ],
                  Chat: [
                    "/Customers",
                    "/Deliverymen"
                  ],
                  Withdraw: [
                    "/Withdraw"
                  ],
                  "My Bank Info": [
                    "/My Bank Info"
                  ],
                  "My Shop": [
                    "/My Shop"
                  ]}
                });

              }
             
						}else{
							res.status(400).json({"result":"false","message":"password does not match"})
						}
					}

	}catch(err){
		res.status(400).json({"result":"false","message":err.message});
	}
};













/*.........................vender login api........................... */
const venderLogin=async(req,res)=>{
  try{
		const {mobile_number}=req.body;
		if(!mobile_number){
			res.status(400).json({"result":"false","message":"required parameters mobile_number"})
		}else{
			const Data=await Vender.findOne({mobile_number});
			if(!Data){
				res.status(400).json({"result":"false","message":"You are not register"});
			}else{
           const otp=generate_otp();
						const matchData=await Vender.findOneAndUpdate({mobile_number},{$set:{otp:otp}},{new:true});
            const data={
              _id:matchData._id,
              otp:matchData.otp,
              shop_name:matchData.shop_name,
              fcm_Id:matchData.fcm_Id,
              mobile_number:matchData.mobile_number,

            }
						res.status(200).json({"result":"true","message":"Otp generate sucessfully",data:data});
					
					}
				}

	}catch(err){
		res.status(400).json({"result":"false","message":err.message});
	}

};





// forgotPassword api
const forgotPassword=async(req,res)=>{
  const {key}=req.body;
  if(!key ){
    res.status(400).json({"result":"false","message":"required parameters key and send email and mobile_number in key"});
  };
	try{
    const data = await Vender.findOne({ $or: [{ mobile_number: key }, { email: key }] });

    if(data){
      const otp=generate_otp();
			const Data = await Vender.findOneAndUpdate({$or:[{mobile_number:key},{email:key}]},{$set:{otp:otp}},{new:true});
      res.status(200).json({"result":"true","message":"Otp send sucessfully",data:Data});
      }
			else{
        res.status(400).json({"result":"false","message":"Please send correct email and mobile_number"})
			}
		
	}catch(err){
		res.status(400).json({"result":"false","message":err.message});
	}

};



 
// verifyEmail
const verifyEmail_andMobile=async(req,res)=>{
	const {key,otp}=req.body;
	if(!key || !otp){
		res.status(400).json({'result':"false","message":"required parameter are otp, key"})
	};
	try{
	const data=	await Vender.findOne({ $or: [{ mobile_number: key }, { email: key }],otp:otp });
		if(!data){
			res.status(400).json({'result':"false","message":"Invalid otp"})

		}else{
			res.status(200).json({'result':"true","message":"Your otp verified sucessfully",data:data})

		}

	}catch(err){
		console.log(err.mesage)
	}


};



// resetPassword
const resetPassword=async(req,res)=>{
	const {key,password}=req.body;
	if(!key || !password){
		res.status(400).json({'result':"false","message":"required parameter are password, key"})
	};
	try{
		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(password, 10);
		await Vender.findOneAndUpdate({ $or: [{ mobile_number: key }, { email: key }] },{$set:{password:hashedPassword}},{new:true});
		res.status(200).json({'result':"true","message":"Password reset sucessfully"})

	}catch(err){
		console.log(err.mesage)
	}


};






/*..............................Product start api...................... */
const addProduct=async(req,res)=>{
  try {
    const {
        venderId,
        categoryId,
        subcategoryId,
        productType,
        sub_subcategoryId,
        product_name,
        description,
        productSize,
        product_code,
        brand_name,
        productPreparation_time,
        product_variation,
        product_details,
       frnz_product_details,
       frnz_description,
       frnz_product_name,
        warranty,
        note,
        unit_price,
        sale_price,
        discount,
        Tax,
        stock,
        minimum_order,
        deliveryType,
        store_description,
        product_weight,
        returnType,
 
    } = req.body;
    const{
         image1,
         image2,
         image3,
         image4,
         image5,
         video,
        }=req.files || {};


        if(!venderId ||
          !categoryId ||
          !subcategoryId ||
          !product_name ||
          !unit_price 
          ) {

           return res.status(400).json({
              "result":"false","message":"required parameters are  venderId,categoryId,subcategoryId,productType,sub_subcategoryId,"+
               "product_name,description,product_weight,productSize,product_code,store_description, brand_name,productPreparation_time,"+
               "product_variation,product_details,warranty,note, unit_price, sale_price,discount,Tax,stock, minimum_order,deliveryType,"+
               "image1,image2,image3,image4,image5,video frnz_product_details,frnz_description,frnz_product_name,"
            });
          };


    //  Exist product 
    const matchData=await Product.findOne({venderId:venderId,product_name:product_name});
    if(matchData){
      return res.status(400).json({
        "result":"false","message":"Product name allready exist "
      });
    };
 
     if(product_variation){
     // Process product variations
     var variants = [];
    if (product_variation && typeof product_variation === 'string') {
      try {
        const parsedVariations = JSON.parse(product_variation);
        if (Array.isArray(parsedVariations)) {
          variants = parsedVariations.map(variation => {
            const { attribute_name, attribute_values } = variation;
            return {
              attribute_name,
              attribute_values: attribute_values.split(',').map(value => value.trim()),
            };
          });
        }
      } catch (e) {
        return res.status(400).json({
          "result": "false",
          "message": "Invalid JSON format for product_variation",
        });
      }
    }
  }



   const  discounts=JSON.parse(discount);
   const  Taxs=JSON.parse(Tax);
   const returns=JSON.parse(returnType);
   if(discounts[0].discount_type === "Unit"){
    sale_prices=Number(unit_price - discounts[0].discount_value);
   }else{
    real_discount = ((unit_price * discounts[0].discount_value) / 100).toFixed(2)
    sale_prices=Number( unit_price - real_discount).toFixed(2);
   }
  
    
    const newProduct = new Product({
        venderId,
        categoryId,
        subcategoryId,
        product_name,
        description,
        productType,
        productSize,
        sub_subcategoryId,
        image1: image1 ? image1[0].filename:undefined,
        image2: image2 ? image2[0].filename:undefined,
        image3: image3 ? image3[0].filename:undefined,
        image4: image4 ? image4[0].filename:undefined,
        image5: image5 ? image5[0].filename:undefined,
        video: video ? video[0].filename:undefined,
        productPreparation_time,
        product_details,
        product_code,
        brand_name,
        warranty,
        note,
        minimum_order,
        deliveryType,
        unit_price,
        sale_price:sale_prices,
        product_variation:variants,
        discount:discounts,
        product_weight,
        Tax:Taxs,
        stock:stock,
        store_description,
        returnType:returns,
        frnz_product_details,
       frnz_description,
       frnz_product_name,
        
    });

    const savedProduct = await newProduct.save();
    res.status(200).json({"result":"true","message":"Product insert sucessfully",data:savedProduct});

} catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({"result":"false","message":error.message});
}
};






//  productlist api
const productList=async(req,res)=>{
  try {
    const {venderId} = req.body;
    
        if(!venderId){
            res.status(400).json({
              "result":"true","message":"required parameters are venderId"
            });
          }else{
    
    const newProduct =await Product.find({
        venderId:venderId
    });

    if(newProduct || newProduct.length>0){
      const data=newProduct.map(item=>({
        productId:item._id,
        venderId:item.venderId,
        product_name:item.product_name,
        productType:item.productType,
        product_code:item.product_code,
        description:item.description,
        sale_price:item.sale_price,
        image:item.image1,
        status:item.status,
        frnz_product_details:item.frnz_product_details,
        frnz_description:item.frnz_description,
        frnz_product_name:item.frnz_product_name,
        product_details:item.product_details,

      }));
    res.status(200).json({"result":"true","message":"Product list get sucessfully",data:data});
}else{
    res.status(400).json({"result":"false","message":"Record not found"});
}
}
} catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({"result":"false","message":error.message});
}

};




// products details api
const productDetails=async(req,res)=>{
  try {
    const {venderId,productId} = req.body;
    
        if(!venderId || !productId){
            res.status(400).json({
              "result":"true","message":"required parameters are venderId,productId"
            });
          }else{
    
    const newProduct =await Product.find({
        venderId:venderId,
        _id:productId
         
    }).populate('categoryId').populate('subcategoryId');

    if(newProduct || newProduct.length>0){
      
    res.status(200).json({"result":"true","message":"Product list get sucessfully",data:newProduct});
}else{
    res.status(400).json({"result":"false","message":"Record not found"});
}
}
} catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({"result":"false","message":error.message});
}


};


const productUpdate = async (req, res) => {
  try {
    const {
      venderId,
      productId,
      unit_price,
      discount
    } = req.body;

    if (!venderId || !productId || !unit_price || !discount) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameters are venderId, productId, unit_price, discount"
      });
    };

    const discounts = Array.isArray(discount) ? discount : [discount];

    if (discounts.length > 0) {
      if (discounts[0].discount_type === "Unit") {
        sale_prices = Number(unit_price - discounts[0].discount_value);
      } else {
        real_discount = ((unit_price * discounts[0].discount_value) / 100).toFixed(2);
        sale_prices = Number(unit_price - real_discount).toFixed(2);
      }
    }

    // Update product
    const updateObject = {
      unit_price,
      sale_price: sale_prices,
      discount: discounts
    };

    // Corrected usage of findByIdAndUpdate
    await Product.findByIdAndUpdate(productId, updateObject, {
      new: true
    });

    res.status(200).json({
      "result": "true",
      "message": "Product updated successfully"
    });

  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({
      "result": "false",
      "message": error.message
    });
  }
};




// delete product api
const deleteProduct=async(req,res)=>{
  try{
    const {venderId,productId}=req.body;
    if(!venderId || !productId){
      return res.status(400).json({"result":"false","message":"required parameter are venderId and productId"})

    }
    const data =await Product.findOne({_id:productId});
    if(!data){
      return  res.status(400).json({"result":"false","message":"Product does not found"})

    }
    await Product.findByIdAndDelete({_id:productId,venderId:venderId});
    res.status(200).json({"result":"true","message":"Product deleted sucessfully"})

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message})
  }

};





// change product active status
const productActive_statusChange=async(req,res)=>{
  const {venderId,productId}=req.body;

if(!productId){
	res.status(400).json({"result":"false","message":"required parameter productId"});
};
try{
	
		const findData= await Product.findOne({_id:productId});
		if(findData.product_status == 0){
		const data=await Product.findByIdAndUpdate({_id:productId},{$set:{product_status:1}},{new:true});
		res.status(200).json({"result":"true","message":" Product Deactive sucessfully"})
	}else{
		await Product.findByIdAndUpdate({_id:productId},{$set:{product_status:0}},{new:true});
		res.status(200).json({"result":"true","message":" Product Active sucessfully"})
	}
}
	
catch(err){
	res.status(400).json({"result":"false","message":err.message});
}



};

/*..............................Product end api...................... */

//update venderProfile data api
const Update_venderProfile=async(req,res)=>{
  try{
    const {venderId} = req.body;
    const {vender_profile}=req.files || {};
    
    if (!venderId || vender_profile == null){
      return res.status(400).json({
        "result": "false",
        "message":"required parameters are venderId,vender_profile"});

    }
    
  const matchData=await Vender.findOne({_id:venderId});
  if(!matchData){
    res.status(400).json({"result":"false","message":"Vender does not found"})
  }else{
    
    const updatedData= await Vender.findByIdAndUpdate({_id:venderId},{vender_profile:vender_profile[0].filename},{new:true});
    res
      .status(200)
      .json({ result: true, message: "Vendor profle updated successfully",data:updatedData});
    }
  


  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }

};




//update bank information data
const update_BankInformation=async(req,res)=>{
  try{
    const {mobile_money_number,bank_name,acc_number,bankAccount_name,swift_code,venderId}=req.body;
  if(!venderId){
    res.status(400).json({"result":"false","message":"require parameters are venderId and optionals are mobile_money_number,bank_name,acc_number,bankAccount_name,swift_code"})
  }else{
    const updateObject={
      mobile_money_number,
      bank_name,
      acc_number,
      bankAccount_name,
      swift_code

    }
    const validation=await Vender.findById({_id:venderId});
    if(!validation){
      res.status(400).json({"result":"false","message":" Invalid venderId"});

    }else{
    const updatedData=await Vender.findByIdAndUpdate({_id:venderId},updateObject,{neq:true});
    res.status(200).json({"result":"true","message":"Bank information updated sucessfully",data:updatedData});
}
  }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }
};




//getBank_information api
const getBank_information=async(req,res)=>{

  try{
    const {venderId}=req.body;
    if(!venderId){
      res.status(400).json({"result":"false","message":"require parameter is  venderId"})

    }else{
      const data= await Vender.findOne({_id:venderId});
      if(!data){
        res.status(400).json({"result":"false","message":"Vender does not found"});

      }else{
        const dinu={
          _id:data._id,
          bank_name:data.bank_name,
          acc_number:data.acc_number,
          bankAccount_name:data.bankAccount_name,
          swift_code:data.swift_code,
          mobile_money_number:data.mobile_money_number
        }
        res.status(200).json({"result":"true","message":'bank information data are',data:dinu});

      }
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }

};


//create sub_subcategory_list api
const sub_subcategory_list=async(req,res)=>{
  try{
    const {subcategoryId}=req.body;
    if(!subcategoryId){
      res.status(400).json({"result":"false","message":"require parameter is  subcategoryId"})

    }else{
      const data= await Sub_subcategory.find({subcategoryId:subcategoryId});
        res.status(200).json({"result":"true","message":'sub_subcategory data are',data:data});
      
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }


};


// change vendor password
const changeVendor_password = async (req, res) => {
  try {
    const { venderId, password, newpassword, confirm_password } = req.body;
    if (!venderId || !password || !newpassword || !confirm_password) {
      return res.status(400).json({ "result": "false", "message": "Required parameters are venderId, password, newpassword, confirm_password" });
    }

    if (newpassword !== confirm_password) {
      return res.status(400).json({ "result": "false", "message": "newpassword and confirm_password do not match" });
    }

    const vendor = await Vender.findOne({ _id: venderId });
    if (!vendor) {
      return res.status(400).json({ "result": "false", "message": "Vendor not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, vendor.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ "result": "false", "message": "Incorrect password" });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update the password field with the new hashed password
    await Vender.findOneAndUpdate({ _id: venderId }, { password: hashedPassword }, { new: true });

    res.status(200).json({ "result": "true", "message": "Password changed successfully" });

  } catch (err) {
    console.log(err);
    res.status(400).json({ "result": "false", "message": err.message });
  }
};




// promotin  add api
const promotinAdd = async (req, res) => {
  try {
    const {
      venderId, cupon_code, cupon_type, cupon_title, numberOfcoupon,
      expire_date, start_date, discountType, id, appliesCoupon, appliesType,
      sameUser_discountLimit, discountAmount
    } = req.body;

    // Check for required parameters
    if (!venderId || !cupon_code || !cupon_type || !cupon_title || !numberOfcoupon ||
        !expire_date || !start_date || !appliesCoupon || !sameUser_discountLimit) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameters are venderId, cupon_code, cupon_type, cupon_title, numberOfcoupon, " +
                   "expire_date, start_date, discountType,discountAmount,appliesType, appliesCoupon, id, sameUser_discountLimit"
      });
    }

    let ID;
    if (id) {
      // Split the id string and map it to ObjectId type
      ID = id.split(',').map(id =>new mongoose.Types.ObjectId(id.trim()));
    } else {
      ID = [];
    }

    const insertData = new Promotion({
      venderId,
      cupon_type,
      cupon_code,
      cupon_title,
      expire_date,
      start_date,
      sameUser_discountLimit,
      numberOfcoupon,
      discountType,
      discountAmount,
      appliesCoupon,
      appliesType,
      id: ID
    });

    const data = await insertData.save();
    res.status(200).json({
      "result": "true",
      "message": "Data inserted successfully",
      "data": data
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
}





//Promotion   list api
const promotinList=async(req,res)=>{
  try{
    const {venderId}=req.body;
    if(!venderId){
      res.status(200).json({"result":"false","message":"required parameter are venderId"})

    }else{
     const data =await Promotion.find({venderId:venderId});
     if(!data){
      res.status(400).json({"result":"false","message":"data does not found"})
     }else{
      res.status(200).json({"result":"false","message":"promontion list are",data:data})
     }
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.mesage});
  }

};











//Promotion   list api
const promotinDetails=async(req,res)=>{
  try{
    const {promotionId}=req.body;
    if(!promotionId){
      res.status(200).json({"result":"false","message":"required parameter are promotionId"})

    }else{
     const data =await Promotion.find({_id:promotionId});
     if(!data){
      res.status(400).json({"result":"false","message":"data does not found"})
     }else{
      res.status(200).json({"result":"false","message":"promontion list are",data:data})
     }
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.mesage});
  }

};



//Promotion   update api
const promotinUpdate=async(req,res)=>{
  const {venderId,promotionId,cupon_type,cupon_title,customer_type,
    expire_date,start_date,discountPercantage,discountAmount,
     sameUser_discountLimit,minimum_purchase}=req.body;
     if(!venderId   || 
      !promotionId
      ){
        res.status(400).json({"result":"false","message":"required paramter are venderId,promotionId,cupon_title,customer_type,expire_date,start_date,discountPercantage,discountAmount,sameUser_discountLimit,minimum_purchase"});
      }

  try{
    const data = await Promotion.findOne({venderId : venderId, _id:promotionId});
    if(data){
      await Promotion.findOneAndUpdate({venderId : venderId, _id:promotionId},
        {$set:{cupon_type,
          cupon_title, 
          expire_date,
          start_date,
          discountPercantage,
          discountAmount,
         sameUser_discountLimit,
         minimum_purchase}},
         {new:true});

        res.status(200).json({"result":"true","message":"data updated sucessfully"});
  }else{
      res.status(400).json({"result":"false","message":"data does not found"});
  }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.mesage});
  }
};



// promotin  delete api
const promotinDelete=async(req,res)=>{
  const {venderId,promotionId}=req.body;
     if(!venderId   || 
      !promotionId){
        res.status(400).json({"result":"false","message":"required paramter are venderId,promotionId"});
      }

  try{
    const data=await Promotion.findOne({venderId:venderId,_id:promotionId});
    if(!data){
      res.status(400).json({"result":"false","message":"data does not found"});
    }else{
    await Promotion.findOneAndDelete({venderId:venderId,_id:promotionId});
    res.status(200).json({"result":"true","message":"data deleted sucessfully"});
  }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.mesage});
  }
  
};



// change promotion active status
const changePromotion_status=async(req,res)=>{
  try{
    const {promotionId}=req.body;
    if(!promotionId){
      res.status(400).json({"result":"false","message":"required parameter are promotionId"});

    }else{
      const data=await Promotion.findOne({_id:promotionId});
      if(!data){
      res.status(400).json({"result":"false","message":"record not found"});
}else{
   if(data.act_status==0){
    const deactive=await Promotion.findOneAndUpdate({_id:promotionId},{$set:{act_status:1}},{new:true})
    res.status(200).json({"result":"false","message":"Promotion Deactive sucessfully",data:deactive});
   }else{
    const active=await Promotion.findOneAndUpdate({_id:promotionId},{$set:{act_status:0}},{new:true})
    res.status(200).json({"result":"false","message":"Promotion Active sucessfully",data:active});
   }

}
    }

  }catch(error){
    console.log(error)
    res.status(400).json({"result":"false","message":error.mesage});
  }

};



// vender catergory list
const venderCategory_list=async(req,res)=>{

  try{
    const {venderId}=req.body;
    if(!venderId){
     return res.status(400).json({"result":"false","messsage":"required paramter are venderId"})

    }
      const findData=await Vender.findById({_id:venderId});
    if(!findData){
      res.status(400).json({"result":"false","mesage":" Vender data does  not found"})
    }else{
      const mainCategory=findData.serviceType;
        const categoryList= await Category.find({maincategoryId:mainCategory});
        const filterData=categoryList.map(item=>({
          categoryId:item._id,
          category_englishName:item.category_englishName,
          category_frenchName:item.category_frenchName,
          category_image:item.category_image
        }))
        if(!categoryList || !categoryList.length>0){
          res.status(400).json({"result":"false" ,"message":"category list not found",data:filterData})

        }else{
        res.status(200).json({"result":"true" ,"message":"category list are",data:filterData})
}
     
    }
    
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }

};





// vender subcategory list 
const venderSubcategory_list=async(req,res)=>{
  try{
    const {categoryId}=req.body;
    if(!categoryId){
      res.status(400).json({"result":"false","messsage":"required paramter are categoryId"})

    }else{
      const findData=await Subcategory.find({categoryId});
    if(!findData){
      res.status(400).json({"result":"false","mesage":" Vender data does  not found"})
    }else{
        const filterData=findData.map(item=>({
          subcategoryId:item._id,
          english_subcategory_name:item.english_subcategory_name,
          french_subcategory_name:item.french_subcategory_name,
          subcategory_image:item.subcategory_image
        }))
         
        res.status(200).json({"result":"true" ,"message":"subcategory list are",data:filterData})
      }
    }


    
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }

};




const addOffer = async (req, res) => {
  try {
    const { vendorId, productId, select_directly, offerType, limitPeruser, start_date, end_date } = req.body;
    if (!vendorId || !select_directly) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameters are vendorId, select_directly, offerType, limitPeruser, start_date, end_date, productId"
      });
    }

    //const productID = productId.split(',');

    const validation = await Offer.findOne({ vendorId: vendorId,productId:productId});
    
    if (validation) {
        const updateData = {
          offerType,productId,select_directly,limitPeruser, start_date, end_date
        }
        const updatedData = await Offer.findOneAndUpdate(
          { vendorId: vendorId,productId},
          updateData,
          { new: true }
        );
        return res.status(200).json({
          "result": "true",
          "message": "Offer updated successfully",
          "data": updatedData
        });
    
    }
    const updateData = {
      offerType,productId,vendorId,select_directly,limitPeruser, start_date, end_date
    }
    const insertData = new Offer(updateData);
    const data = await insertData.save();
    return res.status(200).json({
      "result": "true",
      "message": "Offer added successfully",
      "data": data
    });

  } catch (err) {
    return res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
};





// offer list api
const offerList=async(req,res)=>{
  try{
    const {vendorId}=req.body;
    if(!vendorId ){
      return res.status(400).json({"result":"false","message":
       "required parameters are vendorId"})
    }
    const listData=await Offer.find({vendorId:vendorId}).populate('productId');
    if(!listData){
      return res.status(400).json({"result":"false","message":"Data does not found"});
    }
    
   res.status(200).json({"result":"true" ,"message":"Offer list get sucessfully",data:listData});
   
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }

};



// update offer 
const offer_on_off=async(req,res)=>{
  try{
    const {offerId}=req.body;
    if(!offerId){
      return res.status(400).json({"result":"false","message":
       "required parameters is offerId"})
    }
    const updatedData=await Offer.findOne({_id:offerId});
    if(updatedData.offer_status=="0"){
      await Offer.findOneAndUpdate({_id:offerId},{offer_status:1},{new:true});
      res.status(200).json({"result":"true","message":"Offer On sucessfully"});
    }else{
      await Offer.findOneAndUpdate({_id:offerId},{offer_status:0},{new:true});
      res.status(200).json({"result":"true","message":"Offer Off sucessfully"});
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }

};



//offer delete api
const deleteOffer=async(req,res)=>{
  try{
    const {offerId}=req.body;
    if(!offerId){
      return res.status(400).json({"result":"false","message":
       "required parameters are offerId"})
    }

     await Offer.findByIdAndDelete({_id:offerId});   
   res.status(200).json({"result":"true" ,"message":"Offer deleted sucessfully"});
   
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }

};





// get Vender profile api
const getVenderProfile=async(req,res)=>{
  try{
    const {venderId}=req.body;
    if(!venderId){
      res.status(400).json({"result":"false","message":"require parameter is  venderId"})

    }else{
      const data= await Vender.findOne({_id:venderId});
      if(!data){
        res.status(400).json({"result":"false","message":"Vender does not found"});

      }else{
        res.status(200).json({"result":"true",
        "message":' vender profile data are',
        "path":"http://103.104.74.215:3037/uploads/",
        data:data
      });

      }
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }

};



// venderAccount delete api
const venderAccount_delete=async(req,res)=>{
  try{
    const {venderId}=req.body;
    if(!venderId){
      res.status(400).json({"result":"false","message":"require parameter is  venderId"})

    }else{
      const data= await Vender.findOne({_id:venderId});
      if(!data){
        res.status(400).json({"result":"false","message":"Vender does not found"});

      }else{
        const modified_data=await Vender.findByIdAndUpdate({_id:venderId},{$set:{active_status:1}},{new:true});
        res.status(200).json({"result":"true",
        "message":'Vender deleted sucessfully',
        data:modified_data
        
      });

      }
    }

  }catch(err){
    console.log(err)
    res.status(400).json({"result":"false","message":err.message});
  }

};



// Update vendor data
const updateShop_information = async (req, res) => {
  try {
    const {
      venderId,
      shop_name,
      shop_address,
      country,
      city,
      workHours,
      longitude,
      latitude,
    } = req.body;
    const { shop_logo, shop_licence, vender_profile } = req.files || {};

    if (!venderId) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter is venderId, and optional parameters are shop_name, shop_address, country, city, workHours, longitude, latitude, shop_logo, shop_licence, vender_profile"
      });
    }

    const matchData = await Vender.findOne({ _id: venderId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Vendor does not exist"
      });
    } 
    const workHour =JSON.parse(workHours) || {};

    if(vender_profile && shop_logo && shop_licence){

      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        vender_profile: vender_profile ? vender_profile[0].filename : null,
        shop_logo: shop_logo ? shop_logo[0].filename : null,
        shop_licence: shop_licence ? shop_licence[0].filename : null,
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }
    }else if(vender_profile && shop_logo){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        vender_profile: vender_profile ? vender_profile[0].filename : null,
        shop_logo: shop_logo ? shop_logo[0].filename : null,
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }else if(shop_licence && shop_logo){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        shop_licence: shop_licence ? shop_licence[0].filename : null,
        shop_logo: shop_logo ? shop_logo[0].filename : null,
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }
    else if(vender_profile && shop_licence){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        vender_profile: vender_profile ? vender_profile[0].filename : null,
        shop_licence: shop_licence ? shop_licence[0].filename : null,
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }
    else if(vender_profile){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        vender_profile: vender_profile ? vender_profile[0].filename : null,
       
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }else if(shop_logo){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        shop_logo: shop_logo ? shop_logo[0].filename : null,
       
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }else if(shop_licence){
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        shop_licence: shop_licence ? shop_licence[0].filename : null,
       
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }
    else{
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        workHours:workHour,
        shop_name,
        shop_address,
        country,
        city,
        
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true","message":"data updated sucessfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }
    
  } catch (error) {
    return res.status(500).json({ "result": "false", "message": error.message });
  }
};





//reviews list
const productReviews_list = async (req, res) => {
  try {
    const { venderId } = req.body;

    if (!venderId) {
      return res.status(400).json({ "result": "false", "message": "Required parameter 'venderId' is missing" });
    }

    
    const viewList = await Product.find({ venderId }).sort({"rating":-1});
    if(!viewList || viewList.length===0){
      return res.status(400).json({ "result": "false", "message": "Data does not found" });
    }

    const raterList = await Rating.find({ venderId });

    // Count the number of raters for each productId
    const ratersMap = {};
    raterList.forEach(ratingItem => {
      const productId = ratingItem.productId.toString();
      ratersMap[productId] = (ratersMap[productId] || 0) + 1;
    });

    // Merge data based on productId and add raters count
    viewList.forEach(viewItem => {
      const productId = viewItem._id.toString();
      viewItem.raters = ratersMap[productId] || 0;
    });


    // Format data for response
    const data = viewList.map(item => ({
      productId: item._id,
      image: item.image1,
      shopId: item.venderId,
      product_name: item.product_name,
      productType: item.productType,
      product_code: item.product_code,
      rating: item.rating,
      raters: item.raters
    }));

    // Send response with the formatted data
    res.status(200).json({ "result": "true", "message": "Review list retrieved successfully", data:data });

  } catch (error) {
    console.error(error);
    res.status(400).json({ "result": "false", "message": error.message });
  }
};







// create reviews details api'
const reviewsDetails=async(req,res)=>{
  try{
    const {productId } = req.body;

    if (!productId) {
      return res.status(400).json({ "result": "false", "message": "Required parameter 'productId' is missing" });
    }
    const viewList = await Product.find({_id:productId });
     const ratersCount = await Rating.find({productId}).countDocuments();
   
// Format data for response
const data = await Promise.all(viewList.map(async viewItem => {
  // Find all ratings for the current product
  const ratings = await Rating.find({ productId: viewItem._id });

  // Fetch user details for each rating
  const ratingsDetails = await Promise.all(ratings.map(async rating => {
    // Fetch user details
    const userDetails = await User.findById(rating.userId);
    return {
      ...rating.toObject(),
      userDetails: userDetails ? userDetails.toObject() : null
    };
  }));

  return {
    ratingId:viewItem._id,
    productId: viewItem._id,
    image: viewItem.image1,
    shopId: viewItem.venderId,
    product_name: viewItem.product_name,
    productType: viewItem.productType,
    product_code: viewItem.product_code,
    rating: viewItem.rating,
    raters: ratersCount || 0,
    ratingsDetails: ratingsDetails
  };
}));


   res.status(200).json({ "result": "true", "message": "Review details retrieved successfully", data:data });

  }catch(error){
    console.log(error)
    res.status(400).json({"result":"false","message":error.message});
  }

};




//singleReview_detail
const singleReview_detail = async (req, res) => {
  try {
      const { ratingId } = req.body;
      if (!ratingId) {
          return res.status(400).json({ "result": "false", "message": "Required parameter ratingId" });
      }
      const data = await Rating.findOne({ _id: ratingId }).populate('userId');
      if (!data) {
          return res.status(404).json({ "result": "false", "message": "Rating not found" });
      }

      // Find all replays for the current rating
      const replays = await Replayrating.find({ ratingId: data._id });

      // Format data for response
      const ratingsDetails = replays.map(replay => {
          return {
              ...replay.toObject(),
          };
      });
      // Return response
      return res.status(200).json({
          "result": "true",
          "message": "Replay details retrieved successfully",
          "data": {
              ratingId: data._id,
              productId: data.productId,
              image: data.image1,
              shopId: data.venderId,
              userFirst_name: data.userId.first_name,
              userLast_name: data.userId.last_name,
              userImage: data.userId.user_profile,
              comment: data.comment,
              rating: data.rating,
              ratingsDetails: ratingsDetails
          }
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ "result": "false", "message": error.message });
  }
};







//review replay
const reviewReplay=async(req,res)=>{
  try{
    const {ratingId,shopId,message}=req.body;
    if(!ratingId || !message){
      return res.status(400).json({ "result": "false", "message": "Required parameter ratingId,shopId,message" });
    }

    const data = new Replayrating({ratingId,message,shopId});
    await data.save();
    res.status(200).json({"result":"true","message":"Replay added sucessfully"})

  }catch(error){
    console.log(error)
    res.status(400).json({"result":"false","message":error.message});
  }
  
};



//review report
const reviewReport=async(req,res)=>{
  try{
    const {ratingId,shopId,message}=req.body;
    if(!ratingId || !message){
      return res.status(400).json({ "result": "false", "message": "Required parameter ratingId,shopId,message" });
    }

    const data = new Reportrating({ratingId,message,shopId});
    await data.save();
    res.status(200).json({"result":"true","message":"Report added sucessfully"})

  }catch(error){
    console.log(error)
    res.status(400).json({"result":"false","message":error.message});
  }

  
};




const venderMain_Category_list=async(req,res)=>{
  try{
    const data={
      innt:"Innt",
      innt_out:"InntOut"
    }
res.status(200).json({"result":"true","message":"main category list are ",data:data})
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }


};




/*------------------------admin to vender chat api------------------------- */
const venderSend_message=async(req,res)=>{
  const {text,venderId,userId,driverId,send_status,status} = req.body;
  if(!venderId || !send_status){
    return res.status(400).json({"result":"false","message":"required parameter are venderId ,text,status,send_status(user 0,driver 4) and optional are userId,driverId"})
  };

  try {
    if(!req.file){
    const newMessage = new Chat({venderId,status,text,send_status,userId:userId,driverId});
    await newMessage.save();
    res.status(200).json({"result":"true","message":'Message sent successfully' });
  }else{
    const Message = new Chat({venderId,status,send_status,userId:userId,driverId,text:req.file.filename});
    await Message.save();
    res.status(200).json({"result":"true","message":'Message sent successfully' });
  }
  } catch (error) {
    console.error(error);
    res.status(400).json({"message":error.mesage});
  }

};




const customerChatList = async (req, res) => {
  const { vendorId } = req.body;
  if (!vendorId) {
    return res.status(400).json({ "result": "false", "message": "required parameters are vendorId" });
  }
  try {
    // Fetch messages sent by the user where send_status is 0 or 1
    const messages = await Chat.find({ 
  venderId:vendorId,userId:{$ne:null},
  $or: [
    { send_status: 0 },
    { send_status: 1 }
  ]
  
}).populate('userId').lean().sort({_id:-1});

const firstData=await messages.map(item=>({
        userId:item.userId._id,
        fname: item.userId.first_name, 
        lname: item.userId.last_name, 
        mobile_number: item.userId.mobile_number,
        image: item.userId.user_profile, 
        text: item.text,
        status: item.status,
        send_status: item.send_status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
}));


       //msgcount
   const msgCount = {};
   firstData.forEach(item => {
    if (item.userId && item.status=="0" && item.send_status=="1") {
    const userId = item.userId.toString();
    msgCount[userId] = (msgCount[userId] || 0) + 1;
  }

});

// Merge firstData with msgCount
const mergedFirstData = firstData.map(item => ({
...item,
msgCount: msgCount[item.userId] || 0 // Add message count to each item
}));


// Create an object to store unique friendIds
const uniqueID = {};

// Filter the mergedMessages array
const filteredMessages = mergedFirstData.filter(item => {
if (!uniqueID[item.userId]) {
    uniqueID[item.userId] = true;
    return true;
}

// If the friendId already exists, return false to exclude the item
return false;
});


    if (filteredMessages.length > 0) {
        res.status(200).json({ "result": "true",
         "message": 'Vendor chat list retrieved successfully', 
         filteredMessages 
        });

    } else {
        res.status(404).json({ "result": "false", "message": 'Data not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ "message": error.message });
}
};




const driverChatList = async (req, res) => {
  const { vendorId } = req.body;
  if (!vendorId) {
    return res.status(400).json({ "result": "false", "message": "required parameters are vendorId" });
  }
  try {
    // Fetch messages sent by the user where send_status is 0 or 1
    const messages = await Chat.find({ 
  venderId:vendorId,driverId:{$ne:null},
  $or: [
    {  send_status:1 },
    {  send_status:4 }
  ]
  
}).populate('driverId').lean().sort({_id:-1});

const firstData=await messages.map(item=>({
        driverId:item.driverId._id,
        fname: item.driverId.fname, 
        lname: item.driverId.lname, 
        mobile_number: item.driverId.phone,
        image: item.driverId.frontId_iamge, 
        text: item.text,
        status: item.status,
        send_status: item.send_status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
}));


       //msgcount
   const msgCount = {};
   firstData.forEach(item => {
    if (item.driverId && item.status=="0" && item.send_status=="1") {
    const driverId = item.driverId.toString();
    msgCount[driverId] = (msgCount[driverId] || 0) + 1;
  }

});

// Merge firstData with msgCount
const mergedFirstData = firstData.map(item => ({
...item,
msgCount: msgCount[item.driverId] || 0 // Add message count to each item
}));


// Create an object to store unique friendIds
const uniqueID = {};

// Filter the mergedMessages array
const filteredMessages = mergedFirstData.filter(item => {
if (!uniqueID[item.driverId]) {
    uniqueID[item.driverId] = true;
    return true;
}

// If the friendId already exists, return false to exclude the item
return false;
});



    if (filteredMessages.length > 0) {
        res.status(200).json({ "result": "true",
         "message": 'Driver chat list retrieved successfully', 
         filteredMessages 
        });

    } else {
        res.status(404).json({ "result": "false", "message": 'Data not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ "message": error.message });
}
};




const venderGet_message=async(req,res)=>{
  const {venderId,driverId,userId} = req.body;
  if(!venderId ){
    return res.status(400).json({"result":"false","message":"required parameter are venderId and optional are userId, driverId"})
  };

  try {
    if(userId && venderId){
    const messages = await Chat.find({venderId,userId}).populate('userId');
    if(messages.length>0){
      await Chat.updateMany({venderId,userId,send_status:1,status:0},{status:1},{new:true});
      res.status(200).json({"result":"true","message":'Customer messages list get sucessfully',data:messages });
    }else{
      res.status(400).json({"result":"false","message":'Data does not found'});
    }
  }else{
    const messages = await Chat.find({venderId,driverId}).populate('driverId');
    if(messages.length>0){
      await Chat.updateMany({venderId,driverId,send_status:1,status:0},{status:1},{new:true});
      res.status(200).json({"result":"true","message":'Driver messages list get sucessfully',data:messages });
    }else{
      res.status(400).json({"result":"false","message":'Data does not found'});
    }

  }
    
  } catch (error) {
    console.error(error);
    res.status(400).json({"message": error.mesage});
  }

};





const quantityList=async(req,res)=>{
  try {
    const {categoryId} = req.body;

    if (!categoryId) {
      res.status(400).json({
        "result": "false",
        "message": "Required parameters are categoryId"
      });
    } else {
      
      const matchData = await Quantity.findOne({catetoryId:categoryId });
      if (!matchData) {
       
        res.status(400).json({
          "result": "false",
          "message": "Record not found",
          
        });
      } else {
        res.status(200).json({
          "result": "true",
          "message": "Quantity list get successfully",
          "data": matchData
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "result": "false",
      "message":error.mesage
    });
  }

};

const sleeveList=async(req,res)=>{
  try {
    const {categoryId} = req.body;

    if (!categoryId) {
      res.status(400).json({
        "result": "false",
        "message": "Required parameters are categoryId"
      });
    } else {
      
      const matchData = await Sleeve.findOne({catetoryId:categoryId });
      if (!matchData) {
       
        res.status(400).json({
          "result": "false",
          "message": "Record not found",
          
        });
      } else {
        res.status(200).json({
          "result": "true",
          "message": "Sleeve list get successfully",
          "data": matchData
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "result": "false",
      "message":error.mesage
    });
  }

};


// productType list
const productType_list=async(req,res)=>{
  try{
    const data =await ProductType.find({});
    if(!data.length>0){
      res.status(400).json({"result":"false","message":"record does not found",data:data})
      
    }else{
      res.status(200).json({"result":"true","message":"product type list are",data:data})
    }
    
  }catch(err){
    console.log(err.mesage)
    res.status(400).json({"message":err.message})
  }

};



//brand_list
const brand_list=async(req,res)=>{
  try{
    const {categoryId}=req.body;
    if(!categoryId){
      return res.status(400).json({"result":"false","message":"required parameter are categoryId"});

    }
    const data=await Brand.find({categoryId});
    if(!data){
      res.status(400).json({"result":"fale","message":"Brand list does not found",data:data})
    }else{
    res.status(200).json({"result":"true","message":"brand_listare",data:data})
}
  }catch(err){
    console.log(err.mesage)
    res.status(400).json({"result":"false","message":err.message});
  }

};


/*..............................Create end api...................... */




// Update vendor data
const updateseller = async (req, res) => {
  try {
    const {
      venderId,
      firstName,
      lastName,
    } = req.body;

    const { upload_frontId, upload_backsideId } = req.files || {};

    if (!venderId) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter is venderId, and optional parameters are firstName, lastName, upload_frontId, upload_backsideId"
      });
    }

    const matchData = await Vender.findOne({ _id: venderId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Vendor does not exist"
      });
    }

    if (upload_frontId && upload_backsideId) {
      const updateData = {
        venderId,
        firstName,
        lastName,
        upload_frontId: upload_frontId[0].filename,
        upload_backsideId: upload_backsideId[0].filename,
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true", "message": "Data updated successfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    } else if (upload_backsideId) {

      const updateData = {
        venderId,
        firstName,
        lastName,
        upload_backsideId: upload_backsideId[0].filename,
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true", "message": "Data updated successfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }else if (upload_frontId) {

      const updateData = {
        venderId,
        firstName,
        lastName,
        upload_frontId: upload_frontId[0].filename,
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true", "message": "Data updated successfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }

    }
     else {
      const updateData = {
        venderId,
        firstName,
        lastName,
      };

      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        return res.status(200).json({ "result": "true", "message": "Data updated successfully" });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ "result": "false", "message": error.message });
  }
};







// update mobile
const updateMobile = async (req, res) => {
  try {
    const {
      venderId,
      mobile_number
    } = req.body;

    if (!venderId || ! mobile_number) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter are venderId,mobile_number"
      });
    }

    const matchData = await Vender.findOne({ _id: venderId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Vendor does not exist"
      });
    } 

    const matchDatas = await Vender.findOne({ _id: venderId,mobile_number:mobile_number });
    if (matchDatas) {
      return res.status(400).json({
        "result": "false",
        "message": "Mobile Number allready exist"
      });
    } 
    
   const Otp=generate_otp();
      const updateData = {
        venderId,
        otp:Otp
      };
      
      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        const data = {
          venderId: updatedVendor._id,
          otp: updatedVendor.otp,
          mobile_number:updatedVendor.mobile_number,
          newMobile_number:mobile_number
        };

        return res.status(200).json({ "result": "true","message":"Otp generate sucessfully",data:data });
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update data"
        });
      }
    
  } catch (error) {
    return res.status(500).json({ "result": "false", "message": error.message });
  }
};





// update email
const updateEmail= async (req, res) => {
  try {
    const {
      venderId,
      email,
    } = req.body;

    if (!venderId) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter is venderId,email"
      });
    }

    const matchData = await Vender.findOne({ _id: venderId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Vendor does not exist"
      });
    } 
    
    const matchDatas = await Vender.findOne({ _id: venderId ,email:email});
    if (matchDatas) {
      return res.status(400).json({
        "result": "false",
        "message": "Email already exist"
      });
    } 
    
   
      const updateData = {
        venderId,
      };
      
      const updatedVendor = await Vender.findByIdAndUpdate(
        { _id: venderId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        const data = {
          venderId: updatedVendor._id,
          oldEmail:updatedVendor.email,
          newEmail:email
        };

        return res.status(200).json({ "result": "true","message":"Please check your email",data:data});
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update vendor data"
        });
      }
    
  } catch (error) {
    return res.status(500).json({ "result": "false", "message": error.message });
  }
};




const deleteVendor = async (req, res) => {
  try {
    const { venderId, reason, text } = req.body;

    // Check if required parameters are present
    if (!venderId || !reason || !text) {
      return res.status(400).json({
        result: "false",
        message: "Required parameters are venderId, reason, text"
      });
    }

    // Update vendor status to 2 (assuming 2 represents deleted status)
    const updatedData = await Vender.findByIdAndUpdate(
      { _id: venderId },
      { vender_status: 2 },
      { new: true }
    );

    // Create a new entry in VendorDelete collection
    const insertData = new Vendordelete({ venderId, reason, text });
    await insertData.save();

    // Check if vendor exists for deletion
    if (!updatedData) {
      res.status(400).json({
        result: "false",
        message: "Vendor does not exist"
      });
    } else {
      res.status(200).json({
        result: "true",
        message: "Vendor deleted successfully"
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }
};




// maincategory list
const maincategory_list = async (req, res) => {
  try {
    const datalist = await Maincategory.find({acrtive_status:0});
    if (!datalist) {
      res.status(400).json({
        result: "false",
        message: "Data does not found"
      });
    } else {
      res.status(200).json({
        result: "true",
        message: "get maincategory list successfully",
        data:datalist
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }
};




//verify phone
const verifyPhone=async(req,res)=>{
  try {
    const {venderId,newMobile_number,otp}=req.body;
    if(!venderId || !otp || ! newMobile_number){
      return res.status(200).json({"result":"false","message":"required parameters are venderId,newMobile_number,otp"})
    }
    const matchData = await Vender.findOne({_id:venderId,otp:otp});
    if (!matchData) {
      res.status(400).json({
        result: "false",
        message: "Invalid otp"
      });
    } else {
     const data= await Vender.findByIdAndUpdate({_id:venderId},{mobile_number:newMobile_number},{new:true})
      res.status(200).json({
        result: "true",
        message: "Phone number verified successfully",
        data:data
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};



// shop details api
const shopDetails=async(req,res)=>{
  try {
    const {venderId}=req.body;
    if(!venderId){
      return res.status(200).json({"result":"false","message":"required parameters are venderId"})
    }

    const matchData = await Vender.findOne({_id:venderId});
    if (!matchData) {
     return res.status(400).json({
        result: "false",
        message: "Seller does not exist"
      });
    } 

     const datas= await Vender.findOne({_id:venderId});
     const products=await Product.find({venderId:venderId}).countDocuments();
     const data= { ...datas.toObject(), products };
     
     
     const filterData={
      sellerId:data._id,
      shopName:data.shop_name,
      sellerImage:data.vender_profile,
      sellerMobile:data.mobile_number,
      shopAddress:data.shop_address,
      shopImage:data.upload_frontId,
      totalProduct:data.products || 0,
      totalSales:data.sales || 0,
      totalReviews:data.views || 0,
      totalLiked_items:data.likes || 0,
      pageViews:data.pageviews || 0,
      shop_rating:data.shop_rating || 0,


     };
      res.status(200).json({
        result: "true",
        message: "Shop details get successfully",
        data:filterData
      });
   
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }


};




/*....................term and condiction list.............*/
const term_and_condiction_list = async (req, res) => {
	try {
		const matchData = await Term.find({type:2});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "term and condiction list are",
				"path": "http://103.104.74.215:3037/uploads/",
				data: matchData
			})
		} else {
			res.status(400).json({ "result": "false", "message": " data  does not found", })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};





/*....................pulicy_list .............*/
const pulicy_list = async (req, res) => {
	try {
		const matchData = await Privacy.find({type:2});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "pulicy_list are",
				"path": "http://103.104.74.215:3037/uploads/",
				data: matchData
			})
		} else {
			res.status(400).json({ "result": "false", "message": " data  does not found", })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




/*..............................add InnTOutProduct start api...................... */
const addInntOutProduct=async(req,res)=>{
  try {
    const {
        venderId,
        categoryId,
        productType,
        product_name,
        description,
        productSize,
        product_code,
        brand_name,
        productPreparation_time,
        product_details,
        product_variation,
        note,
        frnz_product_details,
        frnz_description,
        frnz_product_name,
        unit_price,
        discount,
        Tax,
         minimum_order,
        deliveryType,
        product_weight,
    } = req.body;
    const{
         image1,
         image2,
         image3,
         image4,
         image5,
         video,
        }=req.files || {};


        if(!venderId ||
          !categoryId ||
          !product_name ||
          !unit_price 
          ) {

           return res.status(400).json({
              "result":"false","message":"required parameters are  venderId,categoryId,productType,"+
               "product_name,description,product_weight,productSize,product_code,productPreparation_time,"+
               "product_details,note,product_variation, unit_price, discount,Tax,minimum_order,deliveryType,"+
               "image1,image2,image3,image4,image5,video,frnz_product_details,frnz_description,frnz_product_name"
            });
          };


    //  Exist product 
    const matchData=await Product.findOne({venderId:venderId,product_name:product_name});
    if(matchData){
      return res.status(400).json({
        "result":"false","message":"Product name allready exist "
      });
    };

     
    if(product_variation){
      // Process product variations
      var variants = [];
     if (product_variation && typeof product_variation === 'string') {
       try {
         const parsedVariations = JSON.parse(product_variation);
         if (Array.isArray(parsedVariations)) {
           variants = parsedVariations.map(variation => {
             const { attribute_name, attribute_values } = variation;
             return {
               attribute_name,
               attribute_values: attribute_values.split(',').map(value => value.trim()),
             };
           });
         }
       } catch (e) {
         return res.status(400).json({
           "result": "false",
           "message": "Invalid JSON format for product_variation",
         });
       }
     }
   }


   
       
   const  discounts=JSON.parse(discount);
   const  Taxs=JSON.parse(Tax);
   if(discounts[0].discount_type === "Unit"){
    sale_prices=Number(unit_price - discounts[0].discount_value);
   }else{
    real_discount = ((unit_price * discounts[0].discount_value) / 100).toFixed(2)
    sale_prices=Number( unit_price - real_discount).toFixed(2);
   }
  
    
    const newProduct = new Product({
        venderId,
        categoryId,   
        product_name,
        description,
        productType,
        productSize,
        image1: image1 ? image1[0].filename:undefined,
        image2: image2 ? image2[0].filename:undefined,
        image3: image3 ? image3[0].filename:undefined,
        image4: image4 ? image4[0].filename:undefined,
        image5: image5 ? image5[0].filename:undefined,
        video: video ? video[0].filename:undefined,
        productPreparation_time,
        product_details,
        product_code,
        brand_name,
        note,
        frnz_product_details,
        frnz_description,
        frnz_product_name,
        minimum_order,
        deliveryType,
        unit_price,
        sale_price:sale_prices,
        discount:discounts,
        product_weight,
        product_variation:variants,
        Tax:Taxs,
       
        
    });

    const savedProduct = await newProduct.save();
    res.status(200).json({"result":"true","message":"Product insert sucessfully",data:savedProduct});

} catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({"result":"false","message":error.message});
}
};



//order list api
const orderList=async(req,res)=>{
  try {
    const {shopId}=req.body;
    if(!shopId){
      return res.status(400).json({"result":"false","message":"required parameter is shopId"})
    }

		const matchData = await Order.find({shopId:shopId}).populate('checkoutId').sort({_id : -1});
		if (!matchData) {
      res.status(400).json({ "result": "false", "message": " data  does not found", })
			
		} else {
      const data =await matchData.map(item=>({
        _id:item._id,
        userId:item.userId,
        paymentMode:item.checkoutId.paymentMode,
        orderId:item.orderId,
        status:item.status,
        order_date:item.createdAt,
        update_date:item.updatedAt,
        products:item.products.map(product => ({
          productId: product.productId,
          product_name: product.product_name,
          shop_name: product.shop_name,
          size: product.size,
          color: product.color,
          qty: product.qty,
          sale_price:product.subtotal,
          unit_price:product.productId.unit_price,
          discount:product.discount,
          image:product.image,
          qrcode:product.qrcode,
          subtotal:product.subtotal,
          discount:product.discount,
          tax:product.tax,
          shipping_charge:product.shipping_charge,
          total:product.total,
          order_status:product.order_status,
          
          
  
        })),


      }));
      console.log(data)
			res.status(200).json({
				"result": "true",
				"message": "Oderlist get sucessfully",
				"path": "http://103.104.74.215:3037/uploads/",
				data: data
			})
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};



const updateOrder_status = async (req, res) => {
  try {
      const { orderId, status, productId, payment_status } = req.body;
      if (!orderId || !status || !productId || !payment_status) {
          return res.status(400).json({ "result": "false", "message": "required parameters are orderId, status, productId, and payment_status (Note: cancel for 1, confirm 2, packing 3, shipped 4, not delivered 5, delivered 6, return 7)" });
      }

      const updateOrder = await Order.findOneAndUpdate(
          { 
              _id: orderId,
              "products.productId": productId
          },
          { 
              $set: {
                  "products.$.order_status": status,
                  "products.$.payment_status": payment_status
              }
          },
          { new: true }
      );

      if (updateOrder) {
          res.status(200).json({ "result": "true", "message": "Order updated successfully" });
      } else {
          res.status(400).json({ "result": "false", "message": "Record not found" });
      }
  } catch (err) {
      console.log(err.message);
      res.status(400).json({ "result": "false", "message": err.message });
  }
};




const filterOrder_list = async (req, res) => {
  try {
      const { shopId, status } = req.body;
      if (!shopId || !status) {
          return res.status(400).json({ "result": "false", "message": "required parameters are shopId and status (Note: cancel for 1, confirm 2, packing 3, shipped 4, not delivered 5, delivered 6, return 7)" });
      }

      const matchData = await Order.find({ shopId: shopId, "products.order_status": status }).populate('checkoutId').sort({ _id: -1 });

      if (!matchData || matchData.length === 0) {
          return res.status(400).json({ "result": "false", "message": "data not found" });
      }

      const responseData = matchData.map(order => ({
          _id: order._id,
          userId: order.userId,
          orderId: order.orderId,
          status: order.status,
          order_date: order.createdAt,
          update_date: order.updatedAt,
          products: order.products.filter(product => product.order_status == status)
      }));

      res.status(200).json({
          "result": "true",
          "message": "Order list retrieved successfully",
          "path": "http://103.104.74.215:3037/uploads/",
          data: responseData
      });
  } catch (err) {
      res.status(400).json({ "result": "false", "message": err.message });
  }
};



 

const orderDetails = async (req, res) => {
  try {
      const { order_id, productId } = req.body;
      if (!order_id || !productId) {
          return res.status(400).json({ "result": "false", "message": "required parameters are order_id and productId" });
      }

      const matchData = await Order.findOne({ 
          _id: order_id,
          products: { 
              $elemMatch: { 
                  productId: productId
              }
          }
      }).populate('userId checkoutId');

       const checkdata = await Checkout.findOne({ _id: matchData.checkoutId }).populate('addressId');
       const address = {
        placeType: checkdata.addressId?.place_type || 0,
        state:checkdata.addressId?.state || 0,
        city_name:checkdata.addressId?.city_name || 0,
        pin_code:checkdata.addressId?.pin_code || 0,
        building_no:checkdata.addressId?.building_no || 0,
        landmark:checkdata.addressId?.landmark || 0,
        village_name:checkdata.addressId?.village_name || 0,
        lat:checkdata.addressId?.location.coordinates[1] || 0,
        lon:checkdata.addressId?.location.coordinates[0] || 0,
    };
    
      

      if (!matchData) {
          return res.status(400).json({ "result": "false", "message": "data not found" });
      }

      // Find the product based on the specified productId
      const filteredProduct = matchData.products.find(product => product.productId.toString() === productId);

      if (!filteredProduct) {
          return res.status(400).json({ "result": "false", "message": "product not found in order" });
      }

      const responseData = {
          _id: matchData._id,
          userId: matchData.userId._id,
          first_name: matchData.userId.first_name,
          last_name: matchData.userId.last_name,
          mobile_number: matchData.userId.mobile_number,
          email: matchData.userId.email,
          orderVerification_code: matchData.orderVerification_code, 
          checkoutId: matchData.checkoutId._id,
          paymentMode: matchData.checkoutId.paymentMode,
          note:matchData.checkoutId.note,
          delivery_place: matchData.checkoutId.delivery_place,
          shopId: matchData.shopId,
          orderId: matchData.orderId, 
          productId: filteredProduct.productId,
          product_name: filteredProduct.product_name,
          shop_name: filteredProduct.shop_name,
          attributes: filteredProduct.attributes,
         // color: filteredProduct.color,
          qty: filteredProduct.qty,
          sale_price:filteredProduct.subtotal,
          unit_price:filteredProduct.productId.unit_price,
          discount:filteredProduct.discount,
          image:filteredProduct.image,
          qrcode:filteredProduct.qrcode,
          subtotal:filteredProduct.subtotal,
          discount:filteredProduct.discount,
          tax:filteredProduct.tax,
          shipping_charge:filteredProduct.shipping_charge,
          total:filteredProduct.total,
          status: filteredProduct.status,
          payment_status:filteredProduct.payment_status ,
          order_status:filteredProduct.order_status ,
          createdAt: matchData.createdAt,
          updatedAt: matchData.updatedAt,
          ...address 
      };

      res.status(200).json({
          "result": "true",
          "message": "Order details retrieved successfully for productId: " + productId,
          "path": "http://103.104.74.215:3037/uploads/",
          data: responseData
      });

  } catch (err) {
      res.status(400).json({ "result": "false", "message": err.message });
  }
};





const shopOrder_count=async(req,res)=>{
  try {
    const { shopId,status} = req.body;
    if (!shopId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are shopId,status(all 1,today 2,week 3,month 4,year 5) " });
    }

    const today = new Date();
    let matchData;
    if(status==="1"){
     matchData = await Order.find({ shopId: shopId});
  }
  else if(status==="2")
  {
   
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999); 

matchData = await Order.find({ shopId: shopId, updatedAt: { $gte: startOfDay, $lte: endOfDay } });


  }else if(status==="3"){const oneWeekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)); 
   matchData = await Order.find({ shopId: shopId, updatedAt: { $gte: oneWeekAgo, $lte: today } });
  }else if(status==="4"){
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    matchData = await Order.find({ shopId: shopId, updatedAt: { $gte: oneMonthAgo, $lte: today } });

  }else{
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    matchData = await Order.find({ shopId: shopId, updatedAt: { $gte: oneYearAgo, $lte: today } });
  }


    if (!matchData || matchData.length === 0) {
        return res.status(400).json({ "result": "false", "message": "data not found" });
    }

    
    const responseData = {
      pending: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 0).length, 0),
      confirm: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 2).length, 0),
      packing: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 3).length, 0),
      shipped: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 4).length, 0),
      cancel: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 1).length, 0),
      not_delivered: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 5).length, 0),
      delivered: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0),
      return: matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 7).length, 0),
  };



    res.status(200).json({
        "result": "true",
        "message": "Order list retrieved successfully",
        "path": "http://103.104.74.215:3037/uploads/",
        data: responseData
    });
} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}
};




const shopHigh_light=async(req,res)=>{
  try {
    const { shopId} = req.body;
    if (!shopId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are shopId" });
    }
    
    const products= await Product.find({venderId: shopId }).countDocuments();
    const pro = await Product.find({ venderId: shopId });
  const productid = pro.map(item => ({
  productID: item._id
}));

let likeData = 0;
for (const product of productid) {
  const count = await Like.find({ productId: product.productID, like_status: 1 }).countDocuments();
  likeData += count;
}

    const raters=await shopRating.find({shopId}).countDocuments();
	  const rater=await shopRating.find({shopId});
    const views=await Viewshops.find({shopId}).countDocuments();
    const matchData = await Order.find({ shopId: shopId});
    
//count average rating
      const totalRating = (rater && rater.length > 0)
  ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

  const average_ratings = raters > 0 ? Number(totalRating / raters) : 0;

//count sales
const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
const data={
  products_count:products,
  like_count:likeData,
  raters_count:raters,
  average_ratings:average_ratings!== null ? average_ratings : 0,
  view_count:views,
  sales_count:sales
}
     

    res.status(200).json({
        "result": "true",
        "message": "Shop data retrieved successfully",
        "path": "http://103.104.74.215:3037/uploads/",
        data: data
    });
} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}

};





//top sale product
const topSale_productList=async(req,res)=>{
  try {
    const { shopId} = req.body;
    if (!shopId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are shopId" });
    }
    
    const matchData = await Order.find({ shopId: shopId});
   
const productIds = [];
matchData.forEach(order => {
  order.products.forEach(product => {
    productIds.push(product.productId);
  });
});

const productCounts = {};

matchData.forEach(order => {
  order.products.forEach(product => {
    const productId = product.productId;
    productCounts[productId] = (productCounts[productId] || 0) + 1;
  });
});


//find product list 
const productList = await Product.find({ _id: { $in: productIds } }).limit(20);
  // Merge productCounts with productList
  const mergedProductList = productList.map(product => ({
    ...product.toObject(),
    count: productCounts[product._id] || 0 
  }));

  const data = mergedProductList.map(item=>({
    productId:item._id,
    venderId:item.venderId,
    product_name:item.product_name,
    image:item.image1,
    sold:item.count,

  }))
    res.status(200).json({
        "result": "true",
        "message": "Shop data retrieved successfully",
        "path": "http://103.104.74.215:3037/uploads/",
       data:data
    });
} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}


};



const returnPolicyList = async (req, res) => {
	try {
		const data = await Return_policy.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "Return list are", data: data });
		}

	} catch (err) {
		console.log(err.message)
	}


};




// faq create api
const refundPolicyList = async (req, res) => {
	try {
		const data = await Refund_policy.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "Refund_policy list are", data: data });
		}
	} catch (err) {
		console.log(err.message)
	}


};



// faq create api
const cancellationPolicyList = async (req, res) => {
	try {
		const data = await Cancellation_policy.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "Cancellation policy list are", data: data });
		}
		

	} catch (err) {
		console.log(err.message)
	}


};



// faq create api
const aboutUsList = async (req, res) => {
	try {
		const data = await About.find({type:2});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "About us list are", data: data });
		}
		

	} catch (err) {
		console.log(err.message)
	}


};



// withdraw  request
const withdrawRequest=async(req,res)=>{
  try {
    const {venderId,amount} = req.body;
    if (!venderId || !amount) {
        return res.status(400).json({ "result": "false", "message": "required parameters are venderId,amount" });
    }
    
    const existData= await Withdraw.findOne({venderId,status:0});
    if(existData){
      return res.status(400).json({
        "result": "false",
        "message": "You have allready sent withdraw request",
        
    });
    }
    

    const sales = await Order.find({shopId:venderId});
        
        const filteredResponse = sales.map(order => ({
            ...order.toObject(), // Convert Mongoose model to plain JavaScript object
            products: order.products.filter(product => product.order_status === 6)
        })).filter(order => order.products.length > 0);

        // Sum all total values
        const totalSum = filteredResponse.reduce((sum, item) => {
            return sum + item.products.reduce((productSum, product) => {
                return productSum + product.total;
            }, 0);
        }, 0);

       
       
        const existDatas = await Withdraw.find({shopId:venderId,status: 1 }); 
        let withdraw = 0;
        if (existDatas && existDatas.length > 0) {
            withdraw = existDatas.reduce((total, withdraw) => total + withdraw.amount, 0);
        }
		
           const Wable=Number(totalSum -withdraw ).toFixed(2);

if(Wable>=amount){
        const insertData=new Withdraw({venderId,amount,status_type:1});
        const data=await insertData.save();
        res.status(200).json({
          "result": "true",
          "message": "Yor request sent successfully",
          data: data
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "You have not sufficient blance"
       
    });
    }
  

} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}

};




const graphData=async (req,res)=>{
  try {
    const {vendorId,status } = req.body;
    if (!vendorId || !status) {
        return res.status(400).json({ "result": "false", "message": "Required field is vendorId,status (1 for weekly, 2 for monthly, and 3 for last 30 days)" })
    }

    const sales = await Order.find({shopId:vendorId});
    
    const filteredResponse = sales.map(order => ({
        ...order.toObject(), // Convert Mongoose model to plain JavaScript object
        products: order.products.filter(product => product.order_status === 6)
    })).filter(order => order.products.length > 0);

    if (status === "1") {
        // Filter orders for the last 7 days
        const lastWeekSales = filteredResponse.filter(order => {
            const orderDate = new Date(order.updatedAt); // Assuming createdAt field in Order model
            const today = new Date();
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate date for 7 days ago
            return orderDate >= lastWeek && orderDate <= today;
        });

        // Initialize an object to store daily sales and commission data
        const weeklyData = {
            Sunday: { totalSales: 0, commission: 0 },
            Monday: { totalSales: 0, commission: 0 },
            Tuesday: { totalSales: 0, commission: 0 },
            Wednesday: { totalSales: 0, commission: 0 },
            Thursday: { totalSales: 0, commission: 0 },
            Friday: { totalSales: 0, commission: 0 },
            Saturday: { totalSales: 0, commission: 0 }
        };

        // Iterate over the filtered orders and accumulate sales and commission values for each day
        lastWeekSales.forEach(order => {
            const orderDate = new Date(order.updatedAt); // Assuming updatedAt field in Order model
            const dayOfWeek = orderDate.toLocaleDateString('en-US', { weekday: 'long' });
            const totalSum = order.products.reduce((sum, product) => sum + product.total, 0);
            const totalCommission = order.products.reduce((sum, product) => sum + product.commission, 0);
            weeklyData[dayOfWeek].totalSales += totalSum;
            weeklyData[dayOfWeek].commission += totalCommission;
        });

        res.status(200).json({ "result": "true", "message": "Get weekly data", data: weeklyData });
    } else if (status === "2") {
        // Filter orders for the last 12 months
        const lastYearSales = filteredResponse.filter(order => {
            const orderDate = new Date(order.updatedAt); // Assuming createdAt field in Order model
            const today = new Date();
            const lastYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000); // Calculate date for 365 days ago
            return orderDate >= lastYear && orderDate <= today;
        });

        // Initialize an object to store monthly sales and commission data
        const monthlyData = {
            January: { totalSales: 0, commission: 0 },
            February: { totalSales: 0, commission: 0 },
            March: { totalSales: 0, commission: 0 },
            April: { totalSales: 0, commission: 0 },
            May: { totalSales: 0, commission: 0 },
            June: { totalSales: 0, commission: 0 },
            July: { totalSales: 0, commission: 0 },
            August: { totalSales: 0, commission: 0 },
            September: { totalSales: 0, commission: 0 },
            October: { totalSales: 0, commission: 0 },
            November: { totalSales: 0, commission: 0 },
            December: { totalSales: 0, commission: 0 }
        };

        // Iterate over the filtered orders and accumulate sales and commission values for each month
        lastYearSales.forEach(order => {
            const orderDate = new Date(order.updatedAt); // Assuming updatedAt field in Order model
            const monthName = orderDate.toLocaleDateString('en-US', { month: 'long' });
            const totalSum = order.products.reduce((sum, product) => sum + product.total, 0);
            const totalCommission = order.products.reduce((sum, product) => sum + product.commission, 0);
            monthlyData[monthName].totalSales += totalSum;
            monthlyData[monthName].commission += totalCommission;
        });

        res.status(200).json({ "result": "true", "message": "Get monthly data", data: monthlyData });
    } else if (status === "3") {
        // Initialize an object to store daily sales and commission data for the last 30 days
        const last30DaysData = {};

        // Iterate over the last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
            last30DaysData[dateString] = { totalSales: 0, commission: 0 };
        }

        // Iterate over the filtered orders and accumulate sales and commission values for each day
        filteredResponse.forEach(order => {
            const orderDate = new Date(order.updatedAt); // Assuming updatedAt field in Order model
            const orderDateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
            const totalSum = order.products.reduce((sum, product) => sum + product.total, 0);
            const totalCommission = order.products.reduce((sum, product) => sum + product.commission, 0);
            if (last30DaysData[orderDateString]) {
                last30DaysData[orderDateString].totalSales += totalSum;
                last30DaysData[orderDateString].commission += totalCommission;
            }
        });

        res.status(200).json({ "result": "true", "message": "Get data for last 30 days", data: last30DaysData });
    } else {
        res.status(400).json({ "result": "false", "message": "Invalid status value" });
    }

} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}

};



const withdrawable_blance=async(req,res)=>{
  try {
    const {vendorId}=req.body;
    if (!vendorId ) {
      return res.status(400).json({ "result": "false", "message": "Required field is vendorId" })
  }
		
		const sales = await Order.find({shopId:vendorId});
        
        const filteredResponse = sales.map(order => ({
            ...order.toObject(), // Convert Mongoose model to plain JavaScript object
            products: order.products.filter(product => product.order_status === 6)
        })).filter(order => order.products.length > 0);

        // Sum all total values
        const totalSum = filteredResponse.reduce((sum, item) => {
            return sum + item.products.reduce((productSum, product) => {
                return productSum + product.total;
            }, 0);
        }, 0);

       
       
        const existData = await Withdraw.find({shopId:vendorId,status: 1 }); 
        let withdraw = 0;
        if (existData && existData.length > 0) {
            withdraw = existData.reduce((total, withdraw) => total + withdraw.amount, 0);
        }
		
           const Wable=Number(totalSum -withdraw ).toFixed(2);

           const withdrawn = await Withdraw.find({venderId:vendorId,withdraw_status:1}); 
           let withdraw1 = 0;
           if (withdrawn && withdrawn.length > 0) {
               withdraw1 = withdrawn.reduce((total, withdraw) => total + withdraw.amount, 0);
           }

           const pending_withdraw = await Withdraw.find({venderId:vendorId,withdraw_status:0}); 
           let withdraw2 = 0;
           if (pending_withdraw && pending_withdraw.length > 0) {
               withdraw2 = pending_withdraw.reduce((total, withdraw) => total + withdraw.amount, 0);
           }

          
		const data={
			withdrawable_amount:Wable,
      withdrawan_amount:withdraw1,
      pending_balance:withdraw2,
			
		}

        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:data });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};





const vendorWithdraw_requestList=async(req,res)=>{
  try {
    const {vendorId} = req.body;
    if (!vendorId ) {
        return res.status(400).json({ "result": "false", "message": "required parameters are vendorId" });
    }
    
    const existData= await Withdraw.find({venderId:vendorId});
    if(existData){
      return res.status(200).json({
        "result": "true",
        "message": "Data got sucessfully",data:existData
        
    });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "Record not found",
        
    });
    }
  
} catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
}

};



const returnOrderList = async (req, res) => {
  try {
      const {venderId,status } = req.body;
      if (!venderId || !status) {
          return res.status(400).json({ "result": "false", "message": "Required parameters: venderId,status (0 pending, 1 approve, 2 refunded, 3 reject)" });
      }

      const data = await Returnorder.find({ shopId:venderId,return_status: status }).populate('orderId userId').sort({_id:-1});
      if (data && data.length > 0) {
    const userInfo=await data.map(item=>({
      returnId:item._id,
      order_id:item.orderId._id,
      orderId:item.orderId.orderId,
              userf:item.userId.first_name,
      userl:item.userId.last_name,
      phone:item.userId.mobile_number,
      return_status:item.return_status,
    }));
    
          let findData = [];
          for (let item of data) {
              const order = await Order.findOne({_id:item.orderId});
              if (order) {
                  const filteredProduct = order.products.find(product => product.productId.toString() === item.productId.toString());
        
        if (filteredProduct) {
                      // Merge userInfo with filteredProduct
                      const mergedData = { ...filteredProduct._doc, userInfo: userInfo.find(info => info.order_id.toString() === order._id.toString()) };
                      findData.push(mergedData);
                  }
              }
          }
          if (findData.length > 0) {
              res.status(200).json({ "result": "true", "message": "Data retrieved successfully", data: findData });
          } else {
              res.status(404).json({ "result": "false", "message": "Matching products not found" });
          }
      } else {
          res.status(404).json({ "result": "false", "message": "Data not found" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ "result": "false", "message": err.message });
  }
};




const returnOrderDetails = async (req, res) => {
  try {
      const {returnId} = req.body;
      if (!returnId) {
          return res.status(400).json({ "result": "false", "message": "Required parameters returnId" });
      }

      const data = await Returnorder.find({ _id: returnId }).populate('orderId userId shopId').sort({_id:-1});
      if (data && data.length > 0) {
    const userInfo=await data.map(item=>({
      returnId:item._id,
      order_id:item.orderId._id,
      orderId:item.orderId.orderId,
              userf:item.userId.first_name,
      userl:item.userId.last_name,
      phone:item.userId.mobile_number,
      return_status:item.return_status,
      reason:item.return_reason,
      shopName:item.shopId.shop_name,
      shop_address:item.shopId.shop_address,
      vendeorfname:item.shopId.firstName,
      vendorlname:item.shopId.lastName,
      sellerEmail:item.shopId.email,
      sellerPhone:item.shopId.mobile_number,

    }));
    console.log(data)
          let findData = [];
          for (let item of data) {
              const order = await Order.findOne({_id:item.orderId});
              if (order) {
                  const filteredProduct = order.products.find(product => product.productId.toString() === item.productId.toString());
        
        if (filteredProduct) {
                      // Merge userInfo with filteredProduct
                      const mergedData = { ...filteredProduct._doc, userInfo: userInfo.find(info => info.order_id.toString() === order._id.toString()) };
                      findData.push(mergedData);
                  }
              }
          }
          if (findData.length > 0) {
              res.status(200).json({ "result": "true", "message": "Data retrieved successfully", data: findData });
          } else {
              res.status(404).json({ "result": "false", "message": "Matching products not found" });
          }
      } else {
          res.status(404).json({ "result": "false", "message": "Data not found" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ "result": "false", "message": err.message });
  }
};







const updateMinimum_orderAmount=async(req,res)=>{
  try {
    const {vendorId,amount}=req.body;
    if (!vendorId ) {
      return res.status(400).json({ "result": "false", "message": "Required field is vendorId,amount" })
  }
		
		await Vender.findByIdAndUpdate({_id:vendorId},{minimum_order:amount},{new:true});
        res.status(200).json({ "result":"true", "message": "Update minium order amount sucessfully data sucessfully"});
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const updatedTemporaryClose_date=async(req,res)=>{
  try {
    const {vendorId,start_date,end_date}=req.body;
    if (!vendorId ) {
      return res.status(400).json({ "result": "false", "message": "Required field is vendorId,start_date,end_date" })
  }
  const updated_data = {
    temporaryClose_data: [{
        start_date: start_date,
        end_date: end_date,
        
    }]
};

		await Vender.findByIdAndUpdate({_id:vendorId},updated_data,{new:true});
        res.status(200).json({ "result": "true", "message": "Data updated  sucessfully data sucessfully" });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const updatedVacationMode_date=async(req,res)=>{
  try {
    const {vendorId,start_date,end_date}=req.body;
    if (!vendorId ) {
      return res.status(400).json({ "result": "false", "message": "Required field is vendorId,start_date,end_date" })
  }
  const updated_data = {
    vacationMode_data: [{
        start_date: start_date,
        end_date: end_date,
        
    }]
};

		await Vender.findByIdAndUpdate({_id:vendorId},updated_data,{new:true});
        res.status(200).json({ "result": "true", "message": "Data updated  sucessfully data sucessfully"});
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const createStaff = async (req, res) => {
  try {
    const {
      shopId,
      fname,
      lname,
      dob,
      password,
      phone,
      email,
      position,
      restrictions,
    } = req.body;

    if (!shopId || !fname || !phone || !email) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are shopId, fname, phone,lanme,dob,position,restrictions,email,staff_image",
      });
    }


    const matchData = await Staff.findOne({phone });
    if (matchData) {
      return res.status(400).json({
        result: false,
        message: "This phone number is  already exists",
      });
    }

    let staff_image;
    if (req.file) {
      staff_image = req.file.filename;
    }

     // Parse and validate restrictions
    let parsedRestrictions;
    try {
      parsedRestrictions = JSON.parse(restrictions);
      if (typeof parsedRestrictions !== 'object' || Array.isArray(parsedRestrictions)) {
        throw new Error("Invalid restrictions format");
      }
    } catch (err) {
      return res.status(400).json({
        result: false,
        message: "Invalid restrictions format",
      });
    }

     
    const insertData = new Staff({
      shopId,
      fname,
      lname,
      dob,
      phone,
      email,
      position,
      password,
      restrictions: parsedRestrictions,
      staff_image: staff_image,
    });

    const data = await insertData.save();
    res.status(200).json({
      result: true,
      message: "Data inserted successfully",
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }
};




const temporaryOnandOff_staff = async (req, res) => {
  try {
    const {
      staffId
    } = req.body;

    if (!staffId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are staffId",
      });
    }

    const matchData = await Staff.findOne({_id:staffId});
    if (matchData.active_status=="0") {
      await Staff.findOneAndUpdate({_id:staffId},{active_status:1},{new:true});
       res.status(200).json({
        result:"true",
        message: "Staff status changed sucessfully",
      });
    }else{
      await Staff.findOneAndUpdate({_id:staffId},{active_status:0},{new:true});
       res.status(200).json({
        result:"true",
        message: "Staff status changed sucessfully",
      });

    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }
};





const staffList = async (req, res) => {
  try {
    const {shopId} = req.body;

    if (!shopId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are shopId",
      });
    }

    const matchData = await Staff.find({shopId,status:0});
    if (!matchData) {
       return res.status(400).json({
        result:"false",
        message: "Staff not found",
      });
    }
       res.status(200).json({
        result:"true",
        message: "Staff list got  sucessfully",data:matchData
      });


  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }
};






const delete_staff= async (req, res) => {
  try {
    const {
      staffId
    } = req.body;

    if (!staffId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are staffId",
      });
    }

    const matchData = await Staff.findOneAndUpdate({_id:staffId},{status:1},{new:true});
       res.status(200).json({
        result:"true",
        message: "Staff deleted sucessfully",
      });
    
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }
};




//Qr code
const createQrcodes=async(req,res)=>{
  try {
    const {
      shopId,
      qrcode_name,
      type,
      productId,
      
    } = req.body;

    if (!shopId || !type) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are shopId, qrcode_name, type, and productId is optional",
      });
    }

    const qr=generateQrcode();

    const insertData = new Qrcode({
      shopId,
      qrcode_name,
      type,
      productId,
      qrcode:qr,
     
    });

    const data = await insertData.save();
    res.status(200).json({
      result: true,
      message: "Qrcode inserted successfully",
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }

};



const qrcodesList=async(req,res)=>{
  try {
    const {shopId} = req.body;

    if (!shopId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are shopId",
      });
    }

    const matchData = await Qrcode.find({shopId});
    if (!matchData) {
       return res.status(400).json({
        result:"false",
        message: "Record not found",
      });
    }
       res.status(200).json({
        result:"true",
        message: "Qrcodes list got  sucessfully",data:matchData
      });


  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }

};


const qrcodesDetails=async(req,res)=>{
  try {
    const {qrcodeId} = req.body;

    if (!qrcodeId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are qrcodeId",
      });
    }

    const matchData = await Qrcode.findOne({_id:qrcodeId});
    if (!matchData) {
       return res.status(400).json({
        result:"false",
        message: "Record not found",
      });
    }
       res.status(200).json({
        result:"true",
        message: "Qrcodes list got  sucessfully",data:matchData
      });


  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }

};



// list Attributes function
const attributes_list = async (req, res) => {
  try {
    const {categoryId} = req.body;
      if (!categoryId) {
          return res.status(400).json({ "result": "false", "message": "required parameter is categoryId" });
      }
     
      const findData = await Attribute.find({categoryId});
      if (!findData) {
          return res.status(404).json({ "result": "false", "message": "Attribute not found" });
      }
      res.status(200).json({ "result": "true", "message": "Attributes list got successfully", data: findData });
  } catch (error) {
      console.error('Error updating attribute', error);
      res.status(400).json({ "result": "false", "message": error.message });
  }
};



// Update Attributes function
const get_attribute = async (req, res) => {
  try {
  const {attributeId} = req.body;
      if (!attributeId) {
          return res.status(400).json({ "result": "false", "message": "required parameter is attributeId" });
      }
      const findData = await Attribute.find({_id:attributeId});
      if (!findData) {
          return res.status(404).json({ "result": "false", "message": "Attribute not found" });
      }
      res.status(200).json({ "result": "true", "message": "Attributes list got successfully", data: findData });
  } catch (error) {
      console.error('Error updating attribute', error);
      res.status(400).json({ "result": "false", "message": error.message });
  }
};



const sendNotification = async (req, res) => {
  try {
    const {driverId,userId,adminId,title,text } = req.body;

    if (!driverId) {
      return res.status(400).json({ "result": "false", "message": "required parameter required parameter are title,text,optionals are image,driverId,userId,adminId," });
    }

    let obj = {driverId,userId,adminId, title, text,image };

    if (req.file) {
      obj.image = req.file.filename;
    }

    const notification = new Notification(obj);
    const data = await notification.save();

    res.status(200).json({ "result": "true", "message": "Notification sent successfully", data: data });
  } catch (error) {
    console.error('Error sending notification', error);
    res.status(400).json({ "result": "false", "message": error.message });
  }
};



const dummy_api=async(req,res)=>{
  const data={
    products:["/product_add","/products_list","/products_delete"],
    order:["/order_list","/order_accept"],
    chats:["/caht_list","/send_messge","/delete_chat"],
  }
  res.status(200).json({"result":"false","message":"get data",data})

};



const updateStaff = async (req, res) => {
  try {
    const {
      staffId,
      fname,
      lname,
      dob,
      password,
      phone,
      email,
      position,
      restrictions,
    } = req.body;

    if (!staffId) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are staffId, fname, phone,lanme,dob,position,restrictions,email,staff_image",
      });
    }


    const matchData = await Staff.findOne({_id:staffId});
    if (!matchData) {
      return res.status(400).json({
        result: false,
        message: "Invalid staffId",
      });
    }

    let staff_image;
    if (req.file) {
      staff_image = req.file.filename;
    }

     // Parse and validate restrictions
    let parsedRestrictions;
    try {
      parsedRestrictions = JSON.parse(restrictions);
      if (typeof parsedRestrictions !== 'object' || Array.isArray(parsedRestrictions)) {
        throw new Error("Invalid restrictions format");
      }
    } catch (err) {
      return res.status(400).json({
        result: false,
        message: "Invalid restrictions format",
      });
    }

     
    const insertData =await Staff.findOneAndUpdate({_id:staffId},{
      fname,
      lname,
      dob,
      phone,
      email,
      position,
      password,
      restrictions: parsedRestrictions,
      staff_image: staff_image,
    },
    {new:true});
      
    res.status(200).json({
      result: true,
      message: "Data updated successfully",
      data: insertData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ result: false, message: err.message });
  }
};





// exports variables
module.exports={
    venderSignup,
    venderLogin,
    venderVerifyOtp,
    resendOtp,
    createSeller_password,
    venderLogin_withEmail,
    forgotPassword,
    update_BankInformation,
    getBank_information,
    Update_venderProfile,
    getVenderProfile,
    venderAccount_delete,
    venderCategory_list,
    venderSubcategory_list,
    venderMain_Category_list,
    sub_subcategory_list,
    changeVendor_password,
    promotinAdd,
    promotinList,
    promotinUpdate,
    promotinDelete,
    changePromotion_status,
    promotinDetails,

   //chat 
    venderSend_message,
    customerChatList,
    venderGet_message,
   
    verifyEmail_andMobile,
	  resetPassword,
   
  // product
  addProduct,
  productList,
  productDetails,
  productUpdate,
  deleteProduct,
  productActive_statusChange,
  // create size
  //sizeList,
  sleeveList,
  quantityList,
  //colorList,
  addOffer,
  offer_on_off,
  deleteOffer,
  offerList,
  updateShop_information,
  //reviews
productReviews_list,
reviewsDetails,
singleReview_detail,
reviewReplay,
reviewReport,
productType_list,
brand_list,
updateseller,
updateMobile,
updateEmail,
deleteVendor,
maincategory_list,
verifyPhone,
shopDetails,
term_and_condiction_list,
pulicy_list,
addInntOutProduct,
orderList,
updateOrder_status,
filterOrder_list,
orderDetails,
shopOrder_count,
shopHigh_light,
topSale_productList,
returnPolicyList,
refundPolicyList,
cancellationPolicyList,
aboutUsList,
withdrawRequest,
driverChatList,
graphData,
withdrawable_blance,
vendorWithdraw_requestList,
returnOrderList,
returnOrderDetails,
updateMinimum_orderAmount,
updatedTemporaryClose_date,
updatedVacationMode_date,
createStaff,
temporaryOnandOff_staff,
staffList,
delete_staff,
createQrcodes,
qrcodesList,
qrcodesDetails,
attributes_list,
get_attribute,
sendNotification,
dummy_api,
updateStaff,



};