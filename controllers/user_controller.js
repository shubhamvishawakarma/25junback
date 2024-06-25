/*.........import models............*/
const User = require("../models/user_models");
const Banner = require("../models/banner_models");
const About = require("../models/about_us_models");
const Term = require("../models/term_and_condiction_models");
const Faq = require("../models/faq_models");
const Contact = require("../models/contact_us_models");
const Privacy = require("../models/privacy_pulicy_models");
const User_Address = require("../models/user_address_models");
const Subcategory = require("../models/subcategory_models");
const Category = require("../models/category_models");
const Like = require("../models/like_models");
const Rating = require("../models/rating_models");
const Product = require("../models/products_models");
const Sub_subcategory = require("../models/sub_subcategory_models");
const Maincategory=require("../models/main_category");
const Shoprating=require("../models/shop_rating");
const Cart=require("../models/cart");
const Checkout=require("../models/checkout");
const Charge=require("../models/charges");
const Order=require("../models/order");
const Viewsproduct=require("../models/views_product");
const Vender=require("../models/vender_models");
const Viewshops=require("../models/view_shops");
const Shopfavourite=require("../models/favourite_shop");
const Inntoutcart=require("../models/innout_cart");
const Innt_rating = require("../models/innt_rating");
const Returnorder=require("../models/return_order");
const Gift=require("../models/gift");
const Suggestion=require("../models/user_suggestion");
const Report_product=require("../models/report_product");
const Friend=require("../models/friends");
const userQuery=require("../models/user_query");
const Transjection=require("../models/transjection");
const Chat=require("../models/chat");
const Promotion=require("../models/vender_promotion_models");
const Driver=require("../models/driver_models");
const Refferal=require("../models/refferal");
const User_delete=require("../models/user_delete");

/*............import dependancies................*/
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");


/*.................make function and user it........*/
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



function generateRandomNumber() {
	const characters = '0123456789';
	const length = 16;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;

}


function generateFriendQrcode() {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const length = 250;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;
}


function generatePaymentQrcode() {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const length = 250;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;

}



function generateOrderQrcode() {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const length = 50;
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(index);
	}

	return randomString;

}



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



/*........................CREATE API................*/

/*...................create user signup api..........*/
const userSignup_api = async (req, res) => {
	try {
		const { dob, first_name,payment_qrcode,friend_qrcode, last_name, mobile_number, email, password, conform_password, friend_referral_code, fcm_id } = req.body;
		const user_profile = req.file ? req.file.filename : " ";
		if (!first_name || !last_name || !mobile_number || !password || !conform_password || !fcm_id) {
			return res.status(400).json({ "result": "false", "message": "required parameters are first_name,last_name,mobile_number,password,conform_password,fcm_id and user_profile,friend_referral_code and email are optional" });
		}

		const exist_user = await User.findOne({mobile_number,status:1});
		if (exist_user) {
			return res.status(400).json({ "result": "false", "message": "User allready exist" });
		}
		if (password !== conform_password) {
			return res.status(400).json({ "result": "false", "message": "Passwords do not match." });
		}


		const existUser = await User.findOne({ mobile_number });
		const otps = generate_otp();
		const hashedPasswords = await bcrypt.hash(password, 10);
        const userName = first_name + last_name + otps;
		

		let objects;
		
		if (req.file) {
			objects = {
				first_name,
				dob,
				userName,
				last_name,
				mobile_number,
				email,
				password: hashedPasswords,
				user_profile,
				otp: otps,
				
			};
		} else {
			objects = {
				first_name,
				dob,
				last_name,
				mobile_number,
				email,
				userName,
				password: hashedPasswords,
				otp: otps,
				
			};
		}
		
		if (existUser) {
			const userData = await User.findOneAndUpdate({ mobile_number }, objects, { new: true });
			return res.status(200).json({ "result": "ture", "message": "Otp generated successfully", data: userData });
		} else {

			
		const otp = generate_otp();
		const user_referral_codes = generateRandomString();
		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(password, 10);
		const friend_qrcodes=generateFriendQrcode();
		const payment_qrcodes=generatePaymentQrcode();

		const objectData = {
			first_name, dob, last_name, mobile_number, email,userName,
			password: hashedPassword,user_profile, otp: otp,
			friend_qrcode:friend_qrcodes,
			payment_qrcode:payment_qrcodes,
			user_referral_code:user_referral_codes, wallet: 10,referTo_earn:10
		};

        const object = {
			first_name, dob, last_name, mobile_number,userName, email,
			password: hashedPassword,user_profile, otp: otp,
			user_referral_code:user_referral_codes,
			friend_qrcode:friend_qrcodes,
			payment_qrcode:payment_qrcodes,
		};

		if (req.file) {
			objectData.user_profile = req.file.filename;
		}

		//update loyality point to refferal code
		const data = await User.findOne({"user_referral_code": friend_referral_code });
		if (!data) {
			const user_data = new User(object);
			const Data = await user_data.save();
			res.status(200).json({ "result": "true", "message": "User inserted sucessfully", data:Data });


		} else {
			const points = data.referTo_earn;
			const total_earn = Number(points + 10);
			const wallet = Number(data.wallet + total_earn);
		const users_data= await User.findOneAndUpdate({
				"user_referral_code": friend_referral_code
			},
				{ referTo_earn: total_earn, wallet: wallet },
				{ new: true });
			const user_data = new User(objectData);
			const dinu = await user_data.save();
			const dinesh=await User.findOne({user_referral_code:user_referral_codes});
			const insertRefferal_money=new Refferal({friendId:users_data._id,amount:10,userId:dinesh._id});
			await insertRefferal_money.save();
			res.status(200).json({ "result": "true", "message": "Otp generated sucessfully", data:dinu });

		}

			
		}
		


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};









/*................user_login.................*/
const userLogin_api = async (req, res) => {
	try {
		const { mobile_number, password,fcm_id} = req.body;
		if (!password) {
			res.status(400).json({ "result": "false", "message": "required parameters are password and any one parameter required is fcm_id in both them(mobile_number,email)" })
		} else {
			const Data = await User.findOne({ $or: [{ mobile_number: mobile_number }, { email: mobile_number }] });
			if (!Data) {
				res.status(400).json({ "result": "false", "message": "You are not register" });
			} else {
				const matchData = await User.findOne({ $or: [{ mobile_number: mobile_number }, { email: mobile_number }],status:1 });
				
				if (!matchData) {
					res.status(400).json({
						"result": "false",
						"message": "Please verify your mobile number",
						data:Data
					});
				}
				else if(matchData.user_status===1){
					res.status(400).json({
						"result": "false",
						"message": "Your account has been blocked"
					});

				}else if(matchData.user_status===2){
					res.status(400).json({
						"result": "false",
						"message": "Your account has been deleted"
					});
				}
				 else {
					await User.findOneAndUpdate({_id:matchData._id},{fcm_id:fcm_id},{new:true});
					// Match password
					const passwordMatch = await bcrypt.compare(password, matchData.password);
                    //generate token
                const token = jwt.sign({ userId:matchData._id, email: matchData.email, mobile_number: matchData.mobile_number }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });
					if (passwordMatch) {
						res.status(200).json({
							"result": "true",
							"message": "User signed successfully",
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






/*.....................Resend Otp............*/
const resendOtp = async (req, res) => {
	try {
		const { mobile_number, email, choose_status } = req.body;

		if (!choose_status) {
			return res.status(400).json({ "result": "false", "message": "Required parameters are mobile_number and choose_status,email (1 for SMS and 2 for email)" });
		} else {
			if (choose_status == 1) {
				const matchData = await User.findOne({ mobile_number });

				if (!matchData) {
					return res.status(400).json({ "result": "false", "message": "Mobile number does not match" });
				} else {
					const otp = generate_otp();
					const updatedData = await User.findOneAndUpdate({ mobile_number }, { $set: {otp:otp} }, { new: true });
					res.status(200).json({ "result": "true", "message": "OTP sent successfully", data: updatedData });
				}

			} else {
				if(!email){
					res.status(400).json({ "result": "false", "message": "email is required" });
				}else{
				const matchDatas = await User.findOne({email:email});
				if (!matchDatas) {
					res.status(400).json({ "result": "false", "message": "Email is empty" });
				} else {
					
					const Otp = generate_otp();
					const updatedDatas = await User.findOneAndUpdate({email}, { $set: {otp:Otp} }, { new: true });
					res.status(200).json({ "result": "true", "message": "OTP sent successfully", data: updatedDatas });
					}
				}

			}
		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};







/*...................verify otp.............*/
const verifyOtp = async (req, res) => {
	try {
		const {mobile_number,otp } = req.body;
		if (!mobile_number || !otp) {
			res.status(400).json({ "result": "false", "message": "required parameters are mobile_number,otp" });

		} else {
			const findData = await User.findOne({mobile_number});
			if (!findData) {
				res.status(400).json({ "result": "false", "message": "You are not register" });
			} else {
				const Data = await User.findOne({ mobile_number,otp});
				if (Data) {
					const updatedData = await User.findOneAndUpdate({ mobile_number},{status:1},{new:true});
					//generate token
					const token = jwt.sign({ userId: Data._id, email: Data.email, mobile_number: Data.mobile_number }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });
					res.status(200).json({ "result": "true", "message": "Otp verified sucessfully", data: Data, token });
				} else {
					res.status(400).json({ "result": "false", "message": "Invalid OTP" });
				}
			}

		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};





/*................ForgotPassword....................*/
const forgotPassword = async (req, res) => {
	const { mobile_number } = req.body;
	if (!mobile_number) {
		res.status(400).json({ "result": "false", "message": "required parameters mobile_number and any one required parameter in both them(email,mobile_number)" });
	};
	try {
		const data = await User.findOne({ $or: [{ mobile_number: mobile_number }, { email: mobile_number }] });
		if (data) {
			const otp = generate_otp();
			const Data = await User.findOneAndUpdate({ $or: [{ mobile_number: mobile_number }, { email: mobile_number }] }, { $set: { otp: otp } }, { new: true });
			res.status(200).json({ "result": "true", "message": "Otp send sucessfully", data: Data });
		}
		else {
			res.status(400).json({ "result": "false", "message": "Please send correct email and mobile_number" })
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
		const data = await User.findOne({ $or: [{ mobile_number: key }, { email: key }], otp: otp });
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
		await User.findOneAndUpdate({ $or: [{ mobile_number: key }, { email: key }] }, { $set: { password: hashedPassword } }, { new: true });
		res.status(200).json({ 'result': "true", "message": "Password reset sucessfully" })

	} catch (err) {
		console.log(err.mesage)
	}


};





/*...................update userProfile............*/
const updateUser_profile = async (req, res) => {
	try {
		const {first_name, gender, mobile_number, email, last_name, dob, userId } = req.body;
		const user_profile = req.file ? req.file.filename : null;

		if (!userId) {
			return res.status(400).json({
				"result": "false",
				"message": "required parameter is userId and optional parameters are first_name,last_name,mobile_number,email,gender,dob,user_profile"
			});
		}

		const matchData = await User.findOne({ _id: userId });
		if (!matchData) {
			return res.status(400).json({
				"result": "false",
				"message": "User does not exist"
			});
		}

		const Otp = generate_otp();
		let updateData = {
			otp: Otp
		};

		// Collect new data only if provided
		if (first_name){
			first_name;
		} 
		if (last_name){
			last_name;
		}
		if (gender){
			gender;
		} 
		if (mobile_number) {
			mobile_number
		}
		if (email){  
			email;

		}
		if (dob){
			 dob
			}
		if (user_profile) 
			{ user_profile

			}

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: userId },
			updateData,
			{ new: true }
		);

		if(req.file){
			user_profile:req.file.filename
		}

		if (!updatedUser) {
			return res.status(500).json({
				"result": "false",
				"message": "Failed to update user"
			});
		}

		const responseData = {
			userId: updatedUser._id,
			first_name: updatedUser.first_name,
			last_name: updatedUser.last_name,
			gender: updatedUser.gender,
			mobile_number: updatedUser.mobile_number,
			email: updatedUser.email,
			dob: updatedUser.dob,
			user_profile: updatedUser.user_profile,
			otp: updatedUser.otp,
			newfirst_name: first_name || " ",
			newlast_name: last_name || " ",
			newgender: gender || " ",
			newmobile_number: mobile_number || " ",
			newemail: email || " ",
			newdob: dob || " ",
			newuser_profile: user_profile || " "
		};

		res.status(200).json({ "result": "true", "message": "Otp generated sucessfully", updateData: responseData });
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};






/*................getUser_profile................*/
const getUser_profile = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) {
			res.status(400).json({ "result": "false", "message": "required parameter userId" });
		} else {
			const matchData = await User.findOne({ _id: userId });
			if (matchData) {
				const data = {
					userId: matchData._id,
					email: matchData.email,
					userName: matchData.userName,
					mobile_number: matchData.mobile_number,
					first_name: matchData.first_name,
					last_name: matchData.last_name,
					dob: matchData.dob,
					user_profile: matchData.user_profile,
					friend_qrcode: matchData.friend_qrcode,
					payment_qrcode: matchData.payment_qrcode,
					createdAt:matchData.createdAt,
					wallet:matchData.wallet,
					loyalty_point:matchData.loyalty_point,
					gender:matchData.gender,
				};
				res.status(200).json({
					"result": "true",
					"message": "user profile data are",
					"path": "http://103.104.74.215:3037/uploads/",
					data: [data]
				})

			} else {
				res.status(400).json({ "result": "false", "message": "User does not found" })
			}

		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




/*....................Banner list.............*/
const banner_list = async (req, res) => {
	try {
		const matchData = await Banner.find({banner_type:"Innt header banner",active_status:0});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "Banner list are",
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



const inntFooterbanner_list = async (req, res) => {
	try {
		const matchData = await Banner.find({banner_type:"Innt footer banner",active_status:0});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "Banner list are",
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



const inntOutFooterbanner_list = async (req, res) => {
	try {
		const matchData = await Banner.find({banner_type:"InntOut footer banner",active_status:0});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "Banner list are",
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




const inntOutHeaderbanner_list = async (req, res) => {
	try {
		const matchData = await Banner.find({banner_type:"InntOut header banner",active_status:0});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "Banner list are",
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





/*....................About_us_list.............*/
const About_us_list = async (req, res) => {
	try {
		const matchData = await About.find({});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "about us  list are",
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



/*....................term and condiction list.............*/
const term_and_condiction_list = async (req, res) => {
	try {
		const matchData = await Term.find({type:1});
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





/*....................term and condiction list.............*/
const pulicy_list = async (req, res) => {
	try {
		const matchData = await Privacy.find({type:1});
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





/*....................term and condiction list.............*/
const faq_list = async (req, res) => {
	try {
		const matchData = await Faq.find({});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "faq list are",
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





/*....................contact_us list.............*/
const contactUs_list = async (req, res) => {
	try {
		const matchData = await Contact.find({});
		if (matchData) {
			res.status(200).json({
				"result": "true",
				"message": "contact us list are",
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



//Add user address api
const AddUserAddress = async (req, res) => {
	try {
		const { place_type, state, village_name,longitude,latitude, pin_code, building_no, city_name, landmark, userId } = req.body;
		if (!userId) {
		return	res.status(400).json({ "result": "false", "message": "required parameters is  userId and optional are place_type, state,village_name,pin_code,building_no,city_name,landmark,longitude,latitude" })
		}
		
		const data =await User_Address.findOne({userId});
		if(!data){
			const insertData = new User_Address({
				place_type,
				state,
				village_name,
				pin_code,
				building_no,
				city_name,
				landmark,
				userId,
				status:1,
				location: {
					type: "Point",
					  coordinates: [parseFloat(longitude), parseFloat(latitude)],
					},
			})
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "data inserted sucessfully", data: data });
		}
		
		else {
			const insertData = new User_Address({
				place_type,
				state,
				village_name,
				pin_code,
				building_no,
				city_name,
				landmark,
				userId,
				location: {
					type: "Point",
					  coordinates: [parseFloat(longitude), parseFloat(latitude)],
					},
			})
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "data inserted sucessfully", data: data });
		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};





// update user address 
const Update_address = async (req, res) => {
	try {
		const { place_type, state, village_name, pin_code, building_no, city_name, landmark, userId, addressId } = req.body;
		if (!addressId || !place_type || !state || !village_name || !latitude || !pin_code || !city_name || !userId) {
			res.status(400).json({ "result": "false", "message": "required parameters are place_type,state,village_name,longitude,latitude,pin_code,building_no,city_name,landmark,userId,addressId" })
		} else {
			const updatedData = {
				place_type,
				state,
				village_name,
				pin_code,
				building_no,
				city_name,
				landmark,
				location: {
					type: "Point",
					  coordinates: [parseFloat(longitude), parseFloat(latitude)],
					},
			}
			const data = await User_Address.findByIdAndUpdate({ _id: addressId, userId: userId }, updatedData, { new: true });
			res.status(200).json({ "result": "true", "message": "data updated sucussfully", data: data });
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};






// delete address
const Delete_address = async (req, res) => {
	try {
		const { userId, addressId } = req.body;
		if (!userId || !addressId) {
			res.status(400).json({ "result": "false", "message": "required parmaters are addressId,userId" });
		} else {
			const matchData = await User_Address.findOne({ _id: addressId, userId: userId });
			if (!matchData) {
				res.status(400).json({ "result": "false", "message": "Address does not found" })
			} else {
				const data = await User_Address.findOneAndDelete({ _id: addressId, userId: userId });
				res.status(200).json({ "result": "false", "message": "Addrress deleted sucessfully" })
			}

		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



//get address api
const Get_address = async (req, res) => {

	try {
		const { userId } = req.body;
		if (!userId) {
			res.status(400).json({ "result": "false", "message": "required parmaters are userId" });
		} else {
			const matchData = await User_Address.find({ userId: userId });
			if (!matchData) {
				res.status(400).json({ "result": "false", "message": "Address does not found" })
			}
			const data = await User_Address.find({ userId: userId });
			res.status(200).json({ "result": "ture", "message": "Addrress list are ", data: data })
		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



// Innt category list api
const InntCategory_list = async (req, res) => {
	try {
		const {maincategoryId}=req.body;
		if (!maincategoryId) {
			return res.status(400).json({ "result": "false", "message": "require paramter ismaincategoryId" })
		} 
		
		const data = await Category.find({ maincategoryId: maincategoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Data does not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "Category list are", data: data })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



// Innt out category _list api
const InntoutCategory_list = async (req, res) => {
	try {
		const data = await Maincategory.find({ });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Data does not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "Category list are", data: data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });
	}

};





// subcategory list api
const subCategory_list = async (req, res) => {
	try {
		const { categoryId } = req.body;
		if (!categoryId) {
			res.status(400).json({ "result": "false", "message": "require parameters are categoryId" })
		} else {
			const data = await Subcategory.find({ categoryId });
			if (!data) {
				res.status(400).json({ "result": "false", "message": "Data does not found" })
			} else {
				res.status(200).json({ "result": "true", "message": "subCategory list are", data: data })
			}
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



// product like dislike api
const like_dislike_product_api = async (req, res) => {
	const { productId, userId } = req.body;

	if (!productId || !userId) {
		return res.status(400).json({ result: "false", message: "Required parameters are userId and productId" });
	}

	try {
		let findData = await Like.findOne({ userId: userId, productId });

		if (findData) {
			if (findData.like_status === 1) {
				await Like.findOneAndUpdate({ userId: userId, productId }, { $set: { like_status: 0 } }, { new: true });
				res.status(200).json({ result: "true", message: "Product disliked successfully" });
			} else {
				await Like.findOneAndUpdate({ userId: userId, productId }, { $set: { like_status: 1 } }, { new: true });
				res.status(200).json({ result: "true", message: "Product liked successfully" });
				
			}
		} else {
			// If no record is found, insert a new one with like_status as 1
			const insertData = new Like({ userId, productId, like_status: 1 });
			const data = await insertData.save();
			res.status(200).json({ result: "true", message: "Product liked successfully" });
	
		}

	} catch (err) {
		console.error(err);
		res.status(500).json({ result: "false", message: err.message });
	}
};



// like product list api
const likeProduct_listApi = async (req, res) => {
	const { userId } = req.body;
	if (!userId) {
		res.status(400).json({ "result": "false", "message": "required parameter are userId" });
	}

	try {
		const data = await Like.find({ userId: userId,like_status:1 }).populate('productId');
		if (!data) {
			res.send("data does not found")
		} else {
			let venderID = [];
             data.forEach(item => {
				venderID.push(item.productId.venderId);
           });
		   
		   const shopList = await Vender.find({ _id: { $in: venderID } });
		   const shopDataMap = {};
        shopList.forEach(item => {
            shopDataMap[item._id.toString()] = {
				venderId: item._id,
                shopname: item.shop_name,
                firstName: item.firstName,
                lastName: item.lastName,
                shop_address: item.shop_address,
                image: item.upload_frontId
            };
        });

        
        const mergedData = data.map(item => ({
            ...item.toObject(),  // Convert Mongoose document to plain JavaScript object
            shopInfo: shopDataMap[item.productId.venderId.toString()]  // Get shop information using vendor ID
        }));

        console.log(mergedData);

			res.status(200).json({ "result": "true", "message": "Product liked data list are ", data: mergedData  })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};





// giving rating api 
const givingRating_api = async (req, res) => {
	const { userId,venderId, productId, rating,comment } = req.body;
	if (!userId || !productId || !rating) {
		res.status(400).json({ "result": "false", "message": "required parameters are userId,venderId,productId,rating and comment is optional" });

	};

	try {
		const data = await Rating.findOne({ userId: userId, productId: productId });
		if (data) {
			await Rating.findOneAndUpdate({ userId, productId }, { $set: { rating,comment } }, { new: true });
			 // calculate rating
			 const raters=await Rating.find({productId}).countDocuments();
			 const rater=await Rating.find({productId});
			const totalRating = (rater && rater.length > 0)
			? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;
			const average_ratings= Number(totalRating / raters).toFixed(1);
			await Product.findOneAndUpdate({_id:productId},{rating:average_ratings},{new:true});
			res.status(200).json({ "result": "true", "message": "data updated sucessfully" })

		} else {
			const insertData = new Rating({ userId, productId,venderId,rating,comment });
			await insertData.save();
			   
        // calculate rating
        const raters=await Rating.find({productId}).countDocuments();
        const rater=await Rating.find({productId});

       const totalRating = (rater && rater.length > 0)
       ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

       const average_ratings= Number(totalRating / raters).toFixed(1);
	   await Product.findOneAndUpdate({_id:productId},{rating:average_ratings},{new:true});
			res.status(200).json({ "result": "true", "message": "User added rating sucessfully" })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};





//create user login api with socical medial application
const userLogin_withSocicalMedia = async (req, res) => {
	try {
		const { mobile_number, fcm_id, socical_media_id, userName, email } = req.body;
		const { user_profile } = req.file ? req.file.filename : {};
		if (!socical_media_id) {
			res.status(400).json({ "result": "false", "message": "required parameters are socical_media_id,fcm_id and optional parameters are (mobile_number,email and userName,user_profile)" })
		} else {
			const insertData = new User({ mobile_number, fcm_id, socical_media_id, userName, email, user_profile });
			const data = await insertData.save();
			if (data) {
				//generate token
				const token = jwt.sign({ userId: data._id, email: data.email, mobile_number: data.mobile_number }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '730d' });
				res.status(200).json({
					"result": "true",
					"message": "User login successful",
					data: insertData, token
				});
			} else {
				res.status(400).json({
					"result": "false",
					"message": "You doing something wrong"
				});
			}
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



//categoryBase_productList api 
const sub_subcategoryBase_productList = async (req, res) => {
	try {
		const { sub_subcategoryId } = req.body;
		if (!sub_subcategoryId) {
			return res.status(400).json({ "result": "false", "message": "required parameter are sub_subcategoryId" })
		}
		const productList = await Product.find({ sub_subcategoryId: sub_subcategoryId });
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};





const productDetails = async (req, res) => {
	try {
	  const { productId,userId,shopId,lat,lon} = req.body;
	  if (!productId || !shopId) {
		return res.status(400).json({ "result": "false", "message": "required parameter is productId,shopId,lat,lon and userId optional" })
	  }

      
//calculate time and distance b/w user and shop
const shop=await Vender.findOne({_id:shopId});
const storeLat = shop.location.coordinates[1];
const storeLon = shop.location.coordinates[0];
 const distance = calculateDistance(lat, lon, storeLat, storeLon).toFixed(1);
const coveruserandshop_distance_timing=Number(distance*10);

// calulate time and distance neares deliverboy and shop
const deliveryBoys = await Driver.find();
        if (deliveryBoys.length === 0) {
            return res.status(404).json({ error: 'No delivery boys found' });
        }

        let nearestBoy = null;
        let minDistance = Infinity;
        var latitude= 22.7196 ; //deliveryBoys.geo_location.coordinates[0];
		var  longitude= 75.8577; //deliveryBoys.geo_location.coordinates[1];
        deliveryBoys.forEach(boy => {
            const distance = calculateDistance(storeLat, storeLon, latitude, longitude);
            if (distance < minDistance) {
                minDistance = distance;
            }
        });
         const mindist=minDistance.toFixed(1)
		const covermindistance_time=Number(mindist*10);


  // calculate delivery__time
  const productLists = await Product.findOne({ _id:productId })
  const times = productLists.productPreparation_time;
  const time = times.replace(/\D+/g, '');


  // calculate shop distance  to user distance
   const delivery__times=Number(time) + Number(coveruserandshop_distance_timing) + Number(covermindistance_time);


    // Get the current time
    const now = new Date();
    const currentTime = new Date(now);

    // Add the calculated delivery time to the current time
    now.setMinutes(now.getMinutes() + delivery__times);

    // Calculate the time difference
    const timeDifference = now - currentTime;

    // Convert the time difference to days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Format the new time as a human-readable string
    let formattedTimeDifference = '';
    if (days > 0) {
        formattedTimeDifference += `${days} days `;
    }
    if (hours > 0 || days > 0) {
        formattedTimeDifference += `${hours} hours `;
    }
    formattedTimeDifference += `${minutes} minutes `;

    // Convert the final delivery time to 12-hour format
    let finalHours = now.getHours();
    let finalMinutes = now.getMinutes();
    const ampm = finalHours >= 12 ? 'PM' : 'AM';
    finalHours = finalHours % 12;
    finalHours = finalHours ? finalHours : 12; // The hour '0' should be '12'
    finalMinutes = finalMinutes < 10 ? '0' + finalMinutes : finalMinutes; // Add leading zero if needed
    const formattedFinalTime = finalHours + ':' + finalMinutes + ' ' + ampm;

    console.log(`Time difference: ${formattedTimeDifference}`);


	// calculate delivery charge
	const delivery_charge_value=Number(distance*0.9).toFixed(2);


	  if(userId){
	  
      const likeData=await Like.findOne({userId,productId,like_status:1});
	  const like=likeData?likeData.like_status:0;
	 
	  const productList = await Product.find({ _id:productId }).populate('venderId');
	  const raters=await Shoprating.find({shopId}).countDocuments();
	  const products=await Product.find({venderId:shopId}).countDocuments();
	  const rater=await Shoprating.find({shopId});

      const totalRating = (rater && rater.length > 0)
  ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

      const average_ratings= Number(totalRating / raters);
	  
const pro = await Product.find({ venderId: shopId });
const productid = pro.map(item => ({
productID: item._id
}));

let likeDatas = 0;
for (const product of productid) {
const count = await Like.find({ productId: product.productID, like_status: 1 }).countDocuments();
likeDatas += count;
}

 
  const views=await Viewshops.find({shopId}).countDocuments();
  const matchData = await Order.find({ shopId: shopId});
  
const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);


//const reviews list
const pratingCount=await Rating.find({productId:productId}).countDocuments();
const reviewsList=await Rating.find({productId:productId}).populate('userId');
const reviews_list=await reviewsList.map(item=>({
  rating:item.rating,
  comment:item.comment,
  user_namef:item.userId.first_name,
  user_namel:item.userId.last_name,
  user_image:item.userId.user_profile
}))

//const reviews list
const shopProductList=await Product.find({venderId:shopId,}).limit(50);
const moreproducts=await shopProductList.map(item=>({
  image:item.image1,
  productId:item._id,
  shopId:item.venderId,
 
}))


const userCart = await Cart.findOne({
	userId: new mongoose.Types.ObjectId(userId),
	booking_status: 0
  }, { 'products.productId': 1 }).lean();
  
  let cart = 0;
  
  if (userCart && userCart.products) {
	const matchingProduct = userCart.products.find(product => product.productId.toString() === productId.toString());
	if (matchingProduct) {
	  cart = 1;
	}
  }
  




	  if (productList && productList.length > 0) {
		const data = productList.map(item => ({
		 productId: item._id,
		  categoryId: item.categoryId,
		  venderId: item.venderId._id,
		  product_name: item.product_name,
		  description: item.description,
		  images: [item.image1, item.image2, item.image3, item.image4, item.image5,item.video].filter(image => typeof image === 'string' && image !== null),
		  product_code: item.product_code,
		  productType:item.productType,
		  productSize:item.productSize,
		  productPreparation_time:item.productPreparation_time,
		  mrp_price: item.unit_price,
		  sale_price: item.sale_price,
		  discount: item.discount[0].discount_value,
		  discountType: item.discount[0].discount_type,
		  product_details: item.product_details,
		  brand_name: item.brand_name,
		  like_status:like,
		  rating:item.rating,
		  total_rating:pratingCount || 0,
		  cart_status: cart,
		  qty: 0,
		  attributes:item.product_variation,
		  quantity: item.quantity,
		  warranty:item.warranty,
		  note:item.note,
		  returnType:item.returnType,
		  stock:item.stock,
		  Tax:item.Tax,
		  product_weight:item.product_weight,
		  deliveryType:item.deliveryType,
		  minimum_order:item.minimum_order,
		  shop_logo:item.venderId.shop_logo,
		  shop_address:item.venderId.shop_address,
		  shop_country:item.venderId.country,
		  shop_city:item.venderId.city,
		  shop_name:item.venderId.shop_name,
		  total_product:products || 0,
		  total_sale:sales || 0,
		  total_rater:raters || 0,
		  average_rating:average_ratings || 0,
		  delivery_fee:delivery_charge_value || 0,
		  delivery__time:formattedTimeDifference || 0,
		  liked__time:likeDatas || 0,
		  page__views:views|| 0,
		  reviews_list:reviews_list,
		  moreproducts:moreproducts,
		  
		}));
       



		res.status(200).json({ "result": "true", "message": "product data get successfully", data:data })
	  } else {
		res.status(400).json({ "result": "false", "message": "Records not found" })
	  }
	}else{

		const productList = await Product.find({ _id: productId }).populate('venderId');
		const raters=await Shoprating.find({shopId}).countDocuments();
		const products=await Product.find({venderId:shopId}).countDocuments();
		const rater=await Shoprating.find({shopId});
  
		const totalRating = (rater && rater.length > 0)
	? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;
  
		const average_ratings= Number(totalRating / raters);


		
const pro = await Product.find({ venderId: shopId });
const productid = pro.map(item => ({
productID: item._id
}));

let likeDatas = 0;
for (const product of productid) {
const count = await Like.find({ productId: product.productID, like_status: 1 }).countDocuments();
likeDatas += count;
}

 
  const views=await Viewshops.find({shopId}).countDocuments();
  const matchData = await Order.find({ shopId: shopId});
  
const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);


//const reviews list
const pratingCount=await Rating.find({productId:productId}).countDocuments();
const reviewsList=await Rating.find({productId:productId}).populate('userId');
const reviews_list=await reviewsList.map(item=>({
  rating:item.rating,
  comment:item.comment,
  user_namef:item.userId.first_name,
  user_namel:item.userId.last_name,
  user_image:item.userId.user_profile
}))

//const reviews list
const shopProductList=await Product.find({venderId:shopId,}).limit(50);
const moreproducts=await shopProductList.map(item=>({
  image:item.image1,
  productId:item._id,
  shopId:item.venderId
}))


		
  
		if (productList && productList.length > 0) {
		  const data = productList.map(item => ({
			productId: item._id,
			categoryId: item.categoryId,
			venderId: item.venderId._id,
			product_name: item.product_name,
			description: item.description,
			images: [item.image1, item.image2, item.image3, item.image4, item.image5,item.video].filter(image => typeof image === 'string' && image !== null),
			product_code: item.product_code,
			productType:item.productType,
			productSize:item.productSize,
			productPreparation_time:item.productPreparation_time,
			mrp_price: item.unit_price,
			sale_price: item.sale_price,
			discount: item.discount[0].discount_value,
			discountType: item.discount[0].discount_type,
			product_details: item.product_details,
			brand_name: item.brand_name,
			like_status:0,
			rating:item.rating,
			total_rating:pratingCount || 0,
			cart_status: 0,
			qty: 0,
			attributes:item.product_variation,
			quantity: item.quantity,
			warranty:item.warranty,
			note:item.note,
			returnType:item.returnType,
			stock:item.stock,
			Tax:item.Tax,
			product_weight:item.product_weight,
			deliveryType:item.deliveryType,
			minimum_order:item.minimum_order,
			shop_logo:item.venderId.shop_logo,
			shop_address:item.venderId.shop_address,
			shop_country:item.venderId.country,
			shop_city:item.venderId.city,
			shop_name:item.venderId.shop_name,
			total_product:products || 0,
			total_sale:sales || 0,
		  total_rater:raters || 0,
		  average_rating:average_ratings || 0,
		  delivery_fee:delivery_charge_value || 0,
		  delivery__time:formattedTimeDifference || 0,
		  liked__time:likeDatas || 0,
		  page__views:views|| 0,
		  reviews_list:reviews_list,
		  moreproducts:moreproducts,
			
		  }));
		  // Remove null values from the "images" array
 data.forEach(item => {
    item.images = item.images.filter(image => image !== null);
});

console.log(data);
	
		  res.status(200).json({ "result": "true", "message": "product data get successfully", data:data })
		} else {
		  res.status(400).json({ "result": "false", "message": "Records not found" })
		}

	}
	} catch (err) {
	  console.log(err.message)
	  res.status(400).json({ "result": "false", "message": err.message })
	}
  };
  







// sub_subcategory list api
const subSubcategory_list=async(req,res)=>{
	try{
		const {subcategoryId}=req.body;
		if(!subcategoryId){
			return res.status(400).json({"result":"false","message":"required parameter is subcategoryId"})
		}
      const findData=await Sub_subcategory.find({subcategoryId:subcategoryId});
	  if(!findData){
		res.status(400).json({"result":"false","message":"record does not found"})
	  }else{
		res.status(200).json({"result":"true","message":"Sub_subcategory data get sucessfully",data:findData})
	  }

	}catch(err){
		res.status(400).json({"result":"false","message":err.message})
	}

};




//giving shop rating api 
const givingShoprating= async(req,res)=>{
	const { userId, shopId, rating,comment } = req.body;
	  if (!userId || !shopId || !rating) {
		 return res.status(400).json({ "result": "false", "message": "required parameters are userId,shopId,rating and comment is optional" });
  
	  };
  
	  try {
		  const data = await Shoprating.findOne({ userId: userId, shopId: shopId });
		  if (data) {
			  await Shoprating.findOneAndUpdate({ userId, shopId }, { $set: { rating,comment } }, { new: true });
			  res.status(200).json({ "result": "true", "message": "Review updated sucessfully" })
  
		  } else {
			  const insertData = new Shoprating({ userId, shopId, rating,comment });
			  await insertData.save();
			  res.status(200).json({ "result": "true", "message": "Review added rating sucessfully" })
		  }
	  } catch (err) {
		  console.log(err)
		  res.status(400).json({ "result": "false", "message": err.message });
  
	  }
  
  
  };
  
  


// delete like product list api
const deleteLikeProduct_listApi = async (req, res) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are userId and productId" });
    }

    try {
        const productIds = productId.split(',').map(id => id.trim()); 
        const data = await Like.deleteMany({ userId: userId, productId: { $in: productIds } });
        if (data.deletedCount > 0) {
            res.status(200).json({ "result": "true", "message": "Products liked by user deleted successfully" });
        } else {
            res.status(404).json({ "result": "false", "message": "No products found to delete for the given userId and productId" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};



//Add cart api
const Addcart=async(req,res)=>{
	try {
	const { userId, productId,attributes,qty,status} = req.body;
    if (!userId || !productId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are userId and productId,attributes,qty,status" });
    }
	
        if(req.body.status==="0"){
		let cart = await Cart.findOne({ userId: userId, booking_status:0,status:0});
		if(!cart){
		  const cart_data = new Cart({
			userId: userId,
			status:status,
			products: [{productId,attributes,qty}]
		  });

		  const result = await cart_data.save();
		  res.status(200).json({
			result: 'true', 
			message: 'Cart added successfully.',
			data: result,
		  });
		}else{
		  
		  // Check if the product already exists in the cart
		  const validation = cart.products.find(
			(product) =>
			  product.productId == productId 
		  );
  
		  if (validation) {
			res.status(400).json({
			  result: 'false',
			  message: 'Product already exists in the cart.',
			});
		  } else {
			// Add the product to the cart
			cart.products.push({
			  productId: productId,
			  attributes,
			  qty:qty
			});
  
			const result = await cart.save();
			res.status(200).json({
			  result: 'true',
			  message: 'Cart added successfully.',
			  data: result,
			});
		  }
		}
	}else {
		let cart = await Cart.findOne({ userId: userId, booking_status: 0,status:1 });
		if(!cart){
		  const cart_data = new Cart({
			userId: userId,
			status:status,
			products: [{productId}]
		  });

		  const result = await cart_data.save();
		  res.status(200).json({
			result: 'true', 
			msg: 'Cart added successfully.',
			data: result,
		  });
		}else{
		  
		  // Check if the product already exists in the cart
		  const validation = cart.products.find(
			(product) =>
			  product.productId == productId 
		  );
  
		  if (validation) {
			res.status(400).json({
			  result: 'false',
			  message: 'Product already exists in the cart.',
			});
		  } else {
			// Add the product to the cart
			cart.products.push({
			  productId: productId,
			  
			  
			});
  
			const result = await cart.save();
			res.status(200).json({
			  result: 'true',
			  message: 'Cart added successfully.',
			  data: result,
			});
		  }
		}
	}

    } catch (err) {
        console.log(err);
        res.status(400).json({ "result": "false", "message": err.message });
    }

};






// cart list
const cartList = async (req, res) => {
    try {
        const { userId, status } = req.body;
        if (!userId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are userId, status" });
        }

        const cart_data = await Cart.find({ userId: userId, booking_status: 0, status: status })
            .populate({
                path: 'products.productId',
                populate: { path: 'venderId' }
            });

        if (!cart_data || cart_data.length === 0 || !cart_data[0].products || cart_data[0].products.length === 0) {
            return res.status(400).json({
                "result": "false",
                "message": "Carts do not found",
                "data": []
            });

        } else {
			const charge=await Charge.findOne({});
            res.status(200).json({
                "result": "true",
                "message": "cart_list data get successfully",
                data: cart_data,charge
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "result": "false", "message": error.message });
    }
};




//delete cart item
const deleteCart=async(req,res)=>{
	try {
		const {userId, productId,status} = req.body;
		if (!userId || !productId ) {
			return res.status(400).json({ "result": "false", "message": "required parameters are userId,productId,status" });
		}
	
		
	const matchData= await Cart.findOne({userId:userId,booking_status:0,status:status});
	if(matchData.products.length === 1){
	  await Cart.findOneAndDelete({ userId: userId,status:status, products: { $elemMatch: {productId: productId} }, booking_status: 0 });
	  res.status(200).json({ "result": "true", "message": "cart item deleted successfully" });

	}else{
	  const updatedCart = await Cart.findOneAndUpdate(
		  { userId: userId,status:status, products: { $elemMatch: {productId: productId} }, booking_status: 0},
		  { $pull: { products: { productId: productId } } },
		  { new: true }
	  );

	  if (updatedCart) {
		  res.status(200).json({ "result": "true", "message": "cart item deleted successfully" });
	  } else {
		  res.status(400).json({ "result": "false", "message": " cart item not found" });
	  }

	}
			
		  } catch (error) {
			console.log(error.message);
			res.status(500).json({ "result": "false", "message": error.message });
		  }
	
};





//categoryBase_productList api 
const categoryBase_productList = async (req, res) => {
	try {
		const {categoryId } = req.body;
		if (!categoryId) {
			return res.status(400).json({ "result": "false", "message": "required parameter are categoryId" })
		}
		const productList = await Product.find({ categoryId:categoryId });
		if (productList && productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};








//details
const inntOut_productDetails = async (req, res) => {
	try {
		const { productId,userId,shopId,lat,lon} = req.body;
		if (!productId || !shopId) {
		  return res.status(400).json({ "result": "false", "message": "required parameter is productId,shopId,lat,lon and userId optional" })
		}
  
		
  //calculate time and distance b/w user and shop
  const shop=await Vender.findOne({_id:shopId});
  const storeLat = shop.location.coordinates[1];
  const storeLon = shop.location.coordinates[0];
   const distance = calculateDistance(lat, lon, storeLat, storeLon).toFixed(1);
  const coveruserandshop_distance_timing=Number(distance*10);
  
  // calulate time and distance neares deliverboy and shop
  const deliveryBoys = await Driver.find();
		  if (deliveryBoys.length === 0) {
			  return res.status(404).json({ error: 'No delivery boys found' });
		  }
  
		  let nearestBoy = null;
		  let minDistance = Infinity;
		  var latitude=deliveryBoys.geo_location.coordinates[0];
		var  longitude=deliveryBoys.geo_location.coordinates[1];
		  deliveryBoys.forEach(boy => {
			  const distance = calculateDistance(storeLat, storeLon, latitude, longitude);
			  if (distance < minDistance) {
				  minDistance = distance;
			  }
		  });
		   const mindist=minDistance.toFixed(1)
		  const covermindistance_time=Number(mindist*10);
  
  
	// calculate delivery__time
	const productLists = await Product.findOne({ _id:productId })
	const times = productLists.productPreparation_time;
	const time = times.replace(/\D+/g, '');
  
  
	// calculate shop distance  to user distance
	 const delivery__times=Number(time) + Number(coveruserandshop_distance_timing) + Number(covermindistance_time);
  
  
	  // Get the current time
	  const now = new Date();
	  const currentTime = new Date(now);
  
	  // Add the calculated delivery time to the current time
	  now.setMinutes(now.getMinutes() + delivery__times);
  
	  // Calculate the time difference
	  const timeDifference = now - currentTime;
  
	  // Convert the time difference to days, hours, and minutes
	  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
	  // Format the new time as a human-readable string
	  let formattedTimeDifference = '';
	  if (days > 0) {
		  formattedTimeDifference += `${days} days `;
	  }
	  if (hours > 0 || days > 0) {
		  formattedTimeDifference += `${hours} hours `;
	  }
	  formattedTimeDifference += `${minutes} minutes `;
  
	  // Convert the final delivery time to 12-hour format
	  let finalHours = now.getHours();
	  let finalMinutes = now.getMinutes();
	  const ampm = finalHours >= 12 ? 'PM' : 'AM';
	  finalHours = finalHours % 12;
	  finalHours = finalHours ? finalHours : 12; // The hour '0' should be '12'
	  finalMinutes = finalMinutes < 10 ? '0' + finalMinutes : finalMinutes; // Add leading zero if needed
	  const formattedFinalTime = finalHours + ':' + finalMinutes + ' ' + ampm;
  
	  console.log(`Time difference: ${formattedTimeDifference}`);
      
	// calculate delivery charge
	const delivery_charge_value=Number(distance*0.9).toFixed(2);



	 if(userId){
	  const productList = await Product.find({ _id: productId }).populate('venderId');
	  const raters=await Shoprating.find({shopId}).countDocuments();
	  const products=await Product.find({venderId:shopId}).countDocuments();
	  const rater=await Shoprating.find({shopId});

      const totalRating = (rater && rater.length > 0)
  ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

      const average_ratings= Number(totalRating / raters);
	  
 

	  const pro = await Product.find({ venderId: shopId });
	  const productid = pro.map(item => ({
	  productID: item._id
	  }));
	  
	  
	   
		const views=await Viewshops.find({shopId}).countDocuments();
		const matchData = await Order.find({ shopId: shopId});
		
	  const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
	  
//const reviews list
const pratingCount=await Rating.find({productId:productId}).countDocuments();
const reviewsList=await Rating.find({productId:productId}).populate('userId');
const reviews_list=await reviewsList.map(item=>({
  rating:item.rating,
  comment:item.comment,
  user_namef:item.userId.first_name,
  user_namel:item.userId.last_name,
  user_image:item.userId.user_profile
}))

//const reviews list
const shopProductList=await Product.find({venderId:shopId,}).limit(50);
const moreproducts=await shopProductList.map(item=>({
  image:item.image1,
  productId:item._id,
  shopId:item.venderId
}))


const userCart = await Inntoutcart.findOne({
	userId: new mongoose.Types.ObjectId(userId),
	booking_status: 0
  }, { 'products.productId': 1 }).lean();
  
  let cart = 0;
  
  if (userCart && userCart.products) {
	const matchingProduct = userCart.products.find(product => product.productId.toString() === productId.toString());
	if (matchingProduct) {
	  cart = 1;
	}
  }
  




	  if (productList && productList.length > 0) {
		const data = productList.map(item => ({
		  productId: item._id,
		  categoryId: item.categoryId,
		  venderId: item.venderId._id,
		  product_name: item.product_name,
		  description: item.description,
		  images: [item.image1, item.image2, item.image3, item.image4, item.image5],
		  product_code: item.product_code,
		  productType:item.productType,
		  productSize:item.productSize,
		  productPreparation_time:item.productPreparation_time,
		  mrp_price: item.unit_price,
		  sale_price: item.sale_price,
		  discount: item.discount[0].discount_value,
		  discountType: item.discount[0].discount_type,
		  product_details: item.product_details,
		  brand_name: item.brand_name,
		  rating:item.rating,
		  total_rating: pratingCount || 0,
		  cart_status:cart || 0,
		  qty: 0,
		  attributes:item.product_variation,
		  quantity: item.quantity,
		  warranty:item.warranty,
		  note:item.note,
		  returnType:item.returnType,
		  stock:item.stock,
		  Tax:item.Tax,
		  product_weight:item.product_weight,
		  deliveryType:item.deliveryType,
		  minimum_order:item.minimum_order,
		  shop_logo:item.venderId.shop_logo,
		  shop_address:item.venderId.shop_address,
		  shop_country:item.venderId.country,
		  shop_city:item.venderId.city,
		  shop_name:item.venderId.shop_name,
		  total_product:products || 0,
		  total_sale:sales || 0,
		  total_rater:raters || 0,
		  average_rating:average_ratings || 0,
		  delivery_fee:delivery_charge_value || 0,
		  delivery__time:formattedFinalTime || 0,
		  liked__time:0,
		  page__views:views || 0,
		  reviewsList:reviews_list ||0,
		  moreproducts:moreproducts ||  0
		  
		  
		}));

  
		res.status(200).json({ "result": "true", "message": "product data get successfully", data:data })
	  } else {
		res.status(400).json({ "result": "false", "message": "Records not found" })
	  }

	}else{

		const productList = await Product.find({ _id: productId }).populate('venderId');
	  const raters=await Shoprating.find({shopId}).countDocuments();
	  const products=await Product.find({venderId:shopId}).countDocuments();
	  const rater=await Shoprating.find({shopId});

      const totalRating = (rater && rater.length > 0)
  ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

      const average_ratings= Number(totalRating / raters);
	  
 

	  const pro = await Product.find({ venderId: shopId });
	  const productid = pro.map(item => ({
	  productID: item._id
	  }));
	  
	  
	  
	   
		const views=await Viewshops.find({shopId}).countDocuments();
		const matchData = await Order.find({ shopId: shopId});
		
	  const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
	  
//const reviews list
const pratingCount=await Rating.find({productId:productId}).countDocuments();
const reviewsList=await Rating.find({productId:productId}).populate('userId');
const reviews_list=await reviewsList.map(item=>({
  rating:item.rating,
  comment:item.comment,
  user_namef:item.userId.first_name,
  user_namel:item.userId.last_name,
  user_image:item.userId.user_profile
}))

//const reviews list
const shopProductList=await Product.find({venderId:shopId,}).limit(50);
const moreproducts=await shopProductList.map(item=>({
  image:item.image1,
  productId:item._id,
  shopId:item.venderId
}))



	  if (productList && productList.length > 0) {
		const data = productList.map(item => ({
		  productId: item._id,
		  categoryId: item.categoryId,
		  venderId: item.venderId._id,
		  product_name: item.product_name,
		  description: item.description,
		  images: [item.image1, item.image2, item.image3, item.image4, item.image5],
		  product_code: item.product_code,
		  productType:item.productType,
		  productSize:item.productSize,
		  productPreparation_time:item.productPreparation_time,
		  mrp_price: item.unit_price,
		  sale_price: item.sale_price,
		  discount: item.discount[0].discount_value,
		  discountType: item.discount[0].discount_type,
		  product_details: item.product_details,
		  brand_name: item.brand_name,
		  rating:item.rating,
		  total_rating: pratingCount || 0,
		  cart_status:0,
		  qty: 0,
		  attributes:item.product_variation,
		  quantity: item.quantity,
		  warranty:item.warranty,
		  note:item.note,
		  returnType:item.returnType,
		  stock:item.stock,
		  Tax:item.Tax,
		  product_weight:item.product_weight,
		  deliveryType:item.deliveryType,
		  minimum_order:item.minimum_order,
		  shop_logo:item.venderId.shop_logo,
		  shop_address:item.venderId.shop_address,
		  shop_country:item.venderId.country,
		  shop_city:item.venderId.city,
		  shop_name:item.venderId.shop_name,
		  total_product:products || 0,
		  total_sale:sales || 0,
		  total_rater:raters || 0,
		  average_rating:average_ratings || 0,
		  delivery_fee:delivery_charge_value || 0,
		  delivery__time:formattedFinalTime || 0,
		  liked__time:0,
		  page__views:views || 0,
		  reviewsList:reviews_list ||0,
		  moreproducts:moreproducts ||  0
		  
		  
		}));

  
		res.status(200).json({ "result": "true", "message": "product data get successfully", data:data })
	  } else {
		res.status(400).json({ "result": "false", "message": "Records not found" })
	  }



	}

	} catch (err) {
	  console.log(err.message)
	  res.status(400).json({ "result": "false", "message": err.message })
	}
  };
  






const AddMultiplecarts = async (req, res) => {
    try {
        const { userId, products, status } = req.body;

        if (!userId || !products || !status) {
            return res.status(400).json({ result: false, message: "Required parameters are userId, products, and status" });
        }

		const productData =products;
      
        if (!Array.isArray(productData)) {
            return res.status(400).json({ result: false, message: "Products should be an array"});
        }

        //Extract product details from the productData array
        const productIds = productData.map(product => product.productId);
        const productDetails = productData.map(product => ({
            productId: product.productId,
            attributes: product.attributes || "default",
            qty: product.qty || 1
        }));

        let cart = await Cart.findOne({ userId: userId, booking_status: 0, status:status });
        if (!cart) {
            const cart_data = new Cart({
                userId: userId,
                status: status,
                products: productDetails
            });

            const result = await cart_data.save();
            return res.status(200).json({
                result: true,
                message: 'Cart multiple added successfully.',
                data: result,
            });
        } else {
            const existingProductIds = cart.products.map(product => product.productId.toString());

             const newProducts = productIds.filter(productId => !existingProductIds.includes(productId));

            if (newProducts.length === 0) {
                return res.status(400).json({
                    result: false,
                    message: 'All products already exist in the cart.',
                });
            }



            // Add the new products to the cart
            newProducts.forEach(productId => {
                const productToAdd = productDetails.find(product => product.productId === productId);
                if (productToAdd) {
                    cart.products.push(productToAdd);
                }
            });

            const result = await cart.save();
            return res.status(200).json({
                result: true,
                message: 'Cart multiple added successfully.',
                data: result,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ result: false, message: err.message });
    }
};









// delete multiple cart items
const deleteMultipleCart = async (req, res) => {
    try {
        const { userId, productids,status } = req.body;
        if (!userId || !productids) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId and productids,status" });
        }

        const cart = await Cart.findOne({ userId: userId, booking_status: 0, status:status });
        if (!cart || cart.length === 0 ) {
            return res.status(400).json({ "result": "false", "message": "Cart not found for the user" });
        }

        const productIds = productids.split(',').map(id => id.trim());

        // Remove only the specified productIds from the cart
        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId, booking_status: 0, status:status },
            { $pull: { products: { productId: { $in: productIds } } } },
            { new: true }
        );

        if (updatedCart) {
            return res.status(200).json({ "result": "true", "message": "Cart items removed successfully" });
        } else {
            return res.status(400).json({ "result": "false", "message": "Cart items not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "result": "false", "message": error.message });
    }
};





// check out api
const checkOut=async(req,res)=>{
	try {
        const {userId,products,total_item, total_price,save_amount,status } = req.body;

        // Validate required parameters
        if (!userId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId and products,total_item,save_amount, total_price,sent status 1 for only inntout " });
        }

		const data=await Checkout.findOne({userId,check_status:0,status:status});
		if(data){
			await Checkout.findOneAndUpdate({userId,check_status:0,status:status},{
			products: products,
            total_item: total_item || 0,
            total_price: total_price || 0,
			save_amount:save_amount
			},{new:true});
			res.status(200).json({ "result": "true", "message": "Checkout data updated successfully",});

		}else{

        const newCart = new Checkout({
            userId: userId,
            products: products,
            total_item: total_item || 0,
            total_price: total_price || 0,
			save_amount:save_amount,
			status:status
        });
        const savedCart = await newCart.save();
         res.status(200).json({ "result": "true", "message": "Checkout data inserted successfully", data: savedCart });
}
    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }

};







const addOrder = async (req, res) => {
    try {
        const { userId, addressId,note, checkoutId, payment_status,delivery_place, payType, paymentMode, grand_total} = req.body;

        if (!userId || !checkoutId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId,checkoutId,note,addressId,payment_status,delivery_place,payType,paymentMode,grand_total" });
        }

        const updatedData = {
            addressId,
            delivery_place,
            payType,
            paymentMode,
            grand_total,
			note,
			payment_status,
            check_status: 1,
        }

		const transId=generateRandomNumber();
         //add in transjection
		if(payType==="wallet"){
			const checkMoney=await User.findOne({_id:userId});
			if(checkMoney.wallet<grand_total){
				return res.status(400).json({"result":"false","message":"You have not sufficient blance"})
			}
			const reduces=Number(checkMoney.wallet - grand_total);
			await User.findOneAndUpdate({_id:userId},{wallet:reduces},{new:true});
		const insertedData=new Transjection ({transjectionId:transId,userId:userId,amount:grand_total,payment_status:"Order",payment_type:"Shipped"});
		await insertedData.save();
	}

        const findData = await Checkout.findOne({ _id: checkoutId,status:0 });
		const commissions = await Charge.findOne({});


        const orders = {};
        findData.products.forEach(product => {
            const ordercodes = Math.floor(10000000 + Math.random() * 90000000);
			const verifiedOrdercodes = Math.floor(100000 + Math.random() * 900000);
            const qr = generateOrderQrcode();
            const orderQRcode=generateOrderQrcode();

            if (!orders[product.shopId]) {
                orders[product.shopId] = {
                    userId: userId,
                    checkoutId: checkoutId,
                    shopId: product.shopId,
                    orderId: ordercodes,
					transjectionId: transId,
					qrcodes:orderQRcode,
					pay_place:delivery_place,
					delivery_charge:product.shipping_charge,
					orderVerification_code:verifiedOrdercodes,
                    products: []
                };
            }

			const adminTaken_charge=Number((product.total*commissions.commission)/100).toFixed(2);

            orders[product.shopId].products.push({
                productId: product.productId,
                attributes: product.attributes,
                image: product.image,
                product_name: product.product_name,
                shop_name: product.shop_name,
                qty: product.qty,
                subtotal: product.subtotal,
                discount: product.discount,
                tax: product.tax,
                shipping_charge: product.shipping_charge,
				commission:adminTaken_charge,
                total: product.total,
                checkout_status: product.checkout_status,
                qrcode: qr,
				payment_status:payment_status,
            });
        });

        const orderDocuments = Object.values(orders);

        await Order.insertMany(orderDocuments);
		await Cart.findOneAndUpdate({userId:userId,booking_status:0,status:0},{booking_status:1},{new:true});
		await Checkout.findOneAndUpdate({userId:userId,check_status:0,status:0},updatedData,{new:true});
		
        res.status(200).json({ "result": "true", "message": "Order placed successfully", data: orderDocuments });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};








// order list api
const orderList=async(req,res)=>{
	try {
        const {userId} = req.body;
		
		if (!userId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId" });
        }
		const data=await Order.find({userId,status:0}).populate('shopId').sort({_id:-1})
		if(data){
         res.status(200).json({ "result": "true", "message": "Order list get successfully", data: data });
    }else{
		res.status(400).json({ "result": "false", "message": "Order does not available successfully", data: data });
	}
    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};



const orderDetails=async(req,res)=>{
try {
	const { orderId, productId } = req.body;
	if (!orderId || !productId) {
		return res.status(400).json({ "result": "false", "message": "required parameters are orderId and productId" });
	}

	const matchData = await Order.findOne({ 
		_id: orderId,
		
	}).populate('userId checkoutId shopId');


	 const checkdata = await Checkout.findOne({ _id: matchData.checkoutId }).populate('addressId');
	 const address = {
	 addressId:checkdata.addressId?._id || 0,
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
const user=checkdata.userId;

	// Find the product based on the specified productId
	const filteredProduct = matchData.products.find(product => product.productId.toString() === productId);
	const rating=await Rating.findOne({userId:user,productId});

	
	console.log(filteredProduct,rating)
	const leftProducts = matchData.products.filter(product => product.productId.toString() !== productId);
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
		delivery_place: matchData.checkoutId.delivery_place,
		shopId: matchData.shopId._id,
		shop_venderfirstName:matchData.shopId.firstName,
		shop_venderlastName:matchData.shopId.lastName,
		shop_mobile_number:matchData.shopId.mobile_number,
		workHours:matchData.shopId.workHours,
		shop_address:matchData.shopId.shop_address,
		country:matchData.shopId.country,
		shop_name:matchData.shopId.shop_name,
		shop_image:matchData.shopId.shop_logo,
		city:matchData.shopId.city,
		orderId: matchData.orderId, 
        createdAt: matchData.createdAt,
		updatedAt: matchData.updatedAt,
        products:filteredProduct,
		rating:rating || 0,
		other_products:leftProducts,
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




//checkout list
const checkoutList=async(req,res)=>{
	try {
        const {userId} = req.body;
		
		if (!userId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId" });
        }
		const data=await Checkout.findOne({userId,check_status:0});
         res.status(200).json({ "result": "true", "message": "Checkout list get successfully", data: data });

    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }

};




//new arrival
const newArrival_Product_list=async(req,res)=>{
	try {
		const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
         const categories=await Category.find({maincategoryId:Maincategories});
		 const categoryIds = categories.map(category => category._id);
		 const productList = await Product.find({ categoryId: { $in: categoryIds },status:1}).sort({ _id: -1 }).limit(100);
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}


};




const dayOftheDeals_ProductList=async(req,res)=>{
	try {
		const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
         const categories=await Category.find({maincategoryId:Maincategories});
		 const categoryIds = categories.map(category => category._id);
		 const productList = await Product.find({ categoryId: { $in: categoryIds },hot_of_deals_status:1 });
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};




const likeMultipleProducts = async (req, res) => {
    const { productIds, userId } = req.body;

    if (!productIds || !userId) {
        return res.status(400).json({ result: false, message: "Required parameters are userId and an array of productIds" });
    }

    try {
        const existingLikes = await Like.find({ userId: userId, productId: { $in: productIds }});
        const existingProductIds = existingLikes.map(like => like.productId);

        if (existingProductIds.length > 0) {
			const updateResult = await Like.updateMany(
                { userId: userId, productId: { $in: productIds } },
                { $set: { like_status: 1 }},{new:true} 
            );

         res.status(200).json({ result: true, message: "Like status updated sucessfully" });
        }else{
        
        const insertData = productIds.map(productId => ({
            userId: userId,
            productId: productId,
            like_status: 1
        }));

        if (insertData.length > 0) {
            await Like.insertMany(insertData);
        }

        const insertedProductIds = insertData.map(data => data.productId);

        res.status(200).json({
            result: true,
            message: "Products liked successfully",
            newProductIds: insertedProductIds
        });
}
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, message: err.message });
    }
};





//product list
const inntAllProduct_list=async(req,res)=>{
	try {
		const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
         const categories=await Category.find({maincategoryId:Maincategories});
		 const categoryIds = categories.map(category => category._id);
		 const productList = await Product.find({ categoryId: { $in: categoryIds } }).sort({ _id: -1 });
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}


};


const Updatecarts = async (req, res) => {
    try {
        const { userId, products, cartId } = req.body;

        if (!userId || !products || !cartId) {
            return res.status(400).json({ result: false, message: "Required parameters are userId, cartId, and products" });
        }

        const productUpdates = products.map(product => ({
            productId: product.productId,
            update: {
				attributes: product.attributes,
                qty: product.qty
            }
        }));

        let cart = await Cart.findOneAndUpdate(
            { _id: cartId, userId: userId, booking_status: 0, status: 0 },
            {
                $set: { "products.$[elem].attributes": productUpdates[0].update.attributes,"products.$[elem].qty": productUpdates[0].update.qty }
            },
            { new: true, arrayFilters: [{ "elem.productId": productUpdates[0].productId }] }
        );

        if (!cart) {
            return res.status(400).json({
                result: false,
                message: 'Cart not found or booking_status is not 0'
            });
        } else {
            return res.status(200).json({
                result: true,
                message: 'Cart updated successfully.',
                data: cart
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, message: err.message });
    }
};





//checkout list
const addViewproduct=async(req,res)=>{
	try {
        const {userId,productId} = req.body;
		
		if (!userId || !productId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId,productId" });
        }

		const matchData=await Viewsproduct.findOne({userId,productId});
		if(matchData){
			res.status(200).json({ "result": "true", "message": "View updated successfully"});
		}else{
			const insertData = new Viewsproduct({userId,productId});
			const data=await insertData.save();
			res.status(200).json({ "result": "true", "message": "View added successfully",data:data});
		}
         

    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }

};






const suggested_ProductList=async(req,res)=>{
	try {
		const {userId}=req.body;
		if(!userId){
			return res.status(400).json({"result":"false","message":"required paramter is userId"});

		}

		 const productList = await Viewsproduct.find({userId:userId}).populate('productId');
		if (productList || productList.length>0) {
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: productList })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};


//change address
const changeAddress=async(req,res)=>{
	try {
		const {checkoutId,addressId}=req.body;
		if(!checkoutId){
			return res.status(400).json({"result":"false","message":"required paramter is checkoutId,addressId"});

		}

		 const productList = await Checkout.findOneAndUpdate({_id:checkoutId},{addressId},{new:true});
		if (productList ) {
			res.status(200).json({ "result": "true", "message": "Address updated sucessfully"})
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};




//change address
const updateOrder_status=async(req,res)=>{
	try {
		const {orderId,status,productId}=req.body;
		if(!orderId || !status){
			return res.status(400).json({"result":"false","message":"required paramter is orderId ,productId,status(Note: cancel for 1,confirm 2,packing 3,shipped 4, not delivered 5,delivered 6,return 7)"});

		}
		const updateOrder = await Order.findOneAndUpdate(
			{ 
				_id: orderId,
				"products.productId": productId
			},
			{ 
				$set: {
					"products.$.order_status": status,
					
				}
			},
			{ new: true }
		);
		if (updateOrder ) {
			res.status(200).json({ "result": "true", "message": "Order cancel sucessfully"})
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}

};




// innt shoplist
const inntShop_list = async (req, res) => {
    try {
        const { lat, lon } = req.body;
        if (!lon || !lat) {
            return res.status(400).json({ "result": "false", "message": "required parameters are lat, lon" });
        }

       
        const cat = await Maincategory.findOne({ maincategory_englishName: "Innt" });
        const id = cat._id;
        const shoplist = await Vender.find({ serviceType: id });
         

        if (!shoplist || shoplist.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Shop list not found" });
        }

        const data = [];
		  for (const shop of shoplist) {
            const raters = await Shoprating.countDocuments({ shopId: shop._id });
            const rater = await Shoprating.find({ shopId: shop._id });
            const matchData = await Order.find({ shopId: shop._id });
            const totalRating = (rater && rater.length > 0) ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0) : 0;
            const averageRatings = raters > 0 ? Number(totalRating / raters) : 0;
            const sales = matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
		   
			const storeLat = shop.location.coordinates[1];
            const storeLon = shop.location.coordinates[0];
            const distance = calculateDistance(lat, lon, storeLat, storeLon).toFixed(1);

          data.push({
			shopId: shop._id,
			shop_name: shop.shop_name,
			logo: shop.shop_logo,
			frontImage: shop.upload_frontId,
			shop_address: shop.shop_address,
			country: shop.country,
			city: shop.city,
			lon: shop.location.coordinates[0],
			lat: shop.location.coordinates[1],
			raters: raters,
			average_ratings: averageRatings,
			sales: sales,
			distances:distance || 0
		});
	}

        res.status(200).json({ "result": "true", "message": "Shop list retrieved successfully", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};





// innt shoplist
const inntShop_details = async (req, res) => {
    try {
        const {shopId } = req.body;
        if (!shopId ) {
            return res.status(400).json({ "result": "false", "message": "required parameters are shopId" });
        }

   const shopData=await Vender.findById({_id:shopId});

   if(!shopId){
	return res.status(400).json({ "result": "false", "message": "shopId do not found" });
   }

const shopdata={
	shopId:shopData._id,
	firstName: shopData.firstName,
    lastName:shopData.lastName,
    residenceyCity:shopData.residenceyCity ,
    mobile_number:shopData.mobile_number,
    upload_frontId:shopData.upload_frontId,
    upload_backsideId:shopData.upload_backsideId,
    shop_name:shopData.shop_name,
    shop_address:shopData.shop_address,
    country:shopData.country ,
    city:shopData.city,
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

    const raters=await Shoprating.find({shopId}).countDocuments();
	  const rater=await Shoprating.find({shopId});
    const views=await Viewshops.find({shopId}).countDocuments();
    const matchData = await Order.find({ shopId: shopId});
    
//count average rating
      const totalRating = (rater && rater.length > 0)
  ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;

  const average_ratings = raters > 0 ? Number(totalRating / raters) : 0;

//count sales
const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);


const productlist=await Product.find({venderId:shopId});
const product=await productlist.map(item=>({
	            productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,
				//size: item.size,
				//color: item.color,
				product_variation:item.product_variation,


}))


const data={
	shop_data:shopdata,
	products_count:products,
	like_count:likeData,
	raters_count:raters,
	average_ratings:average_ratings!== null ? average_ratings : 0,
	view_count:views,
	sales_count:sales,
	productlist:product,
  }

        res.status(200).json({ "result": "true", "message": "Shop details list retrieved successfully", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};


  

const filterShopProduct = async (req, res) => {
    try {
        const { shopId, price, rating, discount} = req.body;
        if (!shopId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are shopId and optional are (price, discount, rating)" });
        }

        let query = { venderId: shopId };

        if (price) {
            query.sale_price = { $gte: price };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        if (discount) {
            query["discount.discount_type"] = "Percent";
            query["discount.discount_value"] = { $gte: discount };
        }

        

        const productData = await Product.find(query);

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};



  

//favourite shop
const favouriteShop=async(req,res)=>{
	const {shopId, userId } = req.body;

	if (!shopId || !userId) {
		return res.status(400).json({ result: "false", message: "Required parameters are userId and shopId" });
	}

	try {
		let findData = await Shopfavourite.findOne({ userId: userId, shopId });

		if (findData){
				return res.status(400).json({"result": "true", "message": "Allready added in shop favourite list " });
				
			}

		else {
			// If no record is found, insert a new one with like_status as 1
			const insertData = new Shopfavourite({ userId, shopId, favourite_status: 1 });
			const data = await insertData.save();
			res.status(200).json({ result: "true", message: "Shop favourite added successfully" });
	
		}

	} catch (err) {
		console.error(err);
		res.status(500).json({ result: "false", message: err.message });
	}

};

 


//favourite shop
const removefavouriteShop=async(req,res)=>{
	const {shopId, userId } = req.body;

	if (!shopId || !userId) {
		return res.status(400).json({ result: "false", message: "Required parameters are userId and shopId" });
	}

	try {
		let findData = await Shopfavourite.findOne({ userId: userId, shopId });

		if (findData){
			await Shopfavourite.findOneAndDelete({ userId, shopId});
			
			res.status(200).json({ result: "true", message: "Favourite deleted successfully" });
	
		}

	} catch (err) {
		console.error(err);
		res.status(500).json({ result: "false", message: err.message });
	}

};






const favouriteShopList=async(req,res)=>{
	const {userId,lat,lon} = req.body;
	if (!userId || !lat) {
		return res.status(400).json({ "result": "false", "message": "required parameter are userId,lat,lon" });
	}

	try {
		const shoplist = await Shopfavourite.find({ userId: userId,favourite_status:1 }).populate('shopId');
		if (!shoplist) {
			res.send("data does not found")
		} else {
            
			const data = [];
			for (const shop of shoplist) {
			  const raters = await Shoprating.countDocuments({ shopId: shop.shopId });
			  const rater = await Shoprating.find({ shopId: shop.shopId });
			  const matchData = await Order.find({ shopId: shop.shopId });
			  const totalRating = (rater && rater.length > 0) ? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0) : 0;
			  const averageRatings = raters > 0 ? Number(totalRating / raters) : 0;
			  const sales = matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
			const storeLat = shop.shopId.location.coordinates[1];
            const storeLon = shop.shopId.location.coordinates[0];
            const distance = calculateDistance(lat, lon, storeLat, storeLon).toFixed(1);

          
  
			data.push({
			  shopId: shop.shopId._id,
			  shop_name: shop.shopId.shop_name,
			  logo: shop.shopId.shop_logo,
			  frontImage: shop.shopId.upload_frontId,
			  shop_address: shop.shopId.shop_address,
			  country: shop.shopId.country,
			  city: shop.shopId.city,
			  lon: shop.shopId.location.coordinates[0] || 0,
			  lat: shop.shopId.location.coordinates[1] || 0,
			  raters: raters,
			  average_ratings: averageRatings,
			  sales: sales,
			  distances:distance || 0
		  });
	  }



			
			res.status(200).json({ "result": "true", 
			"message": "Shop favourite  data list are ",
			 data:data 
			})
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};





// Trending now
const trendingNow = async (req, res) => {
    try {
        const today = new Date();
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

		const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
		const categories=await Category.find({maincategoryId:Maincategories});
		const categoryIds = categories.map(category => category._id);
		const productLists = await Product.find({ categoryId: { $in: categoryIds }});
        const id=await productLists.map(item=>item._id);

        const matchData = await Order.find({ updatedAt: { $gte: oneMonthAgo, $lte: today },"products.productId":{$in:id} });

        const productIds = [];
        const productCounts = {};

        matchData.forEach(order => {
            order.products.forEach(product => {
                productIds.push(product.productId);
                const productId = product.productId;
                productCounts[productId] = (productCounts[productId] || 0) + 1;
            });
        });

        // Find product list
        const productList = await Product.find({ _id: { $in: productIds } }).limit(30);

        // Merge productCounts with productList
        const mergedProductList = productList.map(product => ({
            ...product.toObject(),
            count: productCounts[product._id] || 0
        }));

        const data = mergedProductList.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: (item.discount && item.discount.length > 0) ? item.discount[0].discount_value : 0,
            discount_name: (item.discount && item.discount.length > 0) ? item.discount[0].discount_type : null,
        }));

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





//AddInntoutCart
const AddInntoutCart=async(req,res)=>{
	try {
	const { userId, productId,qty,attributes} = req.body;
    if (!userId || !productId) {
        return res.status(400).json({ "result": "false", "message": "required parameters are userId and productId,attributes,qty "});
    }

		let cart = await Inntoutcart.findOne({ userId: userId, booking_status:0});
		if(!cart){
		  const cart_data = new Inntoutcart({
			userId: userId,
			products: [{productId,qty,attributes}]
		  });

		  const result = await cart_data.save();
		  res.status(200).json({
			result: 'true', 
			message: 'Cart added successfully.',
			data: result,
		  });
		}else{
		  
		  // Check if the product already exists in the cart
		  const validation = cart.products.find(
			(product) =>
			  product.productId == productId 
		  );
  
		  if (validation) {
			res.status(400).json({
			  result: 'false',
			  message: 'Product already exists in the cart.',
			});
		  } else {
			// Add the product to the cart
			cart.products.push({
			  productId: productId,
			  attributes,
			  qty:qty
			});
  
			const result = await cart.save();
			res.status(200).json({
			  result: 'true',
			  message: 'Cart added successfully.',
			  data: result,
			});
		  }
		}
	

    } catch (err) {
        console.log(err);
        res.status(400).json({ "result": "false", "message": err.message });
    }

};






// cart list
const InnoutcartList = async (req, res) => {
    try {
        const { userId} = req.body;
        if (!userId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are userId" });
        }

        const cart_data = await Inntoutcart.find({ userId: userId, booking_status: 0 })
            .populate({
                path: 'products.productId',
                populate: { path: 'venderId' }
            });

        if (!cart_data || cart_data.length === 0 || !cart_data[0].products || cart_data[0].products.length === 0) {
            return res.status(400).json({
                "result": "false",
                "message": "Carts do not found",
                "data": []
            });

        } else {
			const charge=await Charge.findOne({});
            res.status(200).json({
                "result": "true",
                "message": "cart_list data get successfully",
                data: cart_data,charge
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "result": "false", "message": error.message });
    }
};




//delete cart item
const deleteinntoutCart=async(req,res)=>{
	try {
		const {userId, productId} = req.body;
		if (!userId || !productId ) {
			return res.status(400).json({ "result": "false", "message": "required parameters are userId,productId" });
		}
	
		
	const matchData= await Inntoutcart.findOne({userId:userId,booking_status:0});
	if(matchData.products.length === 1){
	  await Inntoutcart.findOneAndDelete({ userId: userId,products: { $elemMatch: {productId: productId} }, booking_status: 0 });
	  res.status(200).json({ "result": "true", "message": "cart item deleted successfully" });

	}else{
	  const updatedCart = await Inntoutcart.findOneAndUpdate(
		  { userId: userId, products: { $elemMatch: {productId: productId} }, booking_status: 0},
		  { $pull: { products: { productId: productId } } },
		  { new: true }
	  );

	  if (updatedCart) {
		  res.status(200).json({ "result": "true", "message": "cart item deleted successfully" });
	  } else {
		  res.status(400).json({ "result": "false", "message": " cart item not found" });
	  }

	}
			
		  } catch (error) {
			console.log(error.message);
			res.status(500).json({ "result": "false", "message": error.message });
		  }
	
};



//update phone
const updatePhone=async(req,res)=>{
	try {
		const {userId,phone} = req.body;
	
		if (!userId || ! phone) {
		  return res.status(400).json({
			"result": "false",
			"message": "Required parameter are userId,phone"
		  });
		}
	
		const matchData = await User.findOne({ _id: userId });
		if (!matchData) {
		  return res.status(400).json({
			"result": "false",
			"message": "User does not exist"
		  });
		} 
	
		const matchDatas = await User.findOne({ _id: userId,mobile_number:phone });
		if (matchDatas) {
		  return res.status(400).json({
			"result": "false",
			"message": "Phone Number allready exist"
		  });
		} 
		

	   const Otp=generate_otp();
		  const updateData = {
			userId,
			otp:Otp
		  };
		  
		  const updatedVendor = await User.findByIdAndUpdate(
			{ _id: userId },
			updateData,
			{ new: true }
		  );
	
		  if (updatedVendor) {
			const data = {
				userId: updatedVendor._id,
			  otp: updatedVendor.otp,
			  mobile_number:updatedVendor.mobile_number,
			  newMobile_number:phone
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



//update email
const updateEmail=async(req,res)=>{
	try {
		const {userId,email} = req.body;
	
		if (!userId) {
		  return res.status(400).json({
			"result": "false",
			"message": "Required parameter is userId,email"
		  });
		}
	
		const matchData = await User.findOne({ _id: userId });
		if (!matchData) {
		  return res.status(400).json({
			"result": "false",
			"message": "Vendor does not exist"
		  });
		} 
		
		const matchDatas = await User.findOne({ _id: userId ,email:email});
		if (matchDatas) {
		  return res.status(400).json({
			"result": "false",
			"message": "Email already exist"
		  });
		} 
		
	   const otp=generate_otp() ;
		  const updateData = {
			userId,
			otp:otp,
		  };
		  
		  const updatedVendor = await User.findByIdAndUpdate(
			{ _id: userId },
			updateData,
			{ new: true }
		  );
	
		  if (updatedVendor) {
			const data={
				userId:updatedVendor._id,
				otp:otp,
				newEmail:email,
				oldEmail:updatedVendor.email
			}
			
	// send otp to using nodemailer
  const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
	  user: "innt125@gmail.com",
	  pass: "pbnvqibgkhudmmec", // Use the App Password here
	},
  });
  
  
  async function main() {
	// send mail with defined transport object
	const info = await transporter.sendMail({
	  from:'innt125@gmail.com', // sender address
	  to:email, // list of receivers
	  subject: "Email verification Otp send from innt125@gamil.com", // Subject line
	  text:"", // plain text body
	  html: `Your otp is  <b> ${otp} </b>  Don't share your otp with anyone `, // html body
	});
  
	console.log("Message sent: %s", info.messageId);
	
  }
  

  main().catch(console.error);


			return res.status(200).json({ "result": "true","message":"Please check your email",data});
		  } else {
			return res.status(400).json({
			  "result": "false",
			  "message": "Failed to update user data"
			});
		  }
		
	  } catch (error) {
		return res.status(500).json({ "result": "false", "message": error.message });
	  }

};





const advertisementProduct_list = async (req, res) => {
    try {
        const {status}=req.body;
		if(!status){
			return res.status(400).json({"result":"false","message":"required field is status (1 for innt and 2 for innntout)"})
		}
		if(status=="1"){
        const cat = await Maincategory.findOne({ maincategory_englishName: "Innt" });
        const id = cat._id;
		const categories=await Category.find({maincategoryId:id});
		const catIds=await categories.map(item=>item._id);
        // Find product list
        const productList = await Product.find({adds: 1,categoryId: { $in: catIds } }).limit(10);
		const productIds=await productList.map(item=>item._id);

		// count raters
		const raters=await Rating.find({productId:{$in:productIds}});
		const productIdCounts = raters.reduce((acc, item) => {
			const key = item.productId.toString();
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		  }, {});
		  
		  // Count sales
		  const productCounts = {};
		  const orderList = await Order.find({});
  
		  orderList.forEach(order => {
			  order.products.forEach(product => {
				  const productId = product.productId.toString();
				  productCounts[productId] = (productCounts[productId] || 0) + 1;
			  });
		  });


        const data = productList.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
			rating: item.rating,
			raters: productIdCounts[item._id.toString()] || 0,
			sales: productCounts[item._id.toString()] || 0,
            discount: (item.discount && item.discount.length > 0) ? item.discount[0].discount_value : 0,
            discount_name: (item.discount && item.discount.length > 0) ? item.discount[0].discount_type : null,
        }));

        res.status(200).json({
            "result": "true",
            "message": "Advertisement data retrieved successfully",
            "path": "http://103.104.74.215:3037/uploads/",
            data: data
        });

	}else{
		const cat = await Maincategory.findOne({ maincategory_englishName: "InntOut" });
        const id = cat._id;
		
		const categories=await Category.find({maincategoryId:id});
		const catIds=await categories.map(item=>item._id);
		
        // Find product list
        const productList = await Product.find({ adds: 1,categoryId: { $in: catIds }}).limit(10);
		const productIds=await productList.map(item=>item._id);
		const raters=await Rating.find({productId:{$in:productIds}});
		console.log(raters)
		const productIdCounts = raters.reduce((acc, item) => {
			const key = item.productId.toString();
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		  }, {});
		  
		  // Count sales
		  const productCounts = {};
		  const orderList = await Order.find({});
  
		  orderList.forEach(order => {
			  order.products.forEach(product => {
				  const productId = product.productId.toString();
				  productCounts[productId] = (productCounts[productId] || 0) + 1;
			  });
		  });
		  
  

        const data = productList.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
			rating: item.rating,
			raters: productIdCounts[item._id.toString()] || 0,
			sales: productCounts[item._id.toString()] || 0,
            discount: (item.discount && item.discount.length > 0) ? item.discount[0].discount_value : 0,
            discount_name: (item.discount && item.discount.length > 0) ? item.discount[0].discount_type : null,
        }));

        res.status(200).json({
            "result": "true",
            "message": "Advertisement data retrieved successfully",
            "path": "http://103.104.74.215:3037/uploads/",
            data: data
        });

	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};






// inntcategory basis product list api
const inntCategoryProduct_list=async(req,res)=>{
	try{
	const {categoryId,shopId} = req.body;
	if(!categoryId || !shopId){
		return res.status(400).json({"result":"false","message":"required parameter is categoryId,shopId"})
	}
    
        const productData = await Product.find({categoryId:categoryId,venderId:shopId});

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }

};




const filterproducts = async (req, res) => {
    try {
        const {sub_subcategoryId,categoryId, price, rating, discount,price1 } = req.body;
       
		if (!sub_subcategoryId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are sub_subcategoryId and optional are (price, rating, discount,price1)" });
        }

        let query = {sub_subcategoryId:sub_subcategoryId };

		if (price && price1) {
            query.sale_price = { $gte: price, $lte: price1 };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        if (discount) {
            query["discount.discount_type"] = "Percent";
            query["discount.discount_value"] = { $gte: discount };
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const productData = await Product.find(query);

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const dayOfthedealsProducts_filter = async (req, res) => {
    try {
        const {status,categoryId, price, rating, discount,price1 } = req.body;
       
		if (!status) {
            return res.status(400).json({ "result": "false", "message": "required parameters are status and optional are (price, rating, discount,categoryId,price1(1 for deals and 2 for newarrival))" });
        }
      if(status==1){
        let query = {hot_of_deals_status:1 };

		if (price && price1) {
            query.sale_price = { $gte: price, $lte: price1 };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        if (discount) {
            query["discount.discount_type"] = "Percent";
            query["discount.discount_value"] = { $gte: discount };
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const productData = await Product.find(query);

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });
   
    
}else{
	     let query = {};

		if (price && price1) {
            query.sale_price = { $gte: price, $lte: price1 };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        if (discount) {
            query["discount.discount_type"] = "Percent";
            query["discount.discount_value"] = { $gte: discount };
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const productData = await Product.find(query).sort({_id:-1}).limit(100);

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });

}
	}catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }


};



const tradingNowfilterproducts = async (req, res) => {
    try {
        const { productIds, categoryId, price, rating, discount, price1 } = req.body;

        if (!productIds) {
            return res.status(400).json({ "result": "false", "message": "required parameters are productIds and optional are (price, categoryId, rating, discount, price1)" });
        }

      
        // Convert each string in the productIdsArray to an ObjectId
        const productIdsObjectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

        let query = { _id: { $in: productIdsObjectIds } };

        if (price && price1) {
            query.sale_price = { $gte: price, $lte: price1 };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        if (discount) {
            query["discount.discount_type"] = "Percent";
            query["discount.discount_value"] = { $gte: discount };
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const productData = await Product.find(query);

        if (!productData || productData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Product data not found" });
        }

        const product = productData.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: item.discount[0].discount_value,
            discount_name: item.discount[0].discount_type,
            size: item.size,
            rating: item.rating,
            color: item.color,
        }));

        res.status(200).json({ "result": "true", "message": "Filter product list retrieved successfully", data: product });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const searchProduct= async (req, res) => {
  try {
	const {key}=req.body;
	if(!key){
		res.status(400).json({"result":"false","message":"required field is key"});
	}

    const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
	const categories=await Category.find({maincategoryId:Maincategories});
	const categoryIds = categories.map(category => category._id);
	const productList = await Product.find({ categoryId: { $in: categoryIds },product_name: { $regex: new RegExp(key, "i") } });
    if (!productList || productList.length==0 ) {
      return res.status(400).json({"result":"false","message" : 'Product not found' });
    }
	
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
    res.status(200).json({"result":"true","message":"Products list get sucessfully",data:data});
  }
 } catch (error) {
    res.status(500).json({ error: error.message });
  }

};




// giving rating api 
const inntRating = async (req, res) => {
	const { userId, rating,comment } = req.body;
	if (!userId || !rating) {
		return res.status(400).json({ "result": "false", "message": "required parameters are userId,rating and comment is optional" });

	};

	try {
		const data = await Innt_rating.findOne({ userId: userId });
		if (data) {
			await Innt_rating.findOneAndUpdate({ userId }, { $set: { rating,comment } }, { new: true });
			res.status(200).json({ "result": "true", "message": "data updated sucessfully" })

		} else {
			const insertData = new Innt_rating({ userId,rating,comment });
			await insertData.save();
			res.status(200).json({ "result": "true", "message": "User added rating sucessfully" })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




//checkout list
const InntOutcheckoutList=async(req,res)=>{
	try {
        const {userId} = req.body;
		
		if (!userId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId" });
        }
		const data=await Checkout.findOne({userId,check_status:0,status:1});
         res.status(200).json({ "result": "true", "message": "Checkout list get successfully", data: data });

    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }

};





const inntOutUpdatecarts = async (req, res) => {
    try {
        const { userId, products, cartId } = req.body;

        if (!userId || !products || !cartId) {
            return res.status(400).json({ result: false, message: "Required parameters are userId, cartId, and products" });
        }

        const productUpdates = products.map(product => ({
            productId: product.productId,
            update: {
				attributes: product.attributes,
                qty: product.qty
            }
        }));


        let cart = await Inntoutcart.findOneAndUpdate(
            {_id:cartId,userId:userId,booking_status:0},
            {
                $set: { "products.$[elem].attributes": productUpdates[0].update.attributes, "products.$[elem].qty": productUpdates[0].update.qty }
            },
            { new: true, arrayFilters: [{ "elem.productId": productUpdates[0].productId }] }
        );
       console.log(cart)
        if (!cart) {
            return res.status(400).json({
                result: false,
                message: 'Cart not found or booking_status is not 0'
            });
        } else {
            return res.status(200).json({
                result: true,
                message: 'Cart updated successfully.',
                data: cart
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, message: err.message });
    }
};







const inntOutaddOrder = async (req, res) => {
    try {
        const { userId, addressId,note, checkoutId, payment_status,delivery_place, payType, paymentMode, grand_total} = req.body;

        if (!userId || !checkoutId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId,checkoutId,note,addressId,payment_status,delivery_place,payType,paymentMode,grand_total" });
        }

        const updatedData = {
            addressId,
            delivery_place,
            payType,
            paymentMode,
            grand_total,
			note,
			payment_status,
            check_status: 1,
        }

       
        const findData = await Checkout.findOne({ _id: checkoutId,status:1 });

        const orders = {};
        findData.products.forEach(product => {
            const ordercodes = Math.floor(10000000 + Math.random() * 90000000);
			const verifiedOrdercodes = Math.floor(100000 + Math.random() * 900000);
            const qr = generateRandomString();

            if (!orders[product.shopId]) {
                orders[product.shopId] = {
                    userId: userId,
                    checkoutId: checkoutId,
                    shopId: product.shopId,
                    orderId: ordercodes,
					orderVerification_code:verifiedOrdercodes,
					pay_place:delivery_place,
					delivery_charge:product.shipping_charge,
                    products: [],
					status:1,
                };
            }

            orders[product.shopId].products.push({
                productId: product.productId,
                attributes: product.attributes,
                image: product.image,
                product_name: product.product_name,
                shop_name: product.shop_name,
                qty: product.qty,
                subtotal: product.subtotal,
                discount: product.discount,
                tax: product.tax,
                shipping_charge: product.shipping_charge,
                total: product.total,
                checkout_status: product.checkout_status,
                qrcode: qr,
				payment_status:payment_status,
            });
        });

        const orderDocuments = Object.values(orders);

        await Order.insertMany(orderDocuments);

		await Inntoutcart.findOneAndUpdate({userId:userId,booking_status:0},{booking_status:1},{new:true});
		await Checkout.findOneAndUpdate({userId:userId,check_status:0,status:1},updatedData,{new:true});
        res.status(200).json({ "result": "true", "message": "Order placed successfully", data: orderDocuments });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};




// order list api
const InntorderList=async(req,res)=>{
	try {
        const {userId} = req.body;
		
		if (!userId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId" });
        }
		const data=await Order.find({userId,status:1}).populate('shopId').sort({_id:-1})
		if(data){
         res.status(200).json({ "result": "true", "message": "Order list get successfully", data: data });
    }else{
		res.status(400).json({ "result": "false", "message": "Order does not available successfully", data: data });
	}
    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};



const requestReturn_order=async(req,res)=>{
	try {
        const {productId,shopId,orderId,userId,reason} = req.body;
		
		if (!userId || !productId || !orderId || !reason) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are productId,shopId,orderId,userId,reason" });
        }
         const insertData=new Returnorder({productId,shopId,orderId,userId,return_reason:reason});
		 const data =await insertData.save();
		res.status(400).json({ "result": "false", "message": "Order return request add successfully", data: data });
    } catch (error) {
        // Handle error and return error response
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }

};



const topSale_inntoutPorduct_list=async(req,res)=>{
	try {
		const today = new Date();
		const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
		const matchData = await Order.find({ updatedAt: { $gte: oneWeekAgo, $lte: today } });
		

        const productIds = [];
        const productCounts = {};

        matchData.forEach(order => {
            order.products.forEach(product => {
                productIds.push(product.productId);
                const productId = product.productId;
                productCounts[productId] = (productCounts[productId] || 0) + 1;
            });
        });

        // Find product list
		const Maincategories=await Maincategory.find({maincategory_englishName:"InntOut"});
         const categories=await Category.find({maincategoryId:Maincategories});
		 const categoryIds = categories.map(category => category._id);
        const productList = await Product.find({ _id: { $in: productIds },categoryId:{$in:categoryIds} }).limit(30);

        // Merge productCounts with productList
        const mergedProductList = productList.map(product => ({
            ...product.toObject(),
            count: productCounts[product._id] || 0
        }));

        const data = mergedProductList.map(item => ({
            productId: item._id,
            venderId: item.venderId,
            categoryId: item.categoryId,
            sub_subcategoryId: item.sub_subcategoryId,
            subcategoryId: item.subcategoryId,
            product_name: item.product_name,
            description: item.description,
            image1: item.image1,
            product_code: item.product_code,
            unit_price: item.unit_price,
            sale_price: item.sale_price,
            discount: (item.discount && item.discount.length > 0) ? item.discount[0].discount_value : 0,
            discount_name: (item.discount && item.discount.length > 0) ? item.discount[0].discount_type : null,
        }));

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





//verify phone
const verifyPhone=async(req,res)=>{
	try {
	  const {userId,otp,gender,user_profile,first_name,last_name,dob,email,mobile_number}=req.body;
	  if(!userId || !otp || ! mobile_number){
		return res.status(200).json({"result":"false","message":"required parameters are {userId,otp,gender,user_profile,first_name,last_name,dob,email,mobile_number"})
	  }
	  const matchData = await User.findOne({_id:userId,otp:otp});
	  if (!matchData) {
		res.status(400).json({
		  result: "false",
		  message: "Invalid otp"
		});
	  } else {
	   const data= await User.findByIdAndUpdate({_id:userId},{
		mobile_number,
		email,
		user_profile,
		first_name,
		last_name,
		dob,
		gender,
	},
	{new:true})
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
  
  




  
//verify phone
const verifyEmail=async(req,res)=>{
	try {
	  const {userId,newEmail,otp}=req.body;
	  if(!userId || !otp || ! newEmail){
		return res.status(400).json({"result":"false","message":"required parameters are userId,newEmail,otp"})
	  }
	  const matchData = await User.findOne({_id:userId,otp:otp});
	  if (!matchData) {
		res.status(400).json({
		  result: "false",
		  message: "Invalid otp"
		});
	  } else {
	   const data= await User.findByIdAndUpdate({_id:userId},{email:newEmail},{new:true})
		res.status(200).json({
		  result: "true",
		  message: "Email number verified successfully",
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
  
  


const sendGift=async(req,res)=>{
	try{
		const {sender_userId,message,selectOne,name,contact_medium,amount}=req.body;
		if(!sender_userId){
		return  res.status(400).json({"result":"false","message":"Required fields are sender_userId,message,selectOne,name,contact_medium,amount"});

}     
const validation=await User.findOne({_id:sender_userId});
if(validation.mobile_number==contact_medium || validation.email==contact_medium){
   return  res.status(400).json({"result":"false","message":"You cannot send a gift to yourself"});
}
     const matchData=await User.findOne({ $or: [{ mobile_number: contact_medium }, { email: contact_medium }] });
	 if(!matchData){
		return  res.status(400).json({"result":"false","message":"User is not exixt in Innt"});
	 }
	 const id=matchData._id;
     const generated_code=generateRandomNumber();
      const insertData=new Gift({sender_userId,receiver_userId:id,message,selectOne,name,contact_medium,amount,card_no:generated_code});
	  const data=await insertData.save();
	  res.status(200).json({"result":"true","message":"Data inserted sucessfullly",data:data});
	}catch(err){
		console.log(err.message)
		res.status(400).json({"result":"false","message":err.message})
	}
};




const sentGigt_list=async(req,res)=>{
	try{
		const {sender_userId}=req.body;
		if(!sender_userId){
		return  res.status(400).json({"result":"false","message":"Required fields are sender_userId"});

}     

     const matchData=await Gift.find({sender_userId}).populate('sender_userId');
	 if(!matchData){
		return  res.status(400).json({"result":"false","message":"Record not found"});
	 }
	  res.status(200).json({"result":"true","message":"Gift list got  sucessfullly",data:matchData});
	}catch(err){
		console.log(err.message)
		res.status(400).json({"result":"false","message":err.message})
	}

};



const getGift_list=async(req,res)=>{
	try{
		const {userId}=req.body;
		if(!userId){
		return  res.status(400).json({"result":"false","message":"Required fields are userId"});

}     

     const matchData=await Gift.find({receiver_userId:userId}).populate('sender_userId');;
	 if(!matchData){
		return  res.status(400).json({"result":"false","message":"Record not found"});
	 }
	  res.status(200).json({"result":"true","message":"Gift list got  sucessfullly",data:matchData});
	}catch(err){
		console.log(err.message)
		res.status(400).json({"result":"false","message":err.message})
	}


};




const improvementSuggestion=async(req,res)=>{
	try{
		const {userId,text}=req.body;
		if(!userId){
		return  res.status(400).json({"result":"false","message":"Required fields are userId,text"});

}     
      const insertData=new Suggestion({userId,text});
	  const data=await insertData.save();
	  res.status(200).json({"result":"true","message":"Data inserted sucessfullly",data:data});
	}catch(err){
		console.log(err.message)
		res.status(400).json({"result":"false","message":err.message})
	}
};


const searchInntoutProduct=async(req,res)=>{
	try {
		const {key}=req.body;
		if(!key){
		return res.status(400).json({"result":"false","message":"required field is key"});
		}
	
		const Maincategories=await Maincategory.find({maincategory_englishName:"InntOut"});
		const categories=await Category.find({maincategoryId:Maincategories});
		const categoryIds = categories.map(category => category._id);
		const productList = await Product.find({ categoryId: { $in: categoryIds },product_name: { $regex: new RegExp(key, "i") } });
		if (!productList || productList.length==0 ) {
		  return res.status(400).json({"result":"false","message" : 'Product not found' });
		}
		
			if (productList || productList.length > 0) {
				const data = productList.map(item => ({
					productId: item._id,
					venderId: item.venderId,
					categoryId: item.categoryId,
					sub_subcategoryId:item.sub_subcategoryId,
					subcategoryId:item.subcategoryId,
					product_name: item.product_name,
					description: item.description,
					image1: item.image1,
					product_code: item.product_code,
					unit_price: item.unit_price,
					sale_price: item.sale_price,
					discount: item.discount[0].discount_value,
					discount_name: item.discount[0].discount_type,
	
	
				}));
		res.status(200).json({"result":"true","message":"Products list get sucessfully",data:data});
	  }
	 } catch (error) {
		res.status(500).json({ error: error.message });
	  }

};



const wishList_search = async (req, res) => {
    const { userId, status } = req.body;
    if (!userId || !status) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId and status(1 for l to h, 2 for h to l ,3 for most recent ,4 for least)" });
    }

    try {
        const data = await Like.find({ userId: userId, like_status: 1 }).populate('productId');
        if (!data || data.length === 0) {
            return res.status(404).json({ "result": "false", "message": "No liked products found for the user" });
        }

        let venderID = [];
        data.forEach(item => {
            venderID.push(item.productId.venderId);
        });

        const shopList = await Vender.find({ _id: { $in: venderID } });
        const shopDataMap = {};
        shopList.forEach(item => {
            shopDataMap[item._id.toString()] = {
                venderId: item._id,
                shopname: item.shop_name,
                firstName: item.firstName,
                lastName: item.lastName,
                shop_address: item.shop_address,
                image: item.upload_frontId
            };
        });

        const mergedData = data.map(item => ({
            ...item.toObject(),
            shopInfo: shopDataMap[item.productId.venderId.toString()]
        }));

        let sortedData;
        if (status === "1") {
            sortedData = mergedData.slice().sort((a, b) => a.productId.sale_price - b.productId.sale_price);
        } else if (status === "2") {
            sortedData = mergedData.slice().sort((a, b) => b.productId.sale_price - a.productId.sale_price);
        }else if(status === "3"){
			sortedData = mergedData.slice().sort((a, b) => new Date(b.productId.createdAt) - new Date(a.productId.createdAt));

		}else if(status === "4"){
			sortedData = mergedData.slice().sort((a, b) => new Date(a.productId.createdAt) - new Date(b.productId.createdAt));
		}

        res.status(200).json({ "result": "true", "message": "Product liked data list sorted", data: sortedData });
    } catch (err) {
        console.log(err);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const inntoutToday_offerProduct_list=async(req,res)=>{
	try {
		const Maincategories=await Maincategory.find({maincategory_englishName:"InntOut"});
         const categories=await Category.find({maincategoryId:Maincategories});
		 const categoryIds = categories.map(category => category._id);
		 const productList = await Product.find({ categoryId: { $in: categoryIds },hot_of_deals_status:2});
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}


};



const wishList_Productsearch = async (req, res) => {
    const { userId, key } = req.body;
    if (!userId || !key) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId and key" });
    }

    try {
        const data = await Like.find({ userId: userId, like_status: 1 }).populate('productId');
        if (!data || data.length === 0) {
            return res.status(404).json({ "result": "false", "message": "No liked products found for the user" });
        }

        let vendorID = [];
        data.forEach(item => {
            vendorID.push(item.productId.vendorId);
        });

        const shopList = await Vender.find({ _id: { $in: vendorID } });
        const shopDataMap = {};
        shopList.forEach(item => {
            shopDataMap[item._id.toString()] = {
                vendorId: item._id,
                shopname: item.shop_name,
                firstName: item.firstName,
                lastName: item.lastName,
                shop_address: item.shop_address,
                image: item.upload_frontId
            };
        });

        const mergedData = data.map(item => ({
            ...item.toObject(),
            shopInfo: shopDataMap[item.productId.vendorId]
        }));
        
// Filter mergedData based on product name matching the regular expression
const regex = new RegExp(key, "i"); // "i" flag for case-insensitive matching
const filteredData = mergedData.filter(item =>
    regex.test(item.productId.product_name)
);

      
        res.status(200).json({ "result": "true", "message": "Product liked data list sorted", data: filteredData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }
};



const addReportOf_product=async(req,res)=>{
	const {productId,text,title,userId,shopId} = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are productId,title,text,userId,shopId" });
    }

    try {
        const data = new Report_product({productId,text,userId,title,shopId});
        const insertData=await data.save();
        res.status(200).json({ "result": "true", "message": "Product  report sent sucessfully", data: insertData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};




const Addfriends=async(req,res)=>{
	try {
	const {userId,friendId,qrcode} = req.body;
    if (!userId ) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId,friendId,qrcode" });
    }

	if(userId === friendId){
	 return res.status(400).json({ "result": "false", "message": "Same user"});
	}


        const dataMatch = await User.findOne({_id:friendId,friend_qrcode:qrcode});
       if(!dataMatch){
		return res.status(400).json({ "result": "false", "message": "User not found"});
	   }

	   const validation = await Friend.findOne({friendId,userId});
       if(validation){
		return res.status(400).json({ "result": "false", "message": "You have added in your friend list"});
	   }
       
	    const insertData=new Friend({userId,friendId});
		const data=await insertData.save();
        res.status(200).json({ "result": "true", "message": "Friend added sucessfully", data:data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};



const friendList = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameter is userId" });
    }

    try {
        // Fetch friends where the user is `userId`
        const data1 = await Friend.find({ userId }).populate('friendId').sort({ _id: -1 });

        // Fetch friends where the user is `friendId`
        const data2 = await Friend.find({ friendId: userId }).populate('userId').sort({ _id: -1 });

        // Map data to required format
        const filtr1 = data1.map(item => ({
            userId: item.userId,
            friendId: item.friendId,
        }));

        const filtr2 = data2.map(item => ({
            userId: item.friendId,
            friendId: item.userId,
        }));

        // Merge the two datasets
        const mergedData = [...filtr1, ...filtr2];

        // Remove duplicates by `_id` field if necessary
        // Assuming each friend relation has a unique `_id` in `Friend` model
        const uniqueMergedData = mergedData.filter((item, index, self) =>
            index === self.findIndex((t) =>
                t.userId._id.equals(item.userId._id) && t.friendId._id.equals(item.friendId._id)
            )
        );

        // Check if there is data
        if (uniqueMergedData.length === 0) {
            return res.status(404).json({ "result": "false", "message": "User has no friends" });
        }

        // Return the response
        res.status(200).json({ "result": "true", "message": "Friend list retrieved successfully", data: uniqueMergedData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": "An error occurred while fetching the friend list" });
    }
};





const getDataToQrcode=async(req,res)=>{
	const {qrcode} = req.body;
    if (!qrcode ) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are qrcode" });
    }

    try {
		const data = await User.findOne({ $or: [{ friend_qrcode: qrcode }, { payment_qrcode: qrcode }] });
       if(!data){
		const matchData = await Order.findOne({ 
			qrcodes: qrcode,
			
		}).populate('userId checkoutId shopId');
	
		if (matchData) {
			
			const checkdata = await Checkout.findOne({ _id: matchData.checkoutId }).populate('addressId');
			const address = {
			addressId:checkdata.addressId?._id || 0,
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
		 
	   
			
	     const responseData={
			_id: matchData._id,
			userId: matchData.userId._id,
			first_name: matchData.userId.first_name,
			last_name: matchData.userId.last_name,
			mobile_number: matchData.userId.mobile_number,
			email: matchData.userId.email,
			orderVerification_code: matchData.orderVerification_code, 
			checkoutId: matchData.checkoutId._id,
			paymentMode: matchData.checkoutId.paymentMode,
			delivery_place: matchData.checkoutId.delivery_place,
			shopId: matchData.shopId._id,
			shop_venderfirstName:matchData.shopId.firstName,
			shop_venderlastName:matchData.shopId.lastName,
			shop_mobile_number:matchData.shopId.mobile_number,
			workHours:matchData.shopId.workHours,
			shop_address:matchData.shopId.shop_address,
			country:matchData.shopId.country,
			shop_name:matchData.shopId.shop_name,
			shop_image:matchData.shopId.shop_logo,
			city:matchData.shopId.city,
			orderId: matchData.orderId, 
			createdAt: matchData.createdAt,
			updatedAt: matchData.updatedAt,
			order_Id: matchData._id, 
			qrcodes: matchData.qrcodes,
			order_status: matchData.status,
			products:matchData.products,
			...address 
	

		 };
		 res.status(200).json({
			"result": "true",
			"message": "Order details retrieved successfully " ,
			"path": "http://103.104.74.215:3037/uploads/",
			data: responseData
		});
		}else{
           
			return res.status(400).json({ "result": "false", "message": "User not found"});
		}
	   }else{
		
	    res.status(200).json({ "result": "true", "message": "Qrcode scanned  sucessfully", data:data });
	   }
		
	   
 
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};




const sendMoney_request=async(req,res)=>{
	const {qrcode,amount,senderId} = req.body;
    if (!qrcode  || !senderId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are qrcode,amount,senderId" });
    }

    try {
        const data = await User.findOne({payment_qrcode:qrcode});
		const datas = await User.findOne({_id:senderId});
       if(!data || !datas){
		return res.status(400).json({ "result": "false", "message": "User not found"});
	   }

	   if(datas.wallet<amount){
		return res.status(400).json({ "result": "false", "message": "You have not sufficient blance"});
	   }

	   const otp=generate_otp();
	   await User.findOneAndUpdate({_id:senderId},{otp:otp},{new:true});
	   const dinu={
		 fname:data.first_name,
		 lname:data.last_name,
		 amount:amount,
		 senderId:senderId,
		 otp:otp,
		 receiverId:data._id,
	   }
		
        res.status(200).json({ "result": "true", "message": "Otp generates scanned  sucessfully", data:dinu });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }


};





//send  loyalty points of friends
const sendloyalty_points=async(req,res)=>{
	try {
	const {points,senderId,key} = req.body;
    if (!points || !senderId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are points,senderId,key(send email and mobile in key parameter)" });
    }

        const data = await User.findOne({_id:senderId});
       if(!data){
		return res.status(400).json({ "result": "false", "message": "User not found"});
	   }
	   if(data.loyalty_point<points){
		return res.status(400).json({ "result": "false", "message": "You have not sufficient loyalty points"});
	   }
	   
	   const findreceiverData = await User.findOne({$or:[{email:key},{mobile_number:key}]});
	   if(!findreceiverData){
		return res.status(400).json({ "result": "false", "message": "This phone number and email not exist user"});
	   }
	   const _id=findreceiverData._id;
	  
	   const findFriend = await Friend.findOne({$or:[{userId:senderId,friendId:_id},{userId:_id,friendId:senderId}]});
	   if(!findFriend){
		return res.status(400).json({ "result": "false", "message": "Sorry, you are not friend with this user"});
	   }
			
		const reduces=Number(data.loyalty_point - points);
		const added=Number(findreceiverData.loyalty_point + points);
		await User.findOneAndUpdate({_id:senderId},{loyalty_point:reduces},{new:true});
		await User.findOneAndUpdate({_id:_id},{loyalty_point:added},{new:true});
        res.status(200).json({ "result": "true", "message": "You request have done sucessfully"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};



const addCashback=async(req,res)=>{
	try {
	const {userId} = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId" });
    }

        const data = await User.findOne({_id:userId});
       if(!data){
		return res.status(400).json({ "result": "false", "message": "User not found"});
	   }
	   const money=Number(data.loyalty_point*0.002);
	   if(money<1000){
		return res.status(400).json({ "result": "false", "message": "You have not sufficient Cashback"});
	   }
	   
	   const otp=generate_otp();
		const dinu=await User.findOneAndUpdate({_id:userId},{otp:otp},{new:true});
		const dt={
			otp:dinu.otp
		}
        res.status(200).json({ "result": "true", "message": "You request have done sucessfully",data:dt});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};






const verificationCashback_otp=async(req,res)=>{
	try {
	const {userId,otp} = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId,otp" });
    }

        const data = await User.findOne({_id:userId,otp:otp});
       if(!data){
		return res.status(400).json({ "result": "false", "message": "Invalid otp"});
	   }
	   const money=Number(data.loyalty_point*0.002);
	   const wallet_money=Number(data.wallet + money).toFixed(2);
		await User.findOneAndUpdate({_id:userId},{wallet:wallet_money,loyalty_point:0},{new:true});
	//transjection
	    const transId=generateRandomNumber();
		const insertedData=new Transjection ({transjectionId:transId,userId:userId,amount:wallet_money,payment_status:"sucess",payment_type:"Cashback"});
		await insertedData.save();
        res.status(200).json({ "result": "true", "message": "You request have done sucessfully"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};


const user_queries=async(req,res)=>{
	try {
		const {userId,title,message,phone,email,lname,fname} = req.body;
		if (!userId || !message) {
			return res.status(400).json({ "result": "false", "message": "Required parameters are userId,title,message,phone,email,lname,fname" });
		}
	    
		 const insertData=new userQuery({userId,title,message,phone,email,lname,fname});
		 const data=await insertData.save();
			res.status(200).json({ "result": "true", "message": "You request inserted sucessfully",data:data});
		} catch (err) {
			console.log(err);
			res.status(500).json({ "result": "false", "message": err.message });
		}
	
	};




//tranferMoney  
const tranferMoney =async(req,res)=>{
	try {
	const {amount,senderId,key} = req.body;
    if (!amount || !senderId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are amount,senderId,key(send email and mobile in key parameter)" });
    }

        const data = await User.findOne({_id:senderId});
       if(!data){
		return res.status(400).json({ "result": "false", "message": "User not found"});
	   }
	   if(data.wallet<amount){
		return res.status(400).json({ "result": "false", "message": "You have not sufficient blance"});
	   }
	   
	   const findreceiverData = await User.findOne({$or:[{email:key},{mobile_number:key}]});
	   if(!findreceiverData){
		return res.status(400).json({ "result": "false", "message": "Sorry, This phone number or email not exist in innt application"});
	   }
         const otp=generate_otp();
	      await User.findOneAndUpdate({_id:senderId},{otp:otp},{new:true});
		  const dinu={
			fname:findreceiverData.first_name,
			lname:findreceiverData.last_name,
			amount:amount,
			senderId:senderId,
			otp:otp,
			receiverId:findreceiverData._id,
		  }
        res.status(200).json({ "result": "true", "message": "You request have done sucessfully",data:dinu});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};





const verificationsendMoney_otp=async(req,res)=>{
	const {senderId,otp,receiverId,amount} = req.body;
    if (!senderId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are senderId,receiverId and otp,amount " });
    }

    try {
        const data = await User.findOne({_id:senderId,otp:otp});
		const findreceiverData = await User.findOne({_id:receiverId});
       if(!data || !findreceiverData){
		return res.status(400).json({ "result": "false", "message": "Incorrect otp"});
	   }

	    const transId=generateRandomNumber();
		const reduces=Number(data.wallet - amount);
		const added=Number(Number(findreceiverData.wallet) + Number(amount));
		await User.findOneAndUpdate({_id:senderId},{wallet:reduces},{new:true});
		await User.findOneAndUpdate({_id:receiverId},{wallet:added},{new:true});
		const insertedData=new Transjection ({transjectionId:transId,userId:senderId,receiverId:receiverId,amount,payment_status:"Transfer",payment_type:"Sent"});
		await insertedData.save();
        res.status(200).json({ "result": "true", "message": "Request have done sucessfully"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }


};




	
//send  loyalty points of friends
const transjection_history =async(req,res)=>{
	try {
	const {userId} = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameters are userId" });
    }

        const data = await Transjection.find({$or:[{userId:userId},{receiverId:userId}]}).populate('receiverId userId').sort({_id:-1});
       if(!data){
		return res.status(400).json({ "result": "false", "message": "Data not found"});
	   }
	   
	     // Iterate through data array to update status
		 data.forEach(item => {
            if (item.receiverId?._id.toString() === userId.toString()) {
                item.payment_type = "Received";
            }
        });
		
        res.status(200).json({ "result": "true", "message": "You request have done sucessfully",data:data});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }

};






const inntOutShop_list = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Check if latitude and longitude are provided
        if (!latitude || !longitude) {
            return res.status(400).json({ result: false, message: "Required parameters are missing: latitude, longitude" });
        }

        const Maincategories = await Maincategory.findOne({ maincategory_englishName: "InntOut" });
        const Id = Maincategories._id;

        const shopList = await Vender.find({ serviceType: Id });

        // Check if shopList is empty after filtering
        if (!shopList || shopList.length === 0) {
            return res.status(404).json({ result: false, message: "No shops found" });
        }

        // Filter shops within 100km radius
        const nearbyShops = shopList.filter(store => {
            const storeLat = store.location.coordinates[1];
            const storeLon = store.location.coordinates[0];
            const distance = calculateDistance(latitude, longitude, storeLat, storeLon);
            return distance <= 100; // Check if the distance is within 100km
        });
       
        res.status(200).json({
            result: true,
            message: "Shop list retrieved successfully",
            data: nearbyShops
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, message: err.message });
    }
};





//Talk to store 
/*------------------------user to store chat api------------------------- */
const userSend_message=async(req,res)=>{
	const {text,venderId,friendId,userId,adminId,driverId,send_status} = req.body;
	if(!send_status){
	  return res.status(400).json({"result":"false","message":"required parameter are venderId,driverId,adminId,friendId,userId,text,send_status(1 for vender 3 friend,2 admin and 4 driver user for 0)"})
	};
  
	try {
	  if(!req.file){
	  const newMessage = new Chat({text,venderId,friendId,userId,adminId,driverId,send_status});
	  await newMessage.save();
	  res.status(200).json({"result":"true","message":'Message sent successfully' });
	}else{
	  const Message = new Chat({venderId,friendId,userId,adminId,driverId,send_status,text:req.file.filename});
	  await Message.save();
	  res.status(200).json({"result":"true","message":'Message sent successfully'});
	}
	} catch (error) {
	  console.log(error);
	  res.status(400).json({"message":error.mesage});
	}
  
  };
  
  

  

const userGet_message=async(req,res)=>{
	const {venderId,userId,friendId} = req.body;
	if(!userId ){
	  return res.status(400).json({"result":"false","message":"required parameter are userId and optional are venderId and friendId"})
	};
  
	try {

	  if(userId && venderId){

	  const messages = await Chat.find({venderId,userId}).populate('venderId');
	  if(messages.length>0){
		await Chat.updateMany({venderId,userId,send_status:0,status:0},{status:1},{new:true});
		const data =await messages.map(item=>({
			vendorId:item.venderId._id,
			firstName:item.venderId.firstName,
			lastName:item.venderId.lastName,
			shop_image:item.venderId.shop_logo,
			upload_backsideId:item.venderId.upload_backsideId,
			shop_name:item.venderId.shop_name ,
			shop_address:item.venderId.shop_address ,
			country:item.venderId.country,
			city:item.venderId.city ,
			userId: item.userId,
            text:item.text,
            status:item.status,
            send_status:item.send_status ,
            createdAt:item.createdAt,
            updatedAt:item.updatedAt,

		}));
		res.status(200).json({"result":"true","message":'Customer messages list get sucessfully',data:data });
	  }else{
		res.status(400).json({"result":"false","message":'Data does not found'});
	  }
	}



	// Fetch messages sent by the user where send_status is 0 or 1
	const messages = await Chat.find({friendId,userId:userId,send_status:3 }).populate('friendId').lean();
	const firstData=await messages.map(item=>({
		friendId:item.friendId._id,
		fname: item.friendId.first_name, 
		lname: item.friendId.last_name, 
		mobile_number: item.friendId.mobile_number,
		image: item.friendId.user_profile, 
		text: item.text,
		status: item.status,
		send_status:"Sent",
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));
	const messagess = await Chat.find({friendId:userId,userId:friendId,send_status:3 }).populate('userId').lean();
	const secondData=await messagess.map(item=>({
		friendId:item.userId._id,
		fname: item.userId.first_name, 
		lname: item.userId.last_name, 
		mobile_number: item.userId.mobile_number,
		image: item.userId.user_profile, 
		text: item.text,
		status: item.status,
		send_status:"Received",
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));

	const mergedMessages = [...firstData, ...secondData];
	mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	if(mergedMessages.length>0){
	await Chat.updateMany({friendId:userId,status:0},{status:1},{new:true});
	
	  res.status(200).json({"result":"true",
	  "message":'Customer messages list get sucessfully',
	  data:mergedMessages
	 });

	  
	}else{
	  res.status(400).json({"result":"false","message":'Data does not found'});
	}

	  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({"message": error.mesage});
	}
  
  };
  




const allChatList = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameter userId is missing" });
    }

    try {
        // Fetch messages sent by the user where send_status is 0 or 1
        const messages = await Chat.find({ 
			userId:userId,venderId:{$ne:null},
			$or: [
				{ send_status: 1 },
				{ send_status: 0 },
			]
			
		}).populate('venderId').lean().sort({_id:-1});
		const firstData=await messages.map(item=>({
			ID:item.venderId._id,
			fname: item.venderId.firstName, 
            lname: item.venderId.lastName, 
            mobile_number: item.venderId.mobile_number,
            image: item.venderId.shop_logo, 
			shop_name: item.venderId.shop_name, 
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
			  if (item.ID && item.status=="0" && item.send_status=="0") {
				const ID = item.ID.toString();
				msgCount[ID] = (msgCount[ID] || 0) + 1;
			}

		});

		// Merge firstData with msgCount
const mergedFirstData = firstData.map(item => ({
    ...item,
    msgCount: msgCount[item.ID] || 0 // Add message count to each item
}));



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


		const messagess = await Chat.find({ 
			friendId:userId,send_status:3,userId:{$ne:null} 
		}).populate('userId').lean().sort({_id:-1});
		const secondData=await messagess.map(item=>({
			friendId:item.userId._id,
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

		const messagesss = await Chat.find({ 
			userId:userId,send_status:3,friendId:{$ne:null} 
		}).populate('friendId').lean().sort({_id:-1});

		const thirdData=await messagesss.map(item=>({
			friendId:item.friendId._id,
			fname: item.friendId.first_name, 
            lname: item.friendId.last_name, 
            mobile_number: item.friendId.mobile_number,
            image: item.friendId.user_profile, 
            text: item.text,
            status: item.status,
            send_status: item.send_status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
		}));

// msgcount
const msgCounts = {};
messagess.forEach(item => {
   // Increment message count for venderId or friendId based on the current user's role
   if (item.userId && item.status=="0") {
	 const userId = item.userId._id.toString();
	 msgCounts[userId] = (msgCounts[userId] || 0) + 1;
 }

});


// Merge msgCount data with mergedMessages
const mergedMessages = [...secondData, ...thirdData].map(item => ({
	...item,
	msgCount: msgCounts[item.friendId?._id.toString()] || 0
}));


// Create an object to store unique friendIds
const uniqueFriendIds = {};

// Filter the mergedMessages array
const filteredMessages1 = mergedMessages.filter(item => {
    if (!uniqueFriendIds[item.friendId]) {
        uniqueFriendIds[item.friendId] = true;
        return true;
    }
    
    // If the friendId already exists, return false to exclude the item
    return false;
});




const finalMurged=[...filteredMessages, ...filteredMessages1];
finalMurged.sort((a, b) => b.createdAt - a.createdAt);



        if (finalMurged.length > 0) {
            res.status(200).json({ "result": "true", "message": 'All chat list retrieved successfully',
			finalMurged

	  }); 
        } else {
            res.status(404).json({ "result": "false", "message": 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": error.message });
    }
};

  



const friendChatList = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ "result": "false", "message": "Required parameter userId is missing" });
    }

    try {
        // Fetch messages sent by the user where send_status is 0 or 1
        const messages = await Chat.find({userId:userId,send_status:3,friendId:{$ne:null}}).populate('friendId').lean().sort({_id:-1});
		const firstData=await messages.map(item=>({
			friendId:item.friendId._id,
			fname: item.friendId.first_name, 
            lname: item.friendId.last_name, 
            mobile_number: item.friendId.mobile_number,
            image: item.friendId.user_profile, 
            text: item.text,
            status: item.status,
            send_status: item.send_status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
		}));
		const messagess = await Chat.find({friendId:userId,send_status:3,userId:{$ne:null} }).populate('userId').lean().sort({_id:-1});
        const secondData=await messagess.map(item=>({
			friendId:item.userId._id,
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
   


           // msgcount
		   const msgCount = {};
		   messagess.forEach(item => {
			  // Increment message count for venderId or friendId based on the current user's role
			  if (item.userId && item.status=="0") {
				const userId = item.userId._id.toString();
				msgCount[userId] = (msgCount[userId] || 0) + 1;
			}

		});


		// Merge msgCount data with mergedMessages
       const mergedMessages = [...firstData, ...secondData].map(item => ({
        ...item,
        msgCount: msgCount[item.friendId?._id.toString()] || 0
   }));
		   mergedMessages.sort((a, b) => b.createdAt - a.createdAt);
	   

// Create an object to store unique friendIds
const uniqueFriendIds = {};

// Filter the mergedMessages array
const filteredMessages = mergedMessages.filter(item => {
    if (!uniqueFriendIds[item.friendId]) {
        uniqueFriendIds[item.friendId] = true;
        return true;
    }
    
    // If the friendId already exists, return false to exclude the item
    return false;
});

        if (filteredMessages.length > 0) {
            res.status(200).json({ "result": "true", "message": 'Friend chat list retrieved successfully',
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




const coupon_list=async(req,res)=>{
	try {
		const { userId } = req.body;
		if (!userId) {
			return res.status(400).json({ "result": "false", "message": "Required parameter userId is missing" });
		}
	
		const today = new Date(); // Get the current date
		today.setHours(0, 0, 0, 0);
		// Format the date as YYYY-MM-DD
		const formattedToday = today.toISOString().split('T')[0];
		
		const couponList = await Promotion.find({act_status:1,
			expire_date: { $gte: formattedToday }
		});
        if (!couponList || couponList.length === 0) {
            return res.status(404).json({ result: false, message: "No coupons found" });
        }
        res.status(200).json({
            result: true,
            message: "Shop list retrieved successfully",
            data: couponList
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, message: err.message });
    }

};





const socicalMedia_login=async(req,res)=>{
	try {
	const {socical_media_id,type,first_name,last_name,fcm_id,email,user_profile,mobile_number} = req.body;
	if(!socical_media_id || !fcm_id){
	  return res.status(400).json({"result":"false","message":"required parameter are socical_media_id,first_name,last_name,fcm_id,type(1 for facebook,2 for google and 3 app)"})
	};

	 const validation=await User.findOne({socical_media_id,type});
	 if(validation){
		res.status(200).json({"result":"true","message":'User login successfully',data:validation});
	 }else{
	const otps = generate_otp();
    const userName = first_name + last_name + otps;
     
	  const insertData = new User({socical_media_id,type,last_name,userName,first_name,fcm_id,email,user_profile,mobile_number});
	  const data= await insertData.save();
	  res.status(200).json({"result":"true","message":'User login successfully',data:data});
	}}
    catch (error) {
	  console.log(error);
	  res.status(400).json({"message":error.mesage});
	}

};





const takeUserAddress = async (req, res) => {
    try {
        const {userId,addressId,checkoutId,delivery_place} = req.body;

        if (!userId || !checkoutId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId,addressId,checkoutId,delivery_place" });
        }

        const updatedData = {
            addressId,
            delivery_place,
        }
		await Checkout.findOneAndUpdate({userId:userId,_id:checkoutId},updatedData,{new:true});

        // calculate delivery charge
		
if (addressId) {
    const findlatlon = await User_Address.findOne({ _id: addressId });
   let latitude = findlatlon.location.coordinates[1];
   let longitude = findlatlon.location.coordinates[0];

const findData=await Checkout.findOne({userId:userId,_id:checkoutId,check_status:0});
const shopIds = [];
findData.products.forEach(item => {
    shopIds.push(item.shopId.toString());
});


const shopDistances = []; 

const shopList = await Vender.find({ _id: { $in: shopIds } });

shopList.forEach(shop => {
    const storeLat = shop.location.coordinates[1];
    const storeLon = shop.location.coordinates[0];
    const distance = calculateDistance(latitude, longitude, storeLat, storeLon).toFixed(1);
	const shipping_charge=Number(distance*0.9).toFixed(2);
    shopDistances.push({ shopId: shop._id, distance: distance,shipping_charge:shipping_charge });
});
const updatePromises = shopDistances.map(async ({ shopId, shipping_charge }) => {
    await Checkout.findOneAndUpdate(
        { _id: checkoutId },
        { $set: { "products.$[elem].shipping_charge": shipping_charge } },
        { arrayFilters: [{ "elem.shopId": shopId }] }
    );
});

await Promise.all(updatePromises);

}

const charges=await Checkout.findOne({userId:userId,_id:checkoutId});

let charge = 0;
const seenShopIds = new Set();
charges.products.forEach(product => {
    const shopId = product.shopId.toString();
    if (!seenShopIds.has(shopId)) {
        charge += product.shipping_charge;
        seenShopIds.add(shopId);
        
    }
});


const  delivery_charge_value=Number(charge.toFixed(2))
const data={
    delivery_fee:delivery_charge_value || 0,
};

        res.status(200).json({ "result": "true", "message": "Data added successfully",
		data:delivery_charge_value
	});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};








const filterShop= async (req, res) => {
    try {
        const {rating} = req.body;
        if (!rating) {
            return res.status(400).json({ "result": "false", "message": "required parameters is rating" });
        }

		//get innt shoplist
		const Maincategories = await Maincategory.findOne({ maincategory_englishName: "Innt" });
        const Id = Maincategories._id;

        const shopList = await Vender.find({serviceType: Id });
		const shopID =await shopList.map(item=>item._id);
        const shopData = await Vender.find({_id:shopID});
        if (!shopData || shopData.length === 0) {
            return res.status(400).json({ "result": "false", "message": "Shop  not found" });
        }

		const averageRatings = await Shoprating.aggregate([
			{ $match: { shopId: { $in: shopID} } }, 
			{
			  $group: {
				_id: "$shopId",
				averageRating: { $avg: { $toDouble: "$rating" } } // Calculate average rating
			  }
			}
		  ]);
	  
		   // Create a map for average ratings
		   const ratingsMap = new Map();
		   averageRatings.forEach(rating => {
			   ratingsMap.set(rating._id.toString(), rating.averageRating);
		   });
   
		   // Merge shop data with average ratings
		   const data = shopData.map(item => ({
			   shopId: item._id,
			   shop_name: item.shop_name,
			   logo: item.shop_logo,
			   frontImage: item.upload_frontId,
			   shop_address: item.shop_address,
			   country: item.country,
			   city: item.city,
			   lon: item.location.coordinates[0],
			   lat: item.location.coordinates[1],
			   average_ratings: ratingsMap.get(item._id.toString()) || 0
		   }));
   
		  // Filter the data based on the provided rating
		  const filteredData = data.filter(item => item.average_ratings >= rating);

		  if (filteredData.length === 0) {
			  return res.status(400).json({ "result": "false", "message": "Record not found" });
		  }
    
        res.status(200).json({ 
			"result": "true",
		    "message": "Filter product list retrieved successfully",
		     data:filteredData
	});

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};



// userRefferal history
const refferalHistory= async (req, res) => {
    try {
        const {userId} = req.body;
        if (!userId) {
            return res.status(400).json({ "result": "false", "message": "required parameters is userId" });
        }

		const data=await Refferal.find({friendId:userId}).populate('userId').sort({_id:-1});
		  if (data.length === 0) {
			  return res.status(400).json({ "result": "false", "message": "Record not found" });
		  }
		  const datas=await data.map(item=>({
			userId:item.friendId,
			image:item.user_profile,
			friendFirst_name:item.userId.first_name,
			friendLast_name:item.userId.last_name,
			amount:item.amount,
			createdAt:item.createdAt,
			updatedAt:item.updatedAt
		  }))
    
        res.status(200).json({ 
			"result": "true",
		    "message": "Refferal history list retrieved successfully",
		     data:datas
	});

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }
};





// cart list
const website_cartList = async (req, res) => {
    try {
        const { userId, status } = req.body;
        if (!userId || status === undefined) {
            return res.status(400).json({ "result": "false", "message": "required parameters are userId, status" });
        }

        const cart_data = await Cart.find({ userId: userId, booking_status: 0, status: status })
            .populate({
                path: 'products.productId',
                populate: { path: 'venderId' }
            });

        if (!cart_data || cart_data.length === 0 || !cart_data[0].products || cart_data[0].products.length === 0) {
            return res.status(400).json({
                "result": "false",
                "message": "Carts do not found",
                "data": []
            });
        }

        // Helper function to reorder attributes
        const reorderAttributes = (product_variations, attributes) => {
            return product_variations.map(variation => {
                const attr = attributes.find(attr => attr.name.toLowerCase() === variation.attribute_name.toLowerCase());
                if (attr) {
                    const { value } = attr;
                    const { attribute_values } = variation;

                    // Reorder the attribute_values so that value comes first
                    const reorderedValues = [value, ...attribute_values.filter(val => val !== value)];

                    return {
                        ...variation,
                        attribute_values: reorderedValues
                    };
                }
                return variation;
            });
        };

        // Iterate over cart_data to reorder attributes
        cart_data.forEach(cart => {
            cart.products.forEach(product => {
                if (product.productId.product_variation && product.attributes) {
                    product.productId.product_variation = reorderAttributes(product.productId.product_variation, product.attributes);
                }
            });
        });

        const charge = await Charge.findOne({});
        return res.status(200).json({
            "result": "true",
            "message": "cart_list data get successfully",
            "data": cart_data,
            "charge": charge
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "result": "false", "message": error.message });
    }
};




const website_InnoutcartList = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are userId" });
        }

        const cart_data = await Inntoutcart.find({ userId: userId, booking_status: 0 })
            .populate({
                path: 'products.productId',
                populate: { path: 'venderId' }
            });

        if (!cart_data || cart_data.length === 0 || !cart_data[0].products || cart_data[0].products.length === 0) {
            return res.status(400).json({
                "result": "false",
                "message": "Carts not found",
                "data": []
            });
        }

        // Helper function to reorder attributes
        const reorderAttributes = (product_variations, attributes) => {
            return product_variations.map(variation => {
                const attr = attributes.find(attr => attr.name.toLowerCase() === variation.attribute_name.toLowerCase());
                if (attr) {
                    const { value } = attr;
                    const { attribute_values } = variation;

                    // Reorder the attribute_values so that value comes first
                    const reorderedValues = [value, ...attribute_values.filter(val => val !== value)];

                    return {
                        ...variation,
                        attribute_values: reorderedValues
                    };
                }
                return variation;
            });
        };

        // Iterate over cart_data to reorder attributes
        cart_data.forEach(cart => {
            cart.products.forEach(product => {
                if (product.productId.product_variation && product.attributes) {
                    product.productId.product_variation = reorderAttributes(product.productId.product_variation, product.attributes);
                }
            });
        });

        const charge = await Charge.findOne({});
        res.status(200).json({
            "result": "true",
            "message": "cart_list data retrieved successfully",
            data: cart_data,
            charge
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "result": "false", "message": error.message });
    }
};



//set default address
const setDefault_address = async (req, res) => {
    try {
        const { userId, addressId } = req.body;

        // Validate input
        if (!userId || !addressId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are userId and addressId" });
        }

        // Find the user's addresses
        const findData = await User_Address.find({ userId });

        // Update all addresses status
        for (const item of findData) {
            if (item._id.toString() === addressId) {
                // Set status to 1 for the matching addressId
                await User_Address.findByIdAndUpdate(addressId, { status: 1 });
            } else {
                // Set status to 0 for all other addresses
                await User_Address.findByIdAndUpdate(item._id, { status: 0 });
            }
        }

        // Return the updated data
        const updatedData = await User_Address.find({ userId });
        res.status(200).json({ "result": "true", "message": "Address set successfully", "data": updatedData });
    } catch (err) {
        res.status(500).json({ "result": "false", "message": err.message });
    }
};




const find_orderDetails_byqrcode=async(req,res)=>{
	try {
		const {qrcode } = req.body;
		if (!qrcode) {
			return res.status(400).json({ "result": "false", "message": "required parameters are  qrcode" });
		}
	
		const matchData = await Order.findOne({ 
			qrcodes: qrcode,
			
		}).populate('userId checkoutId shopId');
	
	
		 const checkdata = await Checkout.findOne({ _id: matchData.checkoutId }).populate('addressId');
		 const address = {
		 addressId:checkdata.addressId?._id || 0,
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
	     const responseData={
			_id: matchData._id,
			userId: matchData.userId._id,
			first_name: matchData.userId.first_name,
			last_name: matchData.userId.last_name,
			mobile_number: matchData.userId.mobile_number,
			email: matchData.userId.email,
			orderVerification_code: matchData.orderVerification_code, 
			checkoutId: matchData.checkoutId._id,
			paymentMode: matchData.checkoutId.paymentMode,
			delivery_place: matchData.checkoutId.delivery_place,
			shopId: matchData.shopId._id,
			shop_venderfirstName:matchData.shopId.firstName,
			shop_venderlastName:matchData.shopId.lastName,
			shop_mobile_number:matchData.shopId.mobile_number,
			workHours:matchData.shopId.workHours,
			shop_address:matchData.shopId.shop_address,
			country:matchData.shopId.country,
			shop_name:matchData.shopId.shop_name,
			shop_image:matchData.shopId.shop_logo,
			city:matchData.shopId.city,
			orderId: matchData.orderId, 
			createdAt: matchData.createdAt,
			updatedAt: matchData.updatedAt,
			products:matchData.products,
			...address 
	

		 };
		 
	
		res.status(200).json({
			"result": "true",
			"message": "Order details retrieved successfully " ,
			"path": "http://103.104.74.215:3037/uploads/",
			data: responseData
		});
	
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
	};
	
	
	


const deleteUser=async(req,res)=>{
	try {
        const {userId,reason,text} = req.body;
        if (!userId) {
            return res.status(400).json({ "result": "false", "message": "required parameters is userId,reason,text" });
        }

		const data=await User.findOne({_id:userId});
		  if (data.length === 0) {
			  return res.status(400).json({ "result": "false", "message": "Record not found" });
		  }
		  const insertData=new User_delete({userId,reason,text});
		  await insertData.save();
		  await User.findOneAndUpdate({_id:userId},{user_status:2},{new:true});
    
        res.status(200).json({ 
			"result": "true",
		    "message": "User deleted successfully",
		     data:data
	});

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ "result": "false", "message": err.message });
    }

};




const similarInntproductLists=async(req,res)=>{
	try {
		const {subSubcategoryId}=req.body;
		if(!subSubcategoryId){
			return res.status(400).json({"result":"false","message":"Required parameter are subSubcategoryId "})
		}
		// const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
        //  const categories=await Category.find({maincategoryId:Maincategories});
		 //const categoryIds = categories.map(category => category._id);
		 const productList = await Product.find({sub_subcategoryId:subSubcategoryId}).sort({ _id: -1 });
		if (productList || productList.length > 0) {
			const data = productList.map(item => ({
				productId: item._id,
				venderId: item.venderId,
				categoryId: item.categoryId,
				sub_subcategoryId:item.sub_subcategoryId,
				subcategoryId:item.subcategoryId,
				product_name: item.product_name,
				description: item.description,
				image1: item.image1,
				product_code: item.product_code,
				unit_price: item.unit_price,
				sale_price: item.sale_price,
				discount: item.discount[0].discount_value,
				discount_name: item.discount[0].discount_type,


			}));
			res.status(200).json({ "result": "true", "message": "product data get sucessfully", data: data })
		} else {
			res.status(400).json({ "result": "false", "message": "Records not found" })
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })

	}


};



// // sendOtp.js
// require('dotenv').config();
// const send_otp = async (req, res) => {
// 	try{
   
// const credentials = {
//     apiKey:process.env.AFRICASTALKING_API_KEY,   
//     username:process.env.AFRICASTALKING_USERNAME,
// };
// const AfricasTalking = require('africastalking')(credentials);

// // Initialize a service e.g. SMS
// const sms = AfricasTalking.SMS
// const otp = Math.floor(100000 + Math.random() * 900000);
// // Use the service
// const options = {
//     to: '+918302278240',
//     message: `hiit ${otp}`
	
	
// }

// const response = await sms.send(options);
//   res.status(200).json({result:"true",data:response})
// }catch(err){
// 	console.log(err)
// 	res.status(500).json({ result: "false", error: err.message });
// }
// };




// sendOtp.js
require('dotenv').config();
const send_otp = async (req, res) => {
	try{
   
const credentials = {
    apiKey:process.env.AFRICASTALKING_API_KEY,   
    username:process.env.AFRICASTALKING_USERNAME,
};
const AfricasTalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS
const otp = Math.floor(100000 + Math.random() * 900000);
// Use the service
const options = {
    to: ['+918302278240'],
    message:`hiit ${otp}`

}

const response = await sms.send(options);
  res.status(200).json({result:"true",data:response})
}catch(err){
	console.log(err)
	res.status(500).json({ result: "false", error: err.message });
}
};







/*....................exports variables...........*/
module.exports = {
	userSignup_api,
	userLogin_api,
	resendOtp,
	verifyOtp,
	forgotPassword,
	verifyEmail_andMobile,
	resetPassword,
	updateUser_profile,
	getUser_profile,
	banner_list,
	About_us_list,
	term_and_condiction_list,
	contactUs_list,
	faq_list,
	pulicy_list,
	AddUserAddress,
	Update_address,
	Delete_address,
	Get_address,
	InntCategory_list,
	InntoutCategory_list,
	subCategory_list,
	like_dislike_product_api,
	likeProduct_listApi,
	givingRating_api,
	userLogin_withSocicalMedia,
	sub_subcategoryBase_productList,
	productDetails,
	subSubcategory_list,
	givingShoprating,
	deleteLikeProduct_listApi,
	Addcart,
	cartList,
	deleteCart,
	categoryBase_productList,
	inntOut_productDetails,
	AddMultiplecarts,
	deleteMultipleCart,
	checkOut,
	addOrder,
	orderList,
	orderDetails,
	checkoutList,
	inntFooterbanner_list,
    inntOutFooterbanner_list,
    inntOutHeaderbanner_list,
	newArrival_Product_list,
	dayOftheDeals_ProductList,
	likeMultipleProducts,
	inntAllProduct_list,
	Updatecarts,
	addViewproduct,
	suggested_ProductList,
	changeAddress,
    updateOrder_status,
	inntShop_list,
	inntShop_details,
	filterShopProduct,
	//Chat
	userSend_message,
	userGet_message,
	favouriteShop,
    favouriteShopList,
	trendingNow,
	AddInntoutCart,
    InnoutcartList,
    deleteinntoutCart,
	updatePhone,
    updateEmail,
	advertisementProduct_list,
	inntCategoryProduct_list,
    filterproducts,   
	dayOfthedealsProducts_filter,
	tradingNowfilterproducts,
	searchProduct,
	inntRating,
	InntOutcheckoutList,
	inntOutUpdatecarts,
	inntOutaddOrder,
	InntorderList,
	requestReturn_order,
	topSale_inntoutPorduct_list,
	verifyPhone,
	verifyEmail,
	sendGift,
    sentGigt_list,
    getGift_list,
	improvementSuggestion,
    searchInntoutProduct,
    wishList_search,
	inntoutToday_offerProduct_list,
	wishList_Productsearch,
	addReportOf_product,
	getDataToQrcode,
	Addfriends,
	friendList,
	sendMoney_request,
	verificationsendMoney_otp,
	sendloyalty_points,
	addCashback,
	verificationCashback_otp,
	user_queries,
	tranferMoney,
	transjection_history,
	inntOutShop_list,
	allChatList,
	friendChatList,
	removefavouriteShop,
	coupon_list,
	socicalMedia_login,
	takeUserAddress,
	filterShop,
	refferalHistory,
	website_cartList,
	website_InnoutcartList,
	send_otp,
	setDefault_address,
	find_orderDetails_byqrcode,
	deleteUser,
	similarInntproductLists,

};