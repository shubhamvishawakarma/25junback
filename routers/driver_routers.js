// import dependancies in the  router files
const express=require("express");
const router=express();
const multer = require("multer");
const driverControllers=require("../controllers/driver_controller");


/*...............use multer............*/

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
  




 
/*.................import driver controllers............*/
router.post("/driverSignup",upload.fields([
	{name:'frontId_iamge',maxCount:1},
	{name:'backId_iamge',maxCount:1},
	 {name:'vehical_iamge',maxCount:1},
	 {name:'document',maxCount:1}
    
	]),driverControllers.driverSignup);
router.post("/Verifyotp",driverControllers.Verifyotp);
router.post("/createPassword",driverControllers.createPassword);
router.post("/resend_otp",driverControllers.ResendOtp); 
router.post("/driver_login",driverControllers.driver_login);
router.post("/forgotPassword",driverControllers.forgotPassword);
router.post("/verifyEmail_andMobile",driverControllers.verifyEmail_andMobile);
router.post("/resetPassword",driverControllers.resetPassword);
router.post("/updateDriver_data",upload.fields([
	{name:'frontId_iamge',maxCount:1},
	{name:'backId_iamge',maxCount:1},
	 {name:'vehical_iamge',maxCount:1},
	 {name:'document',maxCount:1},
	 {name:'driverProfile',maxCount:1},

	 
	]),driverControllers.updateDriver_data);
router.post("/getDriverData",driverControllers.getDriverData);
router.post("/updatePhone",driverControllers.updatePhone);
router.post("/updateEmail",driverControllers.updateEmail);
router.post("/deleteDriver",driverControllers.deleteDriver);
router.post("/verifyPhone",driverControllers.verifyPhone);
router.post("/driverStatus",driverControllers.driverStatus);
router.post("/get_order_list",driverControllers.get_order_list);
router.post("/assingedDriver",driverControllers.assingedDriver);
router.post("/filterOrder_list",driverControllers.filterOrder_list);
router.post("/acceptOrder_details",driverControllers.acceptOrder_details);
router.post("/orderPicked_up",driverControllers.orderPicked_up);
router.post("/generateCustomer_otp",driverControllers.generateCustomer_otp);
router.post("/verifiedDelivery",driverControllers.verifiedDelivery);
router.post("/driverHomePage",driverControllers.driverHomePage);
router.post("/orderCancel_byDriver",driverControllers.orderCancel_byDriver);
router.post("/driverWithdraw_request",driverControllers.driverWithdraw_request);
router.post("/verifiedWithdrawRequest",driverControllers.verifiedWithdrawRequest);
router.post("/withdrawTranjection_history",driverControllers.withdrawTranjection_history);
router.post("/driverSend_message",upload.single('text'),driverControllers.driverSend_message);
router.post("/driverChatList",driverControllers.driverChatList);
router.post("/chatDetails_list",driverControllers.chatDetails_list);
router.get("/emergancyContact_list",driverControllers.emergancyContact_list);
router.get("/term_and_pulicy",driverControllers.term_and_pulicy);
router.post("/earningStatement",driverControllers.earningStatement);
router.post("/earningStatement_details",driverControllers.earningStatement_details);
router.post("/filter_earningStatement",driverControllers.filter_earningStatement);
router.post("/notification_list",driverControllers.notification_list);
router.get("/contactus_list",driverControllers.contactus_list);


module.exports=router;
 
 

