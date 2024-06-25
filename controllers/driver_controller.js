//import all models of admin panel here
const Driver=require("../models/driver_models");
const Vender=require("../models/vender_models");
const Order=require("../models/order");
const Assigned=require("../models/assigned_driver");
const Checkout=require("../models/checkout");
const Withdraw=require("../models/withdraw");
const User_Address = require("../models/user_address_models");
const Chat=require("../models/chat");
const Emergancy_support=require("../models/emergancy_support");
const Term = require("../models/term_and_condiction_models");
const Notification=require("../models/notification");
const Contact = require("../models/contact_us_models");


/*---------------import module----------------------------*/
const mongoose = require('mongoose'); 
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { checkout } = require("../routers/driver_routers");
 


/*.................make function and use it........*/
function generate_otp() {
	const OTP = Math.floor(1000 + Math.random() * 9000);
	return OTP;
}

function generateRandomString() {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const length = 8;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;

}


function generate_transactionId() {
	const trnsId = Math.floor(100000000000 + Math.random() * 900000000000);
	return trnsId;
}



/*........................CREATE API................*/

/*...................create driver signup api..........*/

const driverSignup = async (req, res) => {
	try {
		const {fname, lname,phone,email,dob,fcm_id,city, latitude,longitude} = req.body;
    
		if (!phone || !fcm_id || !req.files) {
			return res.status(400).json({ "result": "false", "message": "required parameters are fname, latitude,longitude,lname,phone,email,dob,fcm_id,city,frontId_iamge,backId_iamge,vehical_iamge,document" });
		}

    const {frontId_iamge,backId_iamge,vehical_iamge,document}=req.files;

		const exist_driver = await Driver.findOne({phone,status:1});
		if (exist_driver) {
			return res.status(400).json({ "result": "false", "message": "Allready exist" });
		}

		


		const existdriver = await Driver.findOne({phone});
		const otps = generate_otp();
		
			const objects = {
				fname,
         lname,
         phone,
         email,
         dob,
         fcm_id,
         city,
				otp: otps,
        frontId_iamge: frontId_iamge ? frontId_iamge[0].filename : null,
        backId_iamge: backId_iamge ? backId_iamge[0].filename : null,
        vehical_iamge: vehical_iamge ? vehical_iamge[0].filename : null,
        document: document ? document[0].filename : null,
			};
		
		
		if (existdriver) {
			const driverData = await Driver.findOneAndUpdate({ phone }, objects, { new: true });
			return res.status(200).json({ "result": "true", "message": "Otp generated successfully", data: driverData });
		} else {

			
		const otp = generate_otp();

		const objectData = {
			fname,
         lname,
         phone,
         dob,
         fcm_id,
         city,
				otp: otp,
        frontId_iamge: frontId_iamge ? frontId_iamge[0].filename : null,
        backId_iamge: backId_iamge ? backId_iamge[0].filename : null,
        vehical_iamge: vehical_iamge ? vehical_iamge[0].filename : null,
        document: document ? document[0].filename : null,
        geo_location: {
          type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
		};

			const driver_data = new Driver(objectData);
			const dinu = await driver_data.save();
			res.status(200).json({ "result": "true", "message": "Otp generated sucessfully", data:dinu });

		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};




/*-------------------verify otp api---------------------*/
const Verifyotp = async (req, res) => {
  try{
    const {phone,otp} = req.body;
    if(phone && otp) {
      const data =await Driver.findOne({phone,otp:otp});
      if (data) {
        await Driver.findOneAndUpdate({phone},{status:1},{new:true});
        res.status(200).json({
          "result": "true",
          "message": "driver verify successfully",
           data:data
        })
      }else{
        res.status(400).json({
          "result": "false",
          "message": "Invalid phone or otp",
        });
      }
    }else{
      res.status(400).json({
        "result": "false",
        "message": "required parameters are phone and otp",
      });
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};




const createPassword=async(req,res)=>{
  try{
    const {driverId,password,confirm_password}=req.body;
    if(!driverId || !password || !confirm_password){
      return res.status(400).json({
        "result": "false",
        "message": "Required parameters are driverId,password,confirm_password",
      });
    }

    if(password !== confirm_password){
      return res.status(400).json({
        "result": "false",
        "message": "password doesn't match",
      });

    }

      const matchData=await Driver.findOne({_id:driverId});
      if(!matchData){
        res.status(400).json({ "result": "false", "message": "Invalid driverId "});

      }else{
        const hashedPassword=await bcrypt.hash(password,10);
        const updatedData=await Driver.findOneAndUpdate({_id:driverId},{password:hashedPassword},{new:true});
        res.status(200).json({"result":"false","message":"Password created sucussfully",data:updatedData});
      }
    

  }catch(err){
    console.log(err)
    res.status(400).json({ "result": "false", "message": err.message });
  }

};





/*--------------------resend otp api--------------------*/
const ResendOtp = async (req, res) => {
  const { phone, fcm_id } = req.body;
  try{
    if(phone && fcm_id){
      const data =await Driver.findOne({phone}); 
      if(data){
        var otp = Math.floor(1000 + Math.random() * 9000);
        const update_data = await Driver.findOneAndUpdate({phone},{$set:{otp:otp,fcm_id:fcm_id}},{new:true});
        res.status(200).json({
          "result": "true",
          "message": "otp sent sucessfully",
          data:update_data
        });
      }else{
        res.status(400).json({
          "result": "false",
          "message": "Invalid phone no,please enter vaid phone no",
        });
      } 
    }else{
      res.status(400).json({
        "result": "false",
        "message": "required parameters are phone and fcm_id",
      });
    }
  }catch(error){
    console.log(error.message)
    res.status(400).json({
      "result":"false",
      "message":error.message
    });
  }
}




/*................user register and login api...............*/
const driver_login=async(req,res)=>{
  try {
		const {key, password } = req.body;
		if (!password || !key) {
			res.status(400).json({ "result": "false", "message": "required parameters are password,key and sent email or  phone in key parameter " })
		} else {
			const Data = await Driver.findOne({ $or: [{phone: key }, { email: key}] });
			if (!Data) {
				res.status(400).json({ "result": "false", "message": "You are not register" });
			} else {
				const matchData = await Driver.findOne({ $or: [{ phone: key }, { phone: key }],status:1 });
				
				if (!matchData) {
					res.status(400).json({
						"result": "false",
						"message": "Please verify your mobile number"
					});
				}
				else if(matchData.driver_status===2){
					res.status(400).json({
						"result": "false",
						"message": "Your account has been blocked"
					});

				}
				 else {
					// Match password
					const passwordMatch = await bcrypt.compare(password, matchData.password);
                    //generate token
               const token = jwt.sign({ driverId:matchData._id, email: matchData.email, phone: matchData.phone }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });
					if (passwordMatch) {
						res.status(200).json({
							"result": "true",
							"message": "Driver signed successfully",
							data: matchData,token
						});
					} else {
						res.status(400).json({
							"result": "false",
							"message": "Invalid password"
						});
					}
				}
			}
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};




/*................ForgotPassword....................*/
const forgotPassword = async (req, res) => {
	const { key } = req.body;
	if (!key) {
		res.status(400).json({ "result": "false", "message": "required parameters key and any one required parameter in both them(email,phone)" });
	};

	try {
		const data = await Driver.findOne({ $or: [{ phone: key }, { email: key }] });
		if (data) {
			const otp = generate_otp();
			const Data = await Driver.findOneAndUpdate({ $or: [{ phone: key }, { email: key }] }, { $set: { otp: otp } }, { new: true });
			res.status(200).json({ "result": "true", "message": "Otp send sucessfully", data: Data });
		}
		else {
			res.status(400).json({ "result": "false", "message": "Please send correct email and phone" })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



// verifyEmail
const verifyEmail_andMobile = async (req, res) => {
	const { key, otp } = req.body;
	if (!key || !otp) {
		res.status(400).json({ 'result': "false", "message": "required parameter are otp, key" })
	};
	try {
		const data = await Driver.findOne({ $or: [{ phone: key }, { email: key }], otp: otp });
		if (!data) {
			res.status(400).json({ 'result': "false", "message": "Invalid otp" })

		} else {
			res.status(200).json({ 'result': "true", "message": "Your otp verified sucessfully", data: data })

		}

	} catch (err) {
		console.log(err.mesage)
	}


};



// resetPassword
const resetPassword = async (req, res) => {
	const { key, password } = req.body;
	if (!key || !password) {
		res.status(400).json({ 'result': "false", "message": "required parameter are password, key" })
	};
	try {
		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(password, 10);
		await Driver.findOneAndUpdate({ $or: [{ phone: key }, { email: key }] }, { $set: { password: hashedPassword } }, { new: true });
		res.status(200).json({ 'result': "true", "message": "Password reset sucessfully" })

	} catch (err) {
		console.log(err.mesage)
	}


};



const updateDriver_data = async (req, res) => {
  try {
      const { driverId, fname, lname, dob,email,phone,city } = req.body;

      if (!driverId) {
          return res.status(400).json({ "result": "false", "message": "required parameter is driverId and optional are fname, lname,email,phone, dob, city,driverProfile, frontId_iamge, backId_iamge, vehical_iamge, document" });
      }

      let frontId_iamge, driverProfile, backId_iamge, vehical_iamge, document;
      if (req.files) {
        frontId_iamge = req.files.frontId_iamge;
        driverProfile = req.files.driverProfile;
        backId_iamge = req.files.backId_iamge;
        vehical_iamge = req.files.vehical_iamge;
        document = req.files.document;
      }

      const objects = {
          fname,
          lname,
          dob,
          city,
          email,
          phone,
      };

      if (frontId_iamge && frontId_iamge[0].filename) {
          objects.frontId_iamge = frontId_iamge[0].filename;
      }

      if (backId_iamge && backId_iamge[0].filename) {
          objects.backId_iamge = backId_iamge[0].filename;
      }

      if (vehical_iamge && vehical_iamge[0].filename) {
          objects.vehical_iamge = vehical_iamge[0].filename;
      }

      if (document && document[0].filename) {
          objects.document = document[0].filename;
      }

      if (driverProfile && driverProfile[0].filename) {
        objects.driverProfile = driverProfile[0].filename;
    }
     const otp=generate_otp();
      const updatedData = await Driver.findOneAndUpdate({ _id: driverId },{otp},{new:true});
      
      const data={
        driverId:updatedData._id,
        otp:updatedData.otp,
        fname:fname || updatedData.fname,
        lname:lname || updatedData.lname,
        dob: dob || updatedData.dob,
        city :city || updatedData.city,
        email:email || updatedData.email,
        phone:phone || updatedData.phone,
        frontId_iamge:frontId_iamge || updatedData.frontId_iamge,
         driverProfile :driverProfile || updatedData.driverProfile, 
         backId_iamge :backId_iamge || updatedData.backId_iamge, 
         vehical_iamge:vehical_iamge || updatedData.vehical_iamge,
        document :document|| updatedData.document

      }
      res.status(200).json({ "result": "true", "message": "Driver data updated successfully", data: data });
  } catch (err) {
      res.status(400).json({ "result": "false", "message": err.message });
      console.log(err.message);
  }
};





const getDriverData = async (req, res) => {
  try {
      const { driverId } = req.body;

      if (!driverId) {
          return res.status(400).json({ "result": "false", "message": "required parameter is driverId" });
      }

      const getData = await Driver.findById({ _id: driverId });
      if(!getData){
        res.status(400).json({ "result": "false", "message": "Driver data does not found"});
      }else{
        res.status(200).json({ "result": "true", "message": "Driver data got successfully", data: getData });
      }

     
  } catch (err) {
      res.status(400).json({ "result": "false", "message": err.message });
      console.log(err.message);
  }
};




// update mobile
const updatePhone = async (req, res) => {
  try {
    const {
      driverId,
      phone
    } = req.body;

    if (!driverId || ! phone) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter are driverId,phone"
      });
    }

    const matchData = await Driver.findOne({ _id: driverId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Driver does not exist"
      });
    } 


    const matchDatas = await Driver.findOne({ _id: driverId,phone:phone });
    if (matchDatas) {
      return res.status(400).json({
        "result": "false",
        "message": "Mobile Number allready exist"
      });
    } 
    
   const Otp=generate_otp();
      const updateData = {
        driverId,
        otp:Otp
      };
      
      const updatedDriver = await Driver.findByIdAndUpdate(
        { _id: driverId },
        updateData,
        { new: true }
      );

      if (updatedDriver) {
        const data = {
          driverId: updatedDriver._id,
          otp: updatedDriver.otp,
          phone:updatedDriver.phone,
          newphone:phone
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
      driverId,
      email,
    } = req.body;

    if (!driverId) {
      return res.status(400).json({
        "result": "false",
        "message": "Required parameter is driverId,email"
      });
    }

    const matchData = await Driver.findOne({ _id: driverId });
    if (!matchData) {
      return res.status(400).json({
        "result": "false",
        "message": "Driver does not exist"
      });
    } 
    
    const matchDatas = await Driver.findOne({ _id: driverId ,email:email});
    if (matchDatas) {
      return res.status(400).json({
        "result": "false",
        "message": "Email already exist"
      });
    } 
    
   
      const updateData = {
        driverId,
      };
      
      const updatedVendor = await Driver.findByIdAndUpdate(
        { _id: driverId },
        updateData,
        { new: true }
      );

      if (updatedVendor) {
        const data = {
          driverId: updatedVendor._id,
          oldEmail:updatedVendor.email,
          newEmail:email
        };

        return res.status(200).json({ "result": "true","message":"Please check your email",data:data});
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Failed to update Driver data"
        });
      }
    
  } catch (error) {
    return res.status(500).json({ "result": "false", "message": error.message });
  }
};





const deleteDriver = async (req, res) => {
  try {
    const { driverId, reason, text } = req.body;

    // Check if required parameters are present
    if (!driverId || !reason || !text) {
      return res.status(400).json({
        result: "false",
        message: "Required parameters are driverId, reason, text"
      });
    }

    // Update vendor status to 2 (assuming 2 represents deleted status)
    const updatedData = await Driver.findByIdAndUpdate(
      { _id: driverId },
      { status: 0 },
      { new: true }
    );

    // Create a new entry in VendorDelete collection
    const insertData = new Vendordelete({ driverId, reason, text });
    await insertData.save();

    // Check if vendor exists for deletion
    if (!updatedData) {
      res.status(400).json({
        result: "false",
        message: "Driver does not exist"
      });
    } else {
      res.status(200).json({
        result: "true",
        message: "Driver deleted successfully"
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
    const {
      driverId,
      otp, 
      fname,
          
      lname,
      dob,
      city,
      email,
      phone,
      frontId_iamge,
       driverProfile,
      backId_iamge,
      vehical_iamge,
      document
    }=req.body;
    if(!driverId || !otp){
      return res.status(400).json({"result":"false","message":"required parameters are driverId,otp"})
    }

    const matchData = await Driver.findOne({_id:driverId,otp:otp});
    if (!matchData) {
      res.status(400).json({
        result: "false",
        message: "Invalid otp"
      });
    } else {
     const data= await Driver.findByIdAndUpdate({_id:driverId},
      {
        fname,
        lname,
        dob,
        city,
        email,
        phone,
      frontId_iamge,
       driverProfile,
      backId_iamge,
      vehical_iamge,
      document
    },
      {new:true})
      res.status(200).json({
        result: "true",
        message: " Driver data updated successfully",
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






// driver active deactive status
const driverStatus=async(req,res)=>{
  try{
    const {driverId}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameter is driverId"})
    }

    const data=await Driver.findOne({_id:driverId});
    if(data.active_status=="0"){
      await Driver.findByIdAndUpdate({_id:driverId},{active_status:1},{new:true});
      res.status(200).json({"result":"true","message":"Driver actived sucessfully"})
    }else{
      await Driver.findByIdAndUpdate({_id:driverId},{active_status:0},{new:true});
      res.status(200).json({"result":"true","message":"Driver Deactived sucessfully"})
    }

  }catch(err){
    console.log(err.message)
    res.status(400).json({"result":"false","message":err.message})
  }

};





/*...................get_order_list.................*/
const get_order_list = async (req, res) => {
  try {  
    const { latitude, longitude, driverId } = req.body; 
    if (!latitude || !longitude) {
      return res.status(400).json({ "result": "false", "message": "required parameters are missing latitude, longitude, driverId" });
    }

    const checkData = await Assigned.find({ driverId, $or: [{ assigne_status: 1 }, { status: 2 }] });
    const orders = checkData.map(item => item.orderId);
   
    const orderData = await Order.find({ check_status: 0, pay_place: "Address", _id: { $nin: orders }, 'products.order_status': 2 }).populate('userId shopId checkoutId').sort({ _id: -1 });
    const checkIds = orderData.map(item => item.checkoutId);
    const address = await Checkout.find({ _id: { $in: checkIds } }).populate('addressId');
    
    
  // Merge orderData and addressInfo based on userId
  const mergedData = orderData.map(order => {
    const userInfo = address.find(info => info.userId.toString() === order.userId._id.toString());
    return { ...order.toObject(), address: userInfo };
  });
    

    // Filter orders within 10 km
    const nearbyOrders = mergedData.filter(order => {
      const storeLat = order.shopId.location.coordinates[1];
      const storeLon = order.shopId.location.coordinates[0];
      const distance = calculateDistance(latitude, longitude, storeLat, storeLon);
      return distance <=40; // 10 km radius
    });
    
   
    const responseData = nearbyOrders.map(order => ({
        _id: order._id,
        userId: order.userId._id,
        userFname: order.userId.first_name,
        userLname: order.userId.last_name,
        user_mobile: order.userId.mobile_number,
        user_address: order.address.addressId,
        shopName: order.shopId.shop_name, // Fixed variable name
        shop_mobile: order.shopId.mobile_number,
        shop_address: order.shopId.shop_address,
        shop_city: order.shopId.city ? order.shopId.city : "", // Fixed potential error
        shop_lon: order.shopId.location.coordinates[0], // Fixed variable name
        shop_lat: order.shopId.location.coordinates[1], // Fixed variable name
        orderId: order.orderId,
        status: order.status,
        delivery_place:order.checkoutId.delivery_place,
        payType:order.checkoutId.payType || 0,
        paymentMode:order.checkoutId.paymentMode,
        grand_total:order.checkoutId.grand_total,
        note:order.checkoutId.note,
        delivery_charge:order.delivery_charge || 0,
        order_date: order.createdAt,
        update_date: order.updatedAt,
        products: order.products.filter(product => product.order_status == 2)
    }));
   
    if(!responseData ||responseData.length==0){
     return res.status(400).json({
        "result": "false",
        "message": "Order list  not found",
        "data": responseData
      });
    }

    res.status(200).json({
      "result": "true",
      "message": "Order list got successfully",
      "data": responseData
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      "result": "false",
      "message": err.message
    });
  }
};



// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}



const assingedDriver = async (req, res) => {
  try {
    const { driverId, orderId, status, message } = req.body;
    if (!driverId || !orderId || !status) {
      return res.status(400).json({
        result: false,
        message: "Required parameters are driverId, orderId, and status (1 for accept and 2 for reject)"
      });
    }

    let updatedData = await Assigned.findOneAndUpdate({ orderId, driverId }, { assigne_status: status, status: status, message }, { new: true });
    if (!updatedData) {
      const matchData = new Assigned({
        driverId,
        orderId,
        assigne_status: status,
        status: status,
        message,
      });
      const data = await matchData.save();
      if(status == "1"){
        await Order.findOneAndUpdate({_id:orderId},{check_status:1},{new:true});
      }
      
      return res.status(200).json({
        result: true,
        message: "Your request has been added successfully",
        data: data
      });
    } else {
      return res.status(200).json({
        result: true,
        message: "Your request has been updated successfully"
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: error.message
    });
  }
};






const filterOrder_list = async (req, res) => {
  try {  
    const { driverId, status } = req.body; 
    if (!driverId || !status) {
      return res.status(400).json({ "result": "false", "message": "required parameters are driverId, status(1 for accept 3 for delivery pending 4 for delivered 5 for cancel )" });
    }

    const checkData = await Assigned.find({ status: status }).sort({_id:-1});
    const orders = checkData.map(item => item.orderId);
    const findData = await Order.find({ _id: { $in: orders } }).populate('userId shopId checkoutId').sort({ _id: -1 });
    const checkIds = findData.map(item => item.checkoutId);
    const address = await Checkout.find({ _id: { $in: checkIds } }).populate('addressId');
    
    
  // Merge orderData and addressInfo based on userId
  const mergedData = findData.map(order => {
    const userInfo = address.find(info => info.userId.toString() === order.userId._id.toString());
    return { ...order.toObject(), address: userInfo };
  });
    

    // Check if findData is not an array, handle accordingly
    if (!Array.isArray(mergedData)) {
      return res.status(400).json({ "result": "false", "message": "No orders found" });
    }

    const responseData = mergedData.map(order => ({
      _id: order._id,
      userId: order.userId._id,
      userFname: order.userId.first_name,
      userLname: order.userId.last_name,
      user_mobile: order.userId.mobile_number,
      user_address: order.address.addressId,
      shopName: order.shopId.shop_name, // Fixed variable name
      shop_mobile: order.shopId.mobile_number,
      shop_address: order.shopId.shop_address,
      shop_city: order.shopId.city ? order.shopId.city : "", // Fixed potential error
      shop_lon: order.shopId.location.coordinates[0], // Fixed variable name
      shop_lat: order.shopId.location.coordinates[1], // Fixed variable name
      orderId: order.orderId,
      status: order.status,
      delivery_place:order.checkoutId.delivery_place,
      payType:order.checkoutId.payType || 0,
      paymentMode:order.checkoutId.paymentMode,
      grand_total:order.checkoutId.grand_total,
      note:order.checkoutId.note,
      delivery_charge:order.delivery_charge || 0,
      order_date: order.createdAt,
      update_date: order.updatedAt,
      products: order.products.filter(product => product.order_status !== 1)
  }));


    res.status(200).json({
      "result": "true",
      "message": "Order list retrieved successfully",
      "data": responseData
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      "result": "false",
      "message": err.message
    });
  }
};






const acceptOrder_details = async (req, res) => {
  try {  
    const { driverId, orderId } = req.body; 
    if (!driverId || !orderId) {
      return res.status(400).json({ "result": "false", "message": "required parameters are driverId, orderId" });
    }

    const assignedData = await Assigned.findOne({ driverId, orderId });
    if(!assignedData){
      return res.status(404).json({ "result": "false", "message": "This order did not accept  by given driverId" });
    }
    const findData = await Order.findOne({_id:orderId }).populate('userId shopId');
    const checkoutData = await Checkout.findOne({_id:findData.checkoutId}).populate('addressId');
    const address = {
		  placeType: checkoutData.addressId?.place_type || 0,
		  state:checkoutData.addressId?.state || 0,
		  city_name:checkoutData.addressId?.city_name || 0,
		  pin_code:checkoutData.addressId?.pin_code || 0,
		  building_no:checkoutData.addressId?.building_no || 0,
		  landmark:checkoutData.addressId?.landmark || 0,
		  village_name:checkoutData.addressId?.village_name || 0,
		  lat:checkoutData.addressId?.location.coordinates[1] || 0,
		  lon:checkoutData.addressId?.location.coordinates[0] || 0,
	  };
	  
		
    

    // Check if findData is null, handle accordingly
    if (!findData) {
      return res.status(404).json({ "result": "false", "message": "Order not found" });
    }

    const responseData = {
      _id: findData._id,
      userId: findData.userId._id,
      userFname: findData.userId.first_name,
      userlname: findData.userId.last_name,
      user_mobile: findData.userId.mobile_number,
      ...address,
      shopName: findData.shopId.shop_name,
      shop_mobile: findData.shopId.mobile_number,
      shop_address: findData.shopId.shop_address,
      shop_city: findData.shopId.city,
      shop_imge: findData.shopId.shop_logo,
      shopId: findData.shopId._id,
      shop_email: findData.shopId.email,
      shop_lon: findData.shopId.location.coordinates[0],
      shop_lat: findData.shopId.location.coordinates[1],
      orderId: findData.orderId,
      qrcode: findData.qrcodes,
      paymentMethos: checkoutData.paymentMode,
      order_status: assignedData.status,
      expected_time: findData.time || "5:45",
      delivery_time: findData.delivery_time || "6:00",
      order_verification_code: findData.orderVerification_code,
      //status: findData.status,
      order_date: findData.createdAt,
      update_date: findData.updatedAt,
      products: findData.products.filter(product => product.order_status !== 1)
    };

    res.status(200).json({
      "result": "true",
      "message": "Order details retrieved successfully",
      "data": responseData
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      "result": "false",
      "message": err.message
    });
  }
};



const orderPicked_up = async (req, res) => {
  try {
    const { driverId, orderId } = req.body;
    if (!driverId || !orderId) {
      return res.status(400).json({ result: false, message: "Required parameters are driverId and orderId" });
    }
     
    await Assigned.findOneAndUpdate({ orderId,driverId }, { status:3 }, { new: true });
    await Order.findOneAndUpdate(
      { _id: orderId, "products.order_status": 2 },
      { $set: { "products.$.order_status": 4 } },
      { new: true }
    );
    
    res.status(200).json({
      result: true,
      message: "Your request was updated successfully"
    });
    
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: error.message
    });
  }
};



const  generateCustomer_otp=async(req,res)=>{
  try {
    const {orderId,user_mobile_no} = req.body;
    if (!orderId || !user_mobile_no) {
      return res.status(400).json({ result: false, message: "Required parameters are orderId,user_mobile_no" });
    }
     
    const otp=generate_otp();
    const updatedData=await Order.findByIdAndUpdate({_id:orderId},{customer_otp:otp},{new:true});
    res.status(200).json({
      result: true,
      message: "Customer otp generated successfully",
      data:updatedData
    });
    
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message
    });
  }

};



const  verifiedDelivery=async(req,res)=>{
  try {
    const {orderId,otp,driverId} = req.body;
    if (!orderId || !otp) {
      return res.status(400).json({ result: false, message: "Required parameters are orderId,otp,driverId" });
    }
     
    const matchData=await Order.findOne({_id:orderId,customer_otp:otp});
    if(!matchData){
      return res.status(400).json({"result":"false","message":"Invalid otp"});
    }
   await Order.findOneAndUpdate({
       _id: orderId, "products.order_status": 4},
      { $set: { "products.$.order_status": 6 } },
      { new: true }
    );

    await Assigned.findOneAndUpdate({orderId,driverId},{status:4},{new:true});

    res.status(200).json({
      result: true,
      message: "Otp verified successfully"
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message
    });
  }

};



const driverHomePage=async(req,res)=>{
  try {  
    const {driverId} = req.body; 
    if (!driverId) {
      return res.status(400).json({ "result": "false", "message": "required parameters are driverId" });
    }

    const deliveredCount = await Assigned.find({driverId,status:4}).countDocuments();
    const pendingCount = await Assigned.find({driverId,status:3}).countDocuments();
    const cancelCount = await Assigned.find({driverId,status:5}).countDocuments();
    const returnCount = await Assigned.find({driverId,status:6}).countDocuments();

    // earn driver
    const data=await Assigned.find({driverId,status:4}).populate('orderId');
    
      const total_delivery_charge = data.reduce((sum, item) => sum + item.orderId.delivery_charge, 0);
     let charge=Number(total_delivery_charge*.01).toFixed(2);
     let remaing_charge=Number(total_delivery_charge - charge);

     const withdrawnAmount =await Withdraw.find({driverId,withdraw_status:1});
     const withdrawn_amount= withdrawnAmount.reduce((sum, item) => sum + item.amount, 0);
     let balance=Number(remaing_charge - withdrawn_amount);

   // find pending withdraw amount 
     const pendingAmount =await Withdraw.find({driverId,withdraw_status:0});
     let Withdraw_Pending_amount=pendingAmount[0]?.amount || 0;

    const responseData={
      balance:balance || 0,
      delivereCash_collect:0,
      Withdraw_Pending_amount: Withdraw_Pending_amount ||0,
      deliveredCount:deliveredCount,
      pendingCount:pendingCount,
      cancelCount:cancelCount,
      returnCount:returnCount,
      withdrawn_amount:withdrawn_amount || 0


    }

    res.status(200).json({
      "result": "true",
      "message": "Home page data retrieved successfully",
      "data": responseData
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      "result": "false",
      "message": err.message
    });
  }

};


const orderCancel_byDriver=async(req,res)=>{
  try {
    const {driverId,orderId,message}=req.body;
    if(!driverId || !orderId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId,orderId,message"})
    }
     const objects={
      assigne_status:2,
      status:5,
      message,
     }

     const updatedData=await Assigned.findOneAndUpdate({orderId,driverId});
      if(!updatedData){
        return res.status(400).json({"result":"false","message":"OrderId and driverId does not match"})
      }
      await Assigned.findOneAndUpdate({orderId,driverId},objects,{new:true});
      await Order.findOneAndUpdate({_id:orderId},{status:0},{new:true});
      res.status(200).json({
        result: "true",
        message: "Order cancelled successfully"
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};



//withdraw request
const driverWithdraw_request=async(req,res)=>{
  try {
    const {driverId,amount,mobile_money_number}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId,amount,mobile_money_number"})
    }
     
     const findData=await Withdraw.findOne({driverId,status:0,withdraw_status:0});
      if(findData){
        return res.status(400).json({"result":"false","message":"You have allready send withdraw request"})
      }

      // earn driver
    const datas=await Assigned.find({driverId,status:4}).populate('orderId');
    
    const total_delivery_charge = datas.reduce((sum, item) => sum + item.orderId.delivery_charge, 0);
   let charge=Number(total_delivery_charge*.01).toFixed(2);
   let remaing_charge=Number(total_delivery_charge - charge);

   if(remaing_charge >= amount){
      const otp=generate_otp();
      await Driver.findOneAndUpdate({_id:driverId},{otp:otp},{new:true});
      const data={
        driverId:driverId,
        amount:amount,
        mobile_money_number:mobile_money_number,
        otp:otp
      }
      res.status(200).json({
        result: "true",
        message: "Request sent sucessfully",data:data
      });
    }else{
      return res.status(400).json({"result":"false","message":"You have not sufficient blance"})
    }
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};


const verifiedWithdrawRequest=async(req,res)=>{
  try {
    const {driverId,otp,amount,mobile_money_number}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId,otp,amount,mobile_money_number"})
    }
     
     const findData=await Driver.findOne({_id:driverId,otp:otp});
      if(!findData){
        return res.status(400).json({"result":"false","message":"Invalid otp"})
      }
      
      const transactionId=generate_transactionId();
      const newData=new Withdraw({driverId,amount,mobile_money_number,transactionId});
      const data=await newData.save();
      res.status(200).json({
        result: "true",
        message: "Request have done sucessfully",data:data
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};


const withdrawTranjection_history=async(req,res)=>{
  try {
    const {driverId}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId"})
    }
     
     const findData=await Withdraw.find({driverId});
      if(!findData){
        return res.status(400).json({"result":"false","message":"Record not found"})
      }
      res.status(200).json({
        result: "true",
        message: "Request sent sucessfully",data:findData
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }
};




//Chat section
/*------------------------user to store chat api------------------------- */
const driverSend_message=async(req,res)=>{
	const {text,venderId,driverId,send_status} = req.body;
	if(!send_status){
	  return res.status(400).json({"result":"false","message":"required parameter are venderId,driverId,text,send_status(1 for vender and 4 driver)"})
	};
  
	try {
	  if(!req.file){
	  const newMessage = new Chat({text,venderId,driverId,send_status});
	  await newMessage.save();
	  res.status(200).json({"result":"true","message":'Message sent successfully' });
	}else{
	  const Message = new Chat({venderId,driverId,send_status,text:req.file.filename});
	  await Message.save();
	  res.status(200).json({"result":"true","message":'Message sent successfully' });
	}
	} catch (error) {
	  console.log(error);
	  res.status(400).json({"message":error.mesage});
	}
  
  };
  
  

  


const driverChatList = async (req, res) => {
    const { driverId } = req.body;
    if (!driverId) {
        return res.status(400).json({ "result": "false", "message": "Required parameter driverId is missing" });
    }

    try {
        // Fetch messages sent by the user where send_status is 0 or 1
        const messages = await Chat.find({ 
          driverId:driverId,
			$or: [
				{ send_status: 1 },
				{ send_status: 4 },
			]
			
		}).populate('venderId').lean().sort({_id:-1});
		const firstData=await messages.map(item=>({
			ID:item.venderId._id,
			fname: item.venderId.firstName, 
            lname: item.venderId.lastName, 
            mobile_number: item.venderId.mobile_number,
            image: item.venderId.shop_logo, 
            text: item.text,
            status: item.status,
            send_status: item.send_status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
		}));

      
           // msgcount
		   const msgCount = {};
		   firstData.forEach(item => {
			  // Increment message count for venderId or friendId based on the current user's role
			  if (item.ID && item.status=="0" && item.send_status=="4") {
				const ID = item.ID.toString();
				msgCount[ID] = (msgCount[ID] || 0) + 1;
			}

		});

		// Merge firstData with msgCount
const mergedFirstData = firstData.map(item => ({
    ...item,
    msgCount: msgCount[item.ID] || 0 // Add message count to each item
}));
mergedFirstData.sort((a, b) => b.createdAt - a.createdAt);


// Create an object to store unique friendIds
const uniqueID = {};

// Filter the mergedMessages array
const filteredMessages = mergedFirstData.filter(item => {
    if (!uniqueID[item.ID]) {
        uniqueID[item.ID] = true;
        return true;
    }
    
    // If the friendId already exists, return false to exclude the item
    return false;
});

        if (filteredMessages.length > 0) {
            res.status(200).json({ "result": "true", "message": 'All chat list retrieved successfully',
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

  


const chatDetails_list=async(req,res)=>{
	const {venderId,driverId} = req.body;
	if(!venderId ){
	  return res.status(400).json({"result":"false","message":"required parameter are venderId and driverId"})
	};
  
	try {
	  
    await Chat.updateMany(
      {
        venderId: venderId,
        driverId: driverId,
        send_status: 4,
        status: 0
      },
      { $set: { status: 1 } },
      { new: true }
    );

    const messages = await Chat.find({
      venderId,driverId,
      $or:[
        {send_status:1},
        {send_status:4}
      ]
    });


	  if(messages.length>0){
		res.status(200).json({"result":"true","message":'Vendor messages list get sucessfully',data:messages });
	  }else{
		res.status(400).json({"result":"false","message":'Data does not found'});
	  }
	
	
	  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({"message": error.mesage});
	}
  
  };
  

const emergancyContact_list=async(req,res)=>{
	try {
	  
    const contactList = await Emergancy_support.find({status:1});
	  if(contactList.length>0){
		res.status(200).json({"result":"true","message":'contactList get sucessfully',data:contactList });
	  }else{
		res.status(400).json({"result":"false","message":'Data does not found'});
	  }
	
	  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({"message": error.mesage});
	}

};
  



const term_and_pulicy=async(req,res)=>{
  try {
	  
    const termList = await Term.find({type:3});
	  if(termList.length>0){
		res.status(200).json({"result":"true","message":'Term list get sucessfully',data:termList });
	  }else{
		res.status(400).json({"result":"false","message":'Data does not found'});
	  }
	
	  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({"message": error.mesage});
	}

};




const earningStatement=async(req,res)=>{
  try {
    const {driverId}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId"})
    }
     
     const findData=await Assigned.find({driverId,status:4}).populate('orderId').sort({_id:-1});
      if(!findData){
        return res.status(400).json({"result":"false","message":"Record not found"})
      }
      const data=findData.map(item=>({
           driverId:item.driverId,
           assignedId:item._id,
           orderId:item.orderId.orderId,
           earn_amount:(item.orderId.delivery_charge - item.orderId.delivery_charge*0.01).toFixed(2),
           paymentMode:"BY Cash",
           date:item.updatedAt,

      }));
      res.status(200).json({
        result: "true",
        message: "Response got sucessfully",data:data
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};




const earningStatement_details=async(req,res)=>{
  try {
    const {driverId,assignedId}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId,assignedId"})
    }
     
     const findData=await Assigned.find({_id:assignedId,driverId}).populate('orderId').sort({_id:-1});
      if(!findData){
        return res.status(400).json({"result":"false","message":"Record not found"})
      }
      
      res.status(200).json({
        result: "true",
        message: "Response got sucessfully",data:findData
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};




const filter_earningStatement = async (req, res) => {
  try {
    const { driverId, status } = req.body;
    if (!driverId) {
      return res.status(400).json({
        result: "false",
        message: "required parameters are driverId,status (1 for today, 2 for weekly, and 3 for monthly)"
      });
    }

    let startDate, endDate;
    const today = new Date();
    
    if (status === "1") {
      // For today
      startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);
    } else if (status === "2") {
      // For the past week
      startDate = new Date();
      startDate.setUTCDate(today.getUTCDate() - 7);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);
    } else if (status === "3") {
      // For the past month
      startDate = new Date();
      startDate.setUTCMonth(today.getUTCMonth() - 1);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ result: "false", message: "Record not found" });
    }

    const findData = await Assigned.find({
      driverId: driverId,status:4,
      updatedAt: { $gte: startDate, $lt: endDate }
    })
    .populate('orderId')
    .sort({ _id: -1 });

    const data = findData.map(item => ({
      driverId: item.driverId,
      assignedId: item._id,
      orderId: item.orderId.orderId,
      earn_amount: (item.orderId.delivery_charge - item.orderId.delivery_charge * 0.01).toFixed(2),
      paymentMode: "BY Cash",
      date: item.updatedAt,
    }));

    res.status(200).json({
      result: "true",
      message: "Response got successfully",
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }
};



//Notification list
const notification_list=async(req,res)=>{
  try {
    const {driverId}=req.body;
    if(!driverId){
      return res.status(400).json({"result":"false","message":"required parameters are driverId"})
    }
     
     const findData=await Notification.find({driverId}).sort({_id:-1});
      if(!findData || findData.length==0){
        return res.status(400).json({"result":"false","message":"Record not found"})
      }
      
      res.status(200).json({
        result: "true",
        message: "Response got sucessfully",data:findData
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};



//Notification list
const contactus_list=async(req,res)=>{
  try {
    
     const findData=await Contact.find({});
      if(!findData || findData.length==0){
        return res.status(400).json({"result":"false","message":"Record not found"})
      }
      
      res.status(200).json({
        result: "true",
        message: "Response got sucessfully",data:findData
      });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      message: error.message
    });
  }

};




//export module
module.exports={
  driverSignup,
  Verifyotp,
  createPassword,
  ResendOtp,
  driver_login,
  forgotPassword,
  verifyEmail_andMobile,
  resetPassword,
  updateDriver_data,
  getDriverData,
  updatePhone,
  updateEmail,
  deleteDriver,
  verifyPhone,
  driverStatus,
  get_order_list,
  assingedDriver,
  filterOrder_list,
  acceptOrder_details,
  orderPicked_up,
  generateCustomer_otp,
  verifiedDelivery,
  driverHomePage,
  orderCancel_byDriver,
 driverWithdraw_request,
 verifiedWithdrawRequest,
 withdrawTranjection_history,
 driverSend_message,
 driverChatList,
 chatDetails_list,
 emergancyContact_list,
term_and_pulicy,
earningStatement,
earningStatement_details,
filter_earningStatement,
notification_list,
contactus_list,

};



