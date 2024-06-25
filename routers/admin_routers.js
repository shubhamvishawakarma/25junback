/*...............import dependancies..............*/
const express =require("express");
const router=express();
const multer=require('multer');


/*....................import middleware...........*/
const auth=require("../middleware/validateTokenHandler");


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
                 file.mimetype == "application/pdf" ||
				 file.mimetype == "video/mp4" ||
				 file.mimetype == "audio/mpeg" 

			){
			callback(null,true)
		}else{
			console.log('only  png , jpg & jpeg,csv file supported')
                     callback(null,false)
		}
	},
	limits:{
		 filesize:500000000000 //1000000 bytes=1MB
   }


});
  
 


/*............import user_controllers.........*/
const adminControllers=require("../controllers/admin_controller");


/*..........set user controllers url...........*/
router.post("/create_banner_api",upload.single('banner_image'),adminControllers.create_banner_api);
router.post("/update_banner_api",upload.single('banner_image'),adminControllers.update_banner_api);
router.post("/delete_banner_api",auth,adminControllers.delete_banner_api);
router.get("/get_banner_api",adminControllers.get_banner_api);
router.post("/activeDeactive_banner",auth,adminControllers.activeDeactive_banner);
router.post("/getBanner_byId",auth,adminControllers.getBanner_byId);



router.post("/create_aboutUs",adminControllers.create_about_us);
router.get("/aboutUs_list",adminControllers.aboutUs_list);

router.post("/create_termAnd_condiction",adminControllers.Term_condiction);
router.get("/Term_condiction_list",adminControllers.Term_condiction_list);

router.post("/create_faq",adminControllers.create_faq);
router.get("/faq_list",adminControllers.faq_list);


router.post("/create-pulicy",auth,adminControllers.create_privacy);
router.get("/privacy_list",adminControllers.privacy_list);


// contact us url
router.post("/create_contactUs",auth,adminControllers.create_contactUs);
router.post("/updateContact_us",auth,adminControllers.updateContact_us);
router.get("/contactUs_list",adminControllers.contactUs_list);

// category url setup
router.post("/createCategory",upload.single('category_image'),adminControllers.createCategory);
router.post("/updateCategory",upload.single('category_image'),adminControllers.updateCategory);
router.get("/getCategory",adminControllers.getCategory);
router.post("/getCategory_byId",auth,adminControllers.getCategory_byId);
router.post("/activeDeactive_category",auth,adminControllers.activeDeactive_category);
router.post("/deleteCategory",auth,adminControllers.deleteCategory);
router.post("/categorySearch_api",auth,adminControllers.categorySearch_api);


// subcategory url setup
router.post("/createSubcategory",upload.single('subcategory_image'),adminControllers.createSubcategory);
router.post("/updateSubcategory",upload.single('subcategory_image'),adminControllers.updateSubcategory);
router.get("/getSubcategory",adminControllers.getSubcategory);
router.post("/activeDeactive_subcategory",auth,adminControllers.activeDeactive_subcategory);
router.post("/getSubcategory_byId",auth,adminControllers.getSubcategory_byId);
router.post("/deleteSubcategory",auth,adminControllers.deleteSubcategory);
router.post("/subcategorySearch_api",auth,adminControllers.subcategorySearch_api);



// admin url
router.post("/AdminSignup",adminControllers.AdminSignup);
router.post("/AdminLogin",adminControllers.AdminLogin);

//language
router.post("/createLanguage",auth,adminControllers.createLanguage);
router.get("/languageList",adminControllers.languageList);

//customer list url
router.get("/customerList",adminControllers.customerList);
router.post("/userBlock_unblock_api",auth,adminControllers.userBlock_unblock_api);
router.post("/customerDetails",auth,adminControllers.customerDetails);


//saller and vender url
router.get("/sallerList_api",adminControllers.sallerList_api);
router.post("/sallerBlock_unblock_api",auth,adminControllers.sallerBlock_unblock_api);
router.post("/sallerSignup",upload.fields([
	{name:'upload_frontId',maxCount:1},
	{name:'upload_backsideId',maxCount:1},
	 {name:'vender_profile',maxCount:1},
	 {name:'shop_licence',maxCount:1},
     {name:'shop_logo',maxCount:1}
	]),adminControllers.sallerSignup);
	

router.post("/sallerDetails",adminControllers.sallerDetails);
router.post("/categoryList_inntOut",auth,adminControllers.categoryList_inntOut);
router.get("/bannerType_list",adminControllers.bannerType_list);

router.post("/forgotPassword",auth,adminControllers.forgotPassword);
router.post("/verifyEmail",auth,adminControllers.verifyEmail);
router.post("/resetPassword",auth,adminControllers.resetPassword);
router.post("/Insert_subSubcategory",upload.single('sub_subcategory_image'),adminControllers.Insert_subSubcategory);

// main category
router.post("/mainCategory",upload.single('maincategory_image'),adminControllers.mainCategory);
router.get("/mainCategory_list",adminControllers.mainCategory_list);
router.get("/get_mainCategory_list",adminControllers.get_mainCategory_list);

router.post("/updatesubSubcategory",adminControllers.updatesubSubcategory);
router.post("/deletesubSubcategory",adminControllers.deletesubSubcategory);
router.post("/getsubSubcategory_byId",adminControllers.getsubSubcategory_byId);
router.get("/getsubSubcategory",adminControllers.getsubSubcategory);
router.get("/productList",adminControllers.productList);
router.post("/product_approve",adminControllers.product_approve);
router.post("/productDetails",adminControllers.productDetails);
router.post("/sellerApproved",adminControllers.sellerApproved);
router.get("/maincategory_list",adminControllers.maincategory_list);

router.post("/createBrand",adminControllers.createBrand);
router.get("/brandList",adminControllers.brandList);
router.post("/createProductType",adminControllers.createProductType);
router.get("/productTypeList",adminControllers.productTypeList);
router.get("/requestProductList",adminControllers.requestProductList);

router.post("/dealsoftheday",adminControllers.dealsoftheday);
router.post("/createCommission_delivery",adminControllers.createCommission_delivery);
router.get("/Commission_delivery_list",adminControllers.Commission_delivery_list);
router.post("/returnPolicy",adminControllers.returnPolicy);
router.get("/returnPolicyList",adminControllers.returnPolicyList);
router.post("/refundPolicy",adminControllers.refundPolicy);
router.get("/refundPolicyList",adminControllers.refundPolicyList);
router.post("/cancellationPolicy",adminControllers.cancellationPolicy);
router.get("/cancellationPolicyList",adminControllers.cancellationPolicyList);
router.get("/dashboardData",adminControllers.dashboardData);
router.get("/topCustomer_list",adminControllers.topCustomer_list);
router.get("/mostPopular_storelist",adminControllers.mostPopular_storelist);
router.get("/topSelling_stores",adminControllers.topSelling_stores);
router.get("/topSelling_products",adminControllers.topSelling_products);
router.get("/mostPopular_products",adminControllers.mostPopular_products);
router.post("/Add_advertisementProduct",adminControllers.Add_advertisementProduct);
router.post("/orderList",adminControllers.orderList);
router.post("/orderDetails",adminControllers.orderDetails);
router.get("/advertisementProduct_list",adminControllers.advertisementProduct_list);

router.post("/customerOrderList",adminControllers.customerOrderList);
router.post("/shopOrder_list",adminControllers.shopOrder_list);
router.post("/shopProduct_list",adminControllers.shopProduct_list);
router.post("/shopReviews_list",adminControllers.shopReviews_list);
router.post("/shopOrder_details",adminControllers.shopOrder_details);
router.post("/shopProduct_details",adminControllers.shopProduct_details);
router.get("/deniedProductList",adminControllers.deniedProductList);
router.get("/userInnt_ratingList",adminControllers.userInnt_ratingList);
router.get("/vendorWithdraw_requestList",adminControllers.vendorWithdraw_requestList);
router.post("/settleWithdraw",adminControllers.settleWithdraw);
router.post("/Withdraw_requestDetils",adminControllers.Withdraw_requestDetils);
router.post("/withdrawRequest",adminControllers.withdrawRequest);
router.post("/adminWallet_details",adminControllers.adminWallet_details);
router.post("/productReviews",adminControllers.productReviews);
router.get("/driverList",adminControllers.driverList);
router.post("/driverDetails",adminControllers.driverDetails);
router.post("/driverAdd",upload.fields([
	{name:'frontId_iamge',maxCount:1},
	{name:'backId_iamge',maxCount:1},
	 {name:'vehical_iamge',maxCount:1},
	 {name:'document',maxCount:1}
    
	]),
adminControllers.driverAdd);
router.post("/approveDriver",adminControllers.approveDriver);
router.post("/returnOrderList",adminControllers.returnOrderList);
router.post("/returnOrderDetails",adminControllers.returnOrderDetails);
router.get("/allTransjection",adminControllers.allTransjection);
router.post("/transjectionDetails",adminControllers.transjectionDetails);
router.get("/improvementSuggestionList",adminControllers.improvementSuggestionList);
router.post("/graphData",adminControllers.graphData);
router.get("/driverWithdraw_requestList",adminControllers.driverWithdraw_requestList);
router.post("/settleWithdraw_driver",adminControllers.settleWithdraw_driver);
router.post("/driverWithdraw_requestDetils",adminControllers.driverWithdraw_requestDetils);
router.post("/insertEmergancy_Contact",adminControllers.insertEmergancy_Contact);
router.get("/emergancy_Contact_list",adminControllers.emergancy_Contact_list);
router.post("/deleteEmergancy_Contact",adminControllers.deleteEmergancy_Contact);
router.post("/changeStatusEmergancy_Contact",adminControllers.changeStatusEmergancy_Contact);
router.post("/updateDriver",upload.fields([
	{name:'frontId_iamge',maxCount:1},
	{name:'backId_iamge',maxCount:1},
	 {name:'vehical_iamge',maxCount:1},
	 {name:'document',maxCount:1}
    
	]),
adminControllers.updateDriver);
router.post("/updateDriver_password",adminControllers.updateDriver_password);
router.post("/vendorWallet_details",adminControllers.vendorWallet_details);
router.post("/todayOffer_add",adminControllers.todayOffer_add);
router.post("/inntProductList",adminControllers.inntProductList);
router.post("/inntOutProductList",adminControllers.inntOutProductList);
router.get("/userQueryList",adminControllers.userQueryList);
router.post("/insertAttributes",adminControllers.insertAttributes);
router.post("/updateAttributes",adminControllers.updateAttributes);
router.post("/deleteAttributes",adminControllers.deleteAttributes);
router.get("/attributes_list",adminControllers.attributes_list);
router.post("/get_attribute",adminControllers.get_attribute);
router.post("/addPushNotification",adminControllers.addPushNotification);
router.get("/staffList",adminControllers.staffList);
router.post("/staff_active_deactive",adminControllers.staff_active_deactive);
router.post("/update_staff",adminControllers.update_staff);


/*..............export router..................*/
module.exports=router;
