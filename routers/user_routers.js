/*...............import dependancies..............*/
const express =require("express");
const router=express();
const multer=require('multer');


//import auth middleware
const auth=require("../middleware/userTokenHandler");


// use multer
const storage=multer.diskStorage({
	destination:"uploads",
	filename:(req,file,cb)=>{
		cb(null,file.originalname);
	},

});


  const upload=multer({
	storage:storage,
	fileFilter:function(req,file,callback){
		if(file.mimetype == "image/png" ||
                 file.mimetype == "image/jpg" ||
                 file.mimetype == "image/jpeg"||
                 file.mimetype == "text/csv"  ||
				 file.mimetype == "application/pdf" ||
				 file.mimetype == "audio/mpeg" || 
				 file.mimetype == "video/mp4" 
			){
			callback(null,true)
		}else{
			console.log('only  png , jpg & jpeg,csv file supported')
                     callback(null,false)
		}
	},
	limits:{
		 filesize:100000000000 //1000000 bytes=1MB
   }


});
  
 

/*............import user_controllers.........*/
const userControllers=require("../controllers/user_controller");




/*..........set user controllers url...........*/
router.post("/userSignup",upload.single('user_profile'),userControllers.userSignup_api);
router.post("/verifyOtp",userControllers.verifyOtp);
router.post("/userLogin",userControllers.userLogin_api);
router.post("/resendOtp",userControllers.resendOtp);
router.post("/forgotPassword",userControllers.forgotPassword);
router.post("/verifyEmail_andMobile",userControllers.verifyEmail_andMobile);
router.post("/resetPassword",userControllers.resetPassword);
router.post("/updateUser_profile",upload.single('user_profile'),userControllers.updateUser_profile);
router.post("/getUser_profile",auth,userControllers.getUser_profile);
router.get("/banner_list",userControllers.banner_list);
router.get("/termAndCondiction",userControllers.term_and_condiction_list);
router.get("/aboutUs_list",userControllers.About_us_list);
router.get("/faq_list",userControllers.faq_list);
router.get("/privacyPulicy_list",userControllers.pulicy_list);
router.get("/contactUs_list",userControllers.contactUs_list);
router.post("/addAddress",userControllers.AddUserAddress);
router.post("/updateAddress",userControllers.Update_address);
router.post("/getAddress",userControllers.Get_address);
router.post("/deleteAddress",userControllers.Delete_address);
router.post("/InntCategory_list",userControllers.InntCategory_list);
router.get("/InntoutCategory_list",userControllers.InntoutCategory_list);
router.post("/subCategory_list",userControllers.subCategory_list);
router.post("/like_dislike_product_api",userControllers.like_dislike_product_api);
router.post("/likeProduct_listApi",userControllers.likeProduct_listApi);
router.post("/givingRating_api",userControllers.givingRating_api);
router.post("/userLogin_withSocicalMedia",upload.single('user_profile'),userControllers.userLogin_withSocicalMedia);
router.post("/sub_subcategoryBase_productList",userControllers.sub_subcategoryBase_productList);
router.post("/productDetails",userControllers.productDetails);
router.post("/subSubcategory_list",userControllers.subSubcategory_list);
router.post("/givingShoprating",userControllers.givingShoprating);
router.post("/deleteLikeProduct_listApi",userControllers.deleteLikeProduct_listApi);
router.post("/Addcart",userControllers.Addcart);
router.post("/cartList",userControllers.cartList);
router.post("/deleteCart",userControllers.deleteCart);
router.post("/categoryBase_productList",userControllers.categoryBase_productList);
router.post("/inntOut_productDetails",userControllers.inntOut_productDetails);
router.post("/AddMultiplecarts",userControllers.AddMultiplecarts);
router.post("/deleteMultipleCart",userControllers.deleteMultipleCart);
router.post("/checkOut",userControllers.checkOut);
router.post("/addOrder",userControllers.addOrder);
router.post("/checkoutList",userControllers.checkoutList);
router.post("/orderList",userControllers.orderList);
router.post("/orderDetails",userControllers.orderDetails);
router.get("/inntFooterbanner_list",userControllers.inntFooterbanner_list);
router.get("/inntOutFooterbanner_list",userControllers.inntOutFooterbanner_list);
router.get("/inntOutHeaderbanner_list",userControllers.inntOutHeaderbanner_list);
router.get("/newArrival_Product_list",userControllers.newArrival_Product_list);
router.get("/dayOftheDeals_ProductList",userControllers.dayOftheDeals_ProductList);
router.post("/likeMultipleProducts",userControllers.likeMultipleProducts);
router.get("/inntAllProduct_list",userControllers.inntAllProduct_list);
router.post("/Updatecarts",userControllers.Updatecarts);
router.post("/addViewproduct",userControllers.addViewproduct);
router.post("/suggested_ProductList",userControllers.suggested_ProductList);
router.post("/changeAddress",userControllers.changeAddress);
router.post("/updateOrder_status",userControllers.updateOrder_status);
router.post("/inntShop_list",userControllers.inntShop_list);
router.post("/inntShop_details",userControllers.inntShop_details);
router.post("/filterShopProduct",userControllers.filterShopProduct);
router.post("/userSend_message",upload.single('text'),userControllers.userSend_message);
router.post("/userGet_message",userControllers.userGet_message);
router.post("/favouriteShop",userControllers.favouriteShop);
router.post("/favouriteShopList",userControllers.favouriteShopList);
router.post("/favouriteShop",userControllers.favouriteShop);
router.post("/favouriteShopList",userControllers.favouriteShopList);
router.get("/trendingNow",userControllers.trendingNow);
router.post("/AddInntoutCart",userControllers.AddInntoutCart);
router.post("/InnoutcartList",userControllers.InnoutcartList);
router.post("/deleteinntoutCart",userControllers.deleteinntoutCart);
router.post("/updatePhone",userControllers.updatePhone);
router.post("/updateEmail",userControllers.updateEmail);
router.post("/advertisementProduct_list",userControllers.advertisementProduct_list);
router.post("/inntCategoryProduct_list",userControllers.inntCategoryProduct_list);
router.post("/filterproducts",userControllers.filterproducts);
router.post("/dayOfthedealsProducts_filter",userControllers.dayOfthedealsProducts_filter);
router.post("/tradingNowfilterproducts",userControllers.tradingNowfilterproducts);
router.post("/searchProduct",userControllers.searchProduct);
router.post("/inntRating",userControllers.inntRating);
router.post("/InntOutcheckoutList",userControllers.InntOutcheckoutList);
router.post("/inntOutUpdatecarts",userControllers.inntOutUpdatecarts);
router.post("/inntOutaddOrder",userControllers.inntOutaddOrder);
router.post("/InntorderList",userControllers.InntorderList);
router.post("/requestReturn_order",userControllers.requestReturn_order);
router.get("/topSale_inntoutPorduct_list",userControllers.topSale_inntoutPorduct_list);
router.post("/verifyPhone",userControllers.verifyPhone);
router.post("/verifyEmail",userControllers.verifyEmail);
router.post("/sendGift",userControllers.sendGift);
router.post("/sentGigt_list",userControllers.sentGigt_list);
router.post("/getGift_list",userControllers.getGift_list);
router.post("/improvementSuggestion",userControllers.improvementSuggestion);
router.post("/searchInntoutProduct",userControllers.searchInntoutProduct);
router.post("/wishList_search",userControllers.wishList_search);
router.get("/inntoutToday_offerProduct_list",userControllers.inntoutToday_offerProduct_list);
router.post("/wishList_Productsearch",userControllers.wishList_Productsearch);
router.post("/addReportOf_product",userControllers.addReportOf_product);
router.post("/getDataToQrcode",userControllers.getDataToQrcode);
router.post("/Addfriends",userControllers.Addfriends);
router.post("/friendList",userControllers.friendList);
router.post("/sendMoney_request",userControllers.sendMoney_request);
router.post("/verificationsendMoney_otp",userControllers.verificationsendMoney_otp);
router.post("/sendloyalty_points",userControllers.sendloyalty_points);
router.post("/addCashback",userControllers.addCashback);
router.post("/verificationCashback_otp",userControllers.verificationCashback_otp);
router.post("/user_queries",userControllers.user_queries);
router.post("/tranferMoney",userControllers.tranferMoney);
router.post("/transjection_history",userControllers.transjection_history);
router.post("/inntOutShop_list",userControllers.inntOutShop_list);
router.post("/allChatList",userControllers.allChatList);
router.post("/friendChatList",userControllers.friendChatList);
router.post("/removefavouriteShop",userControllers.removefavouriteShop);
router.get("/coupon_list",userControllers.coupon_list);
router.post("/socicalMedia_login",userControllers.socicalMedia_login);
router.post("/takeUserAddress",userControllers.takeUserAddress);
router.post("/filterShop",userControllers.filterShop);
router.post("/refferalHistory",userControllers.refferalHistory);
router.post("/website_cartList",userControllers.website_cartList);
router.post("/website_InnoutcartList",userControllers.website_InnoutcartList);
router.post("/send_otp",userControllers.send_otp);
router.post("/setDefault_address",userControllers.setDefault_address);
router.post("/find_orderDetails_byqrcode",userControllers.find_orderDetails_byqrcode);
router.post("/deleteUser",userControllers.deleteUser);
router.post("/similarInntproductLists",userControllers.similarInntproductLists);


/*..............export router..................*/
module.exports=router;