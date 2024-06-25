//import dependacy here
const express=require("express");
const router=express();
const multer=require("multer");


//import auth middleware
const auth=require("../middleware/venderTokenHandler");


// import controllers here
const venderControllers=require("../controllers/vender_controller");

// use multer modules
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
	limits: {
		filesize: 50000000 // 50 MB in bytes
	}

});
  



//vender controllers url setup 
router.post("/venderSignup",upload.fields([
	{name:'upload_frontId',maxCount:1},
	{name:'upload_backsideId',maxCount:1},
	 {name:'vender_profile',maxCount:1},
	 {name:'shop_licence',maxCount:1},
     {name:'shop_logo',maxCount:1}
	]),venderControllers.venderSignup);


	router.post("/venderLogin",venderControllers.venderLogin);
	router.post("/venderVerifyOtp",venderControllers.venderVerifyOtp);
	router.post("/resendOtp",venderControllers.resendOtp);
	router.post("/createSeller_password",venderControllers.createSeller_password);
	router.post("/venderLogin_withEmail",venderControllers.venderLogin_withEmail);
	router.post("/forgotPassword",venderControllers.forgotPassword);
	router.post("/verifyEmail_andMobile",venderControllers.verifyEmail_andMobile);
    router.post("/resetPassword",venderControllers.resetPassword);
    router.post("/update_BankInformation",auth,venderControllers.update_BankInformation);
	router.post("/getBank_information",auth,venderControllers.getBank_information);
	router.post("/changePromotion_status",venderControllers.changePromotion_status);
	
	router.post("/Update_venderProfile",upload.fields([
		{name:'vender_profile',maxCount:1},
		]),venderControllers.Update_venderProfile);

	router.post("/updateShop_information",upload.fields([
			{name:'vender_profile',maxCount:1},	
			 {name:'shop_licence',maxCount:1},
			 {name:'shop_logo',maxCount:1},
			]),venderControllers.updateShop_information);

  
		
		
	router.post("/getVenderProfile",venderControllers.getVenderProfile);
	router.post("/venderAccount_delete",auth,venderControllers.venderAccount_delete);
    router.post("/venderCategory_list",venderControllers.venderCategory_list);
	router.post("/venderSubcategory_list",venderControllers.venderSubcategory_list);
    router.get("/venderMain_Category_list",auth,venderControllers.venderMain_Category_list);
	router.post("/sub_subcategory_list",venderControllers.sub_subcategory_list);
	router.post("/changeVendor_password",venderControllers.changeVendor_password);
	
	
	router.post("/promotinAdd",venderControllers.promotinAdd);
    router.post("/promotinUpdate",venderControllers.promotinUpdate);
	router.post("/promotinDelete",venderControllers.promotinDelete);
    router.post("/promotinList",venderControllers.promotinList);
	router.post("/promotinDetails",venderControllers.promotinDetails);
	router.post("/addOffer",venderControllers.addOffer);
	router.post("/offer_on_off",venderControllers.offer_on_off);
	router.post("/offerList",venderControllers.offerList);
	router.post("/deleteOffer",venderControllers.deleteOffer);
	
	

   router.post("/venderSend_message",upload.single('text'),venderControllers.venderSend_message);
   router.post("/customerChatList",venderControllers.customerChatList);
  router.post("/venderGet_message",venderControllers.venderGet_message);
  
	/*..........set product controllers url...........*/
	router.post("/addProduct",upload.fields([
		{name:'image1',maxCount:1},
		 {name:'image2',maxCount:1},
		 {name:'image3',maxCount:1},
		 {name:'image4',maxCount:1},
		 {name:'image5',maxCount:1},
		 {name:'video',maxCount:1},
		]),venderControllers.addProduct);
	router.post("/productList",venderControllers.productList);
	router.post("/productDetails",venderControllers.productDetails);
	router.post("/productUpdate",upload.fields([
		{name:'image1',maxCount:1},
		 {name:'image2',maxCount:1},
		 {name:'image3',maxCount:1},
		]),venderControllers.productUpdate);
    router.post("/productActive_statusChange",venderControllers.productActive_statusChange);
	router.post("/deleteProduct",venderControllers.deleteProduct);
	//router.post("/sizeList",venderControllers.sizeList);
	router.post("/sleeveList",venderControllers.sleeveList);
	router.post("/quantityList",venderControllers.quantityList);
	//router.post("/colorList",venderControllers.colorList);

	//reviews
	router.post("/productReviews_list",venderControllers.productReviews_list);
	router.post("/reviewsDetails",venderControllers.reviewsDetails);
	router.post("/singleReview_detail",venderControllers.singleReview_detail);
	router.post("/reviewReplay",venderControllers.reviewReplay);
	router.post("/reviewReport",venderControllers.reviewReport);
	router.get("/productType_list",venderControllers.productType_list);
	router.post("/brand_list",venderControllers.brand_list);
	router.post("/updateseller",upload.fields([
		{name:'upload_frontId',maxCount:1},
		{name:'upload_backsideId',maxCount:1}		
		]),venderControllers.updateseller);

	router.post("/updateMobile",venderControllers.updateMobile);
	router.post("/updateEmail",venderControllers.updateEmail);
	router.post("/deleteVendor",venderControllers.deleteVendor);
	router.get("/maincategory_list",venderControllers.maincategory_list);
	router.post("/verifyPhone",venderControllers.verifyPhone);
	router.post("/shopDetails",venderControllers.shopDetails);
	router.get("/term_and_condiction_list",venderControllers.term_and_condiction_list);
	router.get("/pulicy_list",venderControllers.pulicy_list);
	router.post("/addInntOutProduct",upload.fields([
		{name:'image1',maxCount:1},
		 {name:'image2',maxCount:1},
		 {name:'image3',maxCount:1},
		 {name:'image4',maxCount:1},
		 {name:'image5',maxCount:1},
		 {name:'video',maxCount:1},
		]),venderControllers.addInntOutProduct);
	router.post("/orderList",venderControllers.orderList);
	router.post("/updateOrder_status",venderControllers.updateOrder_status);
	router.post("/filterOrder_list",venderControllers.filterOrder_list);
	router.post("/orderDetails",venderControllers.orderDetails);
	router.post("/shopOrder_count",venderControllers.shopOrder_count);
	router.post("/shopHigh_light",venderControllers.shopHigh_light);
	router.post("/topSale_productList",venderControllers.topSale_productList);
	router.get("/refundPolicyList",venderControllers.refundPolicyList);
	router.get("/returnPolicyList",venderControllers.returnPolicyList);
	router.get("/cancellationPolicyList",venderControllers.cancellationPolicyList);
	router.get("/aboutUsList",venderControllers.aboutUsList);
	router.post("/withdrawRequest",venderControllers.withdrawRequest);
	router.post("/driverChatList",venderControllers.driverChatList);
	router.post("/graphData",venderControllers.graphData);
	router.post("/withdrawable_blance",venderControllers.withdrawable_blance);
	router.post("/returnOrderDetails",venderControllers.returnOrderDetails);
	router.post("/returnOrderList",venderControllers.returnOrderList);
	router.post("/vendorWithdraw_requestList",venderControllers.vendorWithdraw_requestList);
	router.post("/updateMinimum_orderAmount",venderControllers.updateMinimum_orderAmount);
    router.post("/updatedTemporaryClose_date",venderControllers.updatedTemporaryClose_date);
    router.post("/updatedVacationMode_date",venderControllers.updatedVacationMode_date);
	router.post("/createStaff",upload.single('staff_image'),venderControllers.createStaff);
	router.post("/temporaryOnandOff_staff",venderControllers.temporaryOnandOff_staff);
	router.post("/staffList",venderControllers.staffList);
	router.post("/delete_staff",venderControllers.delete_staff);
	router.post("/createQrcodes",venderControllers.createQrcodes);
	router.post("/qrcodesList",venderControllers.qrcodesList);
	router.post("/qrcodesDetails",venderControllers.qrcodesDetails);
	router.post("/attributes_list",venderControllers.attributes_list);
	router.post("/get_attribute",venderControllers.get_attribute);
	router.post("/sendNotification",upload.single('image'),venderControllers.sendNotification);
	router.get("/dummy_api",venderControllers.dummy_api);
	router.post("/updateStaff",upload.single('staff_image'),venderControllers.updateStaff);
	
	
	
// exprots router
module.exports=router;