/*.........import models............*/
const User = require("../models/user_models");
const Banner = require("../models/banner_models");
const Faq = require("../models/faq_models");
const Contact = require("../models/contact_us_models");
const Privacy = require("../models/privacy_pulicy_models");
const About = require("../models/about_us_models");
const Term = require("../models/term_and_condiction_models");
const Subcategory = require("../models/subcategory_models");
const Category = require("../models/category_models");
const Admin = require("../models/admin_models");
const Language = require("../models/language_models");
const Vender = require("../models/vender_models");
const bannerType = require("../models/bannerType_models");
const Sub_subcategory = require("../models/sub_subcategory_models");
const Maincategory=require("../models/main_category");
const Product=require("../models/products_models");
const Brand=require("../models/brand");
const ProductType=require("../models/product_type");
const Charge=require("../models/charges");
const Return_policy=require("../models/return_policy");
const Refund_policy=require("../models/refund_policy");
const Cancellation_policy=require("../models/cancellation_policy");
const Order=require("../models/order");
const Shopfavourite=require("../models/favourite_shop");
const Like = require("../models/like_models");
const Checkout=require("../models/checkout");
const Driver=require("../models/driver_models");
const shopRating=require("../models/shop_rating");
const Viewshops=require("../models/view_shops");
const Rating=require("../models/rating_models");
const Innt_rating=require("../models/innt_rating");
const Withdraw=require("../models/withdraw");
const Returnorder=require("../models/return_order");
const Transjection=require("../models/transjection");
const Suggestion=require("../models/user_suggestion");
const Emergancy_support=require("../models/emergancy_support");
const userQuery=require("../models/user_query");
const Attribute=require("../models/attributes");
const Notification=require("../models/notification");


/*............import dependancies................*/
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { status } = require("init");
const admin = require("firebase-admin");



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



/*........................CREATE API................*/

/*...................create banner api..........*/
const create_banner_api = async (req, res) => {
	try {
		const { banner_type, resource_type, banner_url } = req.body;
		const banner_image = req.file ? req.file.filename : null;

		if (!banner_image || !banner_type || !resource_type) {
			res.status(400).json({ "result": "false", "message": "required parameter banner_image,banner_type,resource_type and banner_url is optional" });

		} else {

			const banner_data = new Banner({
				banner_image,
				banner_type,
				resource_type,
				banner_url

			});
			const data = await banner_data.save();
			res.status(200).json({ "result": "true", "message": "Banner inserted sucessfully", data: data });
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};


// Banner list api
const get_banner_api = async (req, res) => {
	try {
		const banner_data = await Banner.find({});
		if (!banner_data) {
			res.status(400).json({ "result": "false", "message": "Banner does not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "Banner list are", data: banner_data });
		}


	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};



// Banner update api
const update_banner_api = async (req, res) => {
	try {
		const { bannerId, banner_type, resource_type, banner_url } = req.body;
		const banner_image = req.file ? req.file.filename : null;

		if (!banner_image || !bannerId) {
			res.status(400).json({ "result": "false", "message": "required parameter bannerId,banner_image, bannerId,banner_type,resource_type,banner_url" });

		} else {
			if(req.file){
			const banner_data = await Banner.findByIdAndUpdate({ _id: bannerId }, {
				$set: {
					banner_image,
					banner_type,
					resource_type,
					banner_url
				}
			},
				{ new: true });
			res.status(200).json({ "result": "true", "message": "Banner updated sucessfully" });
		}else{
			const banner_data = await Banner.findByIdAndUpdate({ _id: bannerId }, {
				$set: {
					
					banner_type,
					resource_type,
					banner_url
				}
			},
				{ new: true });
			res.status(200).json({ "result": "true", "message": "Banner updated sucessfully" });

		}
	}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};



// Banner  delete api
const delete_banner_api = async (req, res) => {
	try {

		const { bannerId } = req.body;

		if (!bannerId) {
			res.status(400).json({ "result": "false", "message": "required parameter bannerId" });

		} else {

			const data = await Banner.findByIdAndDelete({ _id: bannerId });
			res.status(200).json({ "result": "true", "message": "Banner deleted sucessfully" });
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

};



// active and deactive banner api
const activeDeactive_banner = async (req, res) => {
	const { bannerId } = req.body;

	if (!bannerId) {
		res.status(400).json({ "result": "false", "message": "required parameter bannerId" });
	};
	try {

		const findData = await Banner.findOne({ _id: bannerId });
		if (findData.active_status == 0) {
			const data = await Banner.findByIdAndUpdate({ _id: bannerId }, { $set: { active_status: 1 } }, { new: true });
			res.status(200).json({ "result": "true", "message": " Banner Deactive sucessfully" })
		} else {
			await Banner.findByIdAndUpdate({ _id: bannerId }, { $set: { active_status: 0 } }, { new: true });
			res.status(200).json({ "result": "true", "message": " Banner Active sucessfully" })
		}
	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};


const getBanner_byId = async (req, res) => {
	try {

		const { bannerId } = req.body;

		if (!bannerId) {
			res.status(400).json({ "result": "false", "message": "required parameter bannerId" });

		} else {

			const data = await Banner.findOne({ _id: bannerId });
			res.status(200).json({ "result": "true", "message": "Banner data sucessfully", data: data });
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}



};



// bannerType list
const bannerType_list = async (req, res) => {
	try {
		const data = await bannerType.find({});
		if (!data) {
			return res.status(404).json({
				"result": "false",
				"message": "bannerType not found"
			});
		}

		return res.status(200).json({
			"result": "true",
			"message": "bannerType list",
			"data": data
		});

	} catch (err) {
		return res.status(400).json({
			"result": "false",
			"message": err.message
		});
	}



};




/*  .........................end baanner operation................. */


/* ----------------........Category Start..............---------------- */
// create main category
const mainCategory=async(req,res)=>{
	try {
		const {maincategory_englishName, maincategory_frenchName } = req.body;
		const maincategory_image = req.file ? req.file.filename : null;
		if (!maincategory_englishName) {
			res.status(400).json({ "result": "false", "message": "require parameters is maincategory_englishName and optionals are maincategory_frenchName,maincategory_image" })
		} else {
			const insertData = new Maincategory({
				maincategory_englishName,
				maincategory_frenchName,
				maincategory_image,

			});
			const data = await insertData.save();
			res.status(200).json({ "result": "true", "message": "Maincategory inserted sucessfully", data: data })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


//main category list
const mainCategory_list = async (req, res) => {
	try {
		const Data = await Maincategory.find({acrtive_status:0});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": " Maincategory list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



//main category list
const get_mainCategory_list = async (req, res) => {
	try {
		const Data = await Maincategory.find({});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": " Maincategory list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



// create category api
const createCategory = async (req, res) => {
	try {
		const { maincategoryId, category_englishName, category_frenchName } = req.body;
		const category_image = req.file ? req.file.filename : null;
		if (!maincategoryId || !category_englishName || !category_frenchName || category_image == null) {
			res.status(400).json({ "result": "false", "message": "require parameters are maincategoryId,category_englishName,category_frenchName,category_image " })
		} else {
			const insertData = new Category({
				maincategoryId,
				category_englishName,
				category_frenchName,
				category_image,

			});
			const data = await insertData.save();
			res.status(200).json({ "result": "true", "message": "Category inserted sucessfully", data: data })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


// update category api
const updateCategory = async (req, res) => {
	try {
		const { maincategoryId, category_englishName, category_frenchName, categoryId } = req.body;
		const category_image = req.file ? req.file.filename : null;
		if (!categoryId) {
			res.status(400).json({ "result": "false", "message": "require parameters is categoryId and optionals are maincategoryId,category_englishName,category_frenchName,category_image " })
		} else {
			if(req.file){
				
			const modifiedData = await Category.findByIdAndUpdate({ _id: categoryId },
				{ $set: { category_image, maincategoryId, category_englishName, category_frenchName } }, { new: true });
			res.status(200).json({ "result": "true", "message": "Category updated sucessfully", data: modifiedData })
			}else{

			const modifiedData = await Category.findByIdAndUpdate({ _id: categoryId },
				{ $set: {maincategoryId, category_englishName, category_frenchName } }, { new: true });
			res.status(200).json({ "result": "true", "message": "Category updated sucessfully", data: modifiedData })
		}
	}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

}; 


//category list api
const getCategory = async (req, res) => {
	try {
		const Data = await Category.find({}).populate("maincategoryId").sort({ _id: -1 });
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": " Category list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};






// category active and deactive api
const activeDeactive_category = async (req, res) => {
	try {
		const { categoryId } = req.body;
		if (!categoryId) {
			res.status(400).json({ "result": "false", "message": "required parameter is categoryId" });

		} else {
			const findData = await Category.findOne({ _id: categoryId });
			if (findData.acrtive_status == 0) {
				const data = await Category.findByIdAndUpdate({ _id: categoryId }, { $set: { acrtive_status: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Category Deactive sucessfully" })
			} else {
				await Category.findByIdAndUpdate({ _id: categoryId }, { $set: { acrtive_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Category Active sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}



};


//delete subcategory api
const deleteCategory = async (req, res) => {
	const { categoryId } = req.body;
	if (!categoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is categoryId" })
	};
	try {
		const data = await Category.findById({ _id: categoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Category is not found" })
		} else {
			await Category.findByIdAndDelete({ _id: categoryId })
			res.status(200).json({ "result": "true", "message": "category deleted sucessfully" })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });

	}


};

//get category by id
const getCategory_byId = async (req, res) => {
	const { categoryId } = req.body;
	if (!categoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is categoryId" })
	};
	try {
		const data = await Category.findById({ _id: categoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Category is not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "category list is", data: data })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



//categorySearch_api
const categorySearch_api = async (req, res) => {
	const { search_key } = req.body;

	if (!search_key) {
		return res.status(400).json({
			"result": "false",
			"message": "required parameter is search_key"
		});
	}

	try {
		// Use regex for case-insensitive search on both English and French names
		const data = await Category.find({
			$or: [
				{ category_englishName: { $regex: new RegExp(search_key, 'i') } },
				{ category_frenchName: { $regex: new RegExp(search_key, 'i') } }
			]
		});

		if (!data || data.length === 0) {
			return res.status(404).json({
				"result": "false",
				"message": "Category not found"
			});
		}

		return res.status(200).json({
			"result": "true",
			"message": "Category list",
			"data": data
		});

	} catch (err) {
		return res.status(500).json({
			"result": "false",
			"message": err.message
		});
	}
};




/*..................................Category End.................... */


/* .................................SubCategory Start................ ...*/
// create subcategory api
const createSubcategory = async (req, res) => {
	try {
		const { english_subcategory_name, french_subcategory_name, categoryId } = req.body;
		const subcategory_image = req.file ? req.file.filename : null;
		if (!categoryId || !english_subcategory_name || !french_subcategory_name || subcategory_image == null) {
			res.status(400).json({ "result": "false", "message": "require parameters are english_subcategory_name,french_subcategory_name,categoryId,subcategory_image " })
		} else {
			const insertData = new Subcategory({
				categoryId,
				english_subcategory_name,
				french_subcategory_name,
				subcategory_image
			});
			const data = await insertData.save();
			res.status(200).json({ "result": "true", "message": "Category inserted sucessfully", data: data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


// update subcategory api
const updateSubcategory = async (req, res) => {
	try {
		const { english_subcategory_name, french_subcategory_name, subcategoryId } = req.body;
		const subcategory_image = req.file ? req.file.filename : null;
		if (!subcategoryId) {
			res.status(400).json({ "result": "false", "message": "require parameters is subcategoryId and optionals are english_subcategory_name,french_subcategory_name,subcategory_image " })
		} else {
			if(req.file){
			const modifiedData = await Subcategory.findByIdAndUpdate({ _id: subcategoryId },
				{ $set: { subcategory_image, english_subcategory_name, french_subcategory_name } }, { new: true });
			res.status(200).json({ "result": "true", "message": "SubCategory updated sucessfully", data: modifiedData })
		}
	else{
		const modifiedData = await Subcategory.findByIdAndUpdate({ _id: subcategoryId },
			{ $set: {english_subcategory_name, french_subcategory_name } }, { new: true });
		res.status(200).json({ "result": "true", "message": "SubCategory updated sucessfully", data: modifiedData })
	}

		}
	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




// subcategory list api
const getSubcategory = async (req, res) => {
	try {
		const Data = await Subcategory.find({}).populate('categoryId');
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": " SubCategory list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


//get subcategory by id
const getSubcategory_byId = async (req, res) => {
	const { subcategoryId } = req.body;
	if (!subcategoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is subcategoryId" })
	};
	try {
		const data = await Subcategory.findById({ _id: subcategoryId }).populate('categoryId').sort({ _id: -1 });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Subcategory is not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "Subcategory list is", data: data })
		}

	} catch (err) {

	}

};


//delete subcategory api
const deleteSubcategory = async (req, res) => {
	const { subcategoryId } = req.body;
	if (!subcategoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is subcategoryId" })
	};
	try {
		const data = await Subcategory.findById({ _id: subcategoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "Subcategory is not found" })
		} else {
			await Subcategory.findByIdAndDelete({ _id: subcategoryId });
			res.status(200).json({ "result": "true", "message": "Subcategory deleted sucessfully" })
		}

	} catch (err) {

	}


};



// subcategory active and deactive api
const activeDeactive_subcategory = async (req, res) => {
	try {
		const { subcategoryId } = req.body;
		if (!subcategoryId) {
			res.status(400).json({ "result": "false", "message": "required parameter is subcategoryId" });

		} else {
			const findData = await Subcategory.findOne({ _id: subcategoryId });
			if (findData.active_status == 0) {
				const data = await Subcategory.findByIdAndUpdate({ _id: subcategoryId }, { $set: { active_status: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Subcategory Deactive sucessfully" })
			} else {
				await Subcategory.findByIdAndUpdate({ _id: subcategoryId }, { $set: { active_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Subcategory Active sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}



};


//sucategorySearch_api
const subcategorySearch_api = async (req, res) => {
	const { search_key } = req.body;

	if (!search_key) {
		return res.status(400).json({
			"result": "false",
			"message": "required parameter is search_key"
		});
	}

	try {
		// Use regex for case-insensitive search on both English and French names
		const data = await Subcategory.find({
			$or: [
				{ english_subcategory_name: { $regex: new RegExp(search_key, 'i') } },
				{ french_subcategory_name: { $regex: new RegExp(search_key, 'i') } }
			]
		});

		if (!data) {
			return res.status(404).json({
				"result": "false",
				"message": "Subategory not found"
			});
		}

		return res.status(200).json({
			"result": "true",
			"message": "Subategory list",
			"data": data
		});

	} catch (err) {
		return res.status(500).json({
			"result": "false",
			"message": err.message
		});
	}

};


/* ---------------........SubCategory End.............------------ */


// Insert_subSubcategory  api
const Insert_subSubcategory = async (req, res) => {
	try {
		const { english_sub_subcategory_name, french_sub_subcategory_name, subcategoryId } = req.body;
		//const {sub_subcategory_image} = req.file ? req.file.filename : null;
		if (!subcategoryId || !english_sub_subcategory_name || !french_sub_subcategory_name) {
			return res.status(400).json({ "result": "false", "message": "require parameters are english_sub_subcategory_name,french_sub_subcategory_name,subcategoryId " });
		}
			const insertData = new Sub_subcategory({
				subcategoryId,
				english_sub_subcategory_name,
				french_sub_subcategory_name,
				

			});
			const data = await insertData.save();
			res.status(200).json({ "result": "true", "message": "Sub subategory inserted sucessfully", data: data })
	

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message })
	}

};



// update subcategory api
const updatesubSubcategory = async (req, res) => {
	try {
		const {sub_subcategoryId ,english_sub_subcategory_name, french_sub_subcategory_name} = req.body;
		//const subcategory_image = req.file ? req.file.filename : null;
		if (!sub_subcategoryId) {
			res.status(400).json({ "result": "false", "message": "require parameters is sub_subcategoryId and optionals are english_sub_subcategory_name,french_sub_subcategory_name,subcategory_image " })
		} else {
			const modifiedData = await Sub_subcategory.findByIdAndUpdate({ _id: sub_subcategoryId },
				{ $set: {sub_subcategoryId, english_sub_subcategory_name, french_sub_subcategory_name } }, { new: true });
			res.status(200).json({ "result": "true", "message": "SubCategory updated sucessfully", data: modifiedData })
		}
	
	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



// subcategory list api
const getsubSubcategory = async (req, res) => {
	try {
		const Data = await Sub_subcategory.find({}).populate('subcategoryId').sort({ _id: -1 });
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "subSubCategory list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



//get subcategory by id
const getsubSubcategory_byId = async (req, res) => {
	const { sub_subcategoryId } = req.body;
	if (!sub_subcategoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is subcategoryId" })
	};
	try {
		const data = await Sub_subcategory.findById({ _id: sub_subcategoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "subSubcategory is not found" })
		} else {
			res.status(200).json({ "result": "true", "message": "subSubcategory list is", data: data })
		}

	} catch (err) {

	}

};


//delete subcategory api
const deletesubSubcategory = async (req, res) => {
	const { sub_subcategoryId } = req.body;
	if (!sub_subcategoryId) {
		res.status(400).json({ "result": "false", "message": "required parameter is subcategoryId" })
	};
	try {
		const data = await Sub_subcategory.findById({ _id: sub_subcategoryId });
		if (!data) {
			res.status(400).json({ "result": "false", "message": "subSubcategory is not found" })
		} else {
			await Sub_subcategory.findByIdAndDelete({ _id: sub_subcategoryId });
			res.status(200).json({ "result": "true", "message": "subSubcategory deleted sucessfully" })
		}

	} catch (err) {

	}


};




// products operation start
const productList= async (req, res) => {
	try {
		const Data = await Product.find({status:1}).sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "products list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



const product_approve = async (req, res) => {
	try {
		const {productId,status } = req.body;
		if (!productId || !status) {
			return res.status(400).json({ "result": "false", "message": "required parameter is productId,status(1 for approve and 2 for denied)" });
		}
		
			const findData = await Product.findOne({ _id: productId });
			if (status==="1") {
				const data = await Product.findByIdAndUpdate({ _id: productId }, { $set: {status: status} }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product approved sucessfully" })
			} else {	
			 await Product.findByIdAndUpdate({ _id: productId }, { $set: {status: status} }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product denied sucessfully "})
			}
		

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




//product details
const productDetails=async(req,res)=>{
	try{
		const {productId}=req.body;
		if (!productId) {
		return 	res.status(400).json({ "result": "false", "message": "required parameter is productId" });

		}
		const data=await Product.findById({_id:productId});
		res.status(200).json({"result":"true","message":"details",data:data})

	}catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};





/*.....................................start saller operation ................ */
//  Vender or seller list api
const sallerList_api = async (req, res) => {
    try {
        const data = await Vender.find({}).sort({_id: -1});
        if (!data) {
            res.status(400).json({ "result": "false", "message": "Data not found" });
        } else {
            const productCount = await Promise.all(data.map(async (seller) => {
                const products = await Product.countDocuments({venderId: seller._id});
                return {
                    ...seller.toObject(),
                    productCount: products
                };
            }));
            res.status(200).json({ "result": "true", "message": "Vender list is successfully", data: productCount });
        }
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};









// block  and unblock seller 
const sallerBlock_unblock_api = async (req, res) => {
	try {
		const { sallerId } = req.body;
		if (!sallerId) {
			res.status(400).json({ "result": "false", "message": "required parameter is sallerId" });

		} else {
			const findData = await Vender.findOne({ _id: sallerId });
			if (findData.active_status == 0) {
				const data = await Vender.findByIdAndUpdate({ _id: sallerId }, { $set: { active_status: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Vender blocked sucessfully" })
			} else {
				await Vender.findByIdAndUpdate({ _id: sallerId }, { $set: { active_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Vender unblock sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}



};



// sallerDetails api
const sallerDetails = async (req, res) => {
    try {
        const { sallerId } = req.body;
        if (!sallerId) {
            return res.status(400).json({ "result": "false", "message": "required parameter is sallerId" });
        }

// sellers heighlights
		const raters=await shopRating.find({shopId:sallerId}).countDocuments();
		const rater=await shopRating.find({shopId:sallerId});
	  const views=await Viewshops.find({shopId:sallerId}).countDocuments();
	  const matchData = await Order.find({ shopId: sallerId});
	  
  //count average rating
		const totalRating = (rater && rater.length > 0)
	? rater.reduce((sum, rating) => sum + parseInt(rating.rating), 0): 0;
  
	const average_ratings = raters > 0 ? Number(totalRating / raters) : 0;
  
  //count sales
  const sales= matchData.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0);
  const data={
	raters_count:raters,
	average_ratings:average_ratings!== null ? average_ratings : 0,
	view_count:views,
	sales_count:sales
  }
	  



        const findData = await Vender.findOne({ _id: sallerId });
        if (findData) {
            const products = await Product.countDocuments({ venderId: sallerId });
            const sellerDetails = {
                ...findData.toObject(),
				...data,
                productCount: products
            };

            res.status(200).json({ "result": "true", "message": "Vender details successfully", data: sellerDetails });
        } else {
            res.status(400).json({ "result": "false", "message": "Vender not found" });
        }
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




const sallerSignup = async (req, res) => {
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
		password,
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
						"upload_frontId,upload_backsideId,vender_profile,shop_logo,shop_licence,password";
	  
			return res.status(400).json({
			  "result": "false",
			  "message":msg
			});
		  }

         const hashedPassword=await bcrypt.hash(password, 10);

		const matchData = await Vender.findOne({ mobile_number });
		if (!matchData) {
			const workHour = JSON.parse(workHours);
			const insertData = new Vender({
				firstName,
		shop_name,
		lastName,
		dob,
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
		password:hashedPassword,
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
				.json({ result: true, message: "Data inserted successfully", data: data });
		}
		else {
			res.status(400).json({ "result": "false", "message": "Seller allready exist" });
		}

	} catch (err) {
		res.status(400).json({ result: false, message: err.message });
	}
};






// seller approved api
const sellerApproved=async(req,res)=>{
	try {
		const {sellerId } = req.body;
		if (!sellerId) {
			res.status(400).json({ "result": "false", "message": "required parameter is sellerId" });

		} else {
			const findData = await Vender.findOne({ _id: sellerId });
			if (findData.vender_status===0) {
				const data = await Vender.findByIdAndUpdate({ _id: sellerId }, { $set: {vender_status: 1} }, { new: true });
				res.status(200).json({ "result": "true", "message": " Vender approved sucessfully" })
			} else {	
				res.status(200).json({ "result": "true", "message": " Vender allready approved"})
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




/*........................................customer details api............. */

// Customer list api
const customerList = async (req, res) => {
	try {
		const data = await User.find({}).sort({ _id: -1 });
		if (!data) {
			res.status(400).json({ "result": "true", "message": "Data does not found" })

		} else {
			const filterData=data.map(item=>({
				userId:item._id,
				firstName:item.first_name,
				lastName:item.last_name,
				email:item.email,
				phone:item.mobile_number,
				active_status:item.active_status,
				user_profile:item.user_profile,
				createdAt:item.createdAt,

			}));
			
			res.status(200).json({ "result": "true", "message": " Customer list is sucessfully", data: filterData })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};



// user block_unblock api
const userBlock_unblock_api = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) {
			res.status(400).json({ "result": "false", "message": "required parameter is userId" });

		} else {
			const findData = await User.findOne({ _id: userId });
			if (findData.user_status == 0) {
				const data = await User.findByIdAndUpdate({ _id: userId }, { $set: { user_status: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Customer blocked sucessfully" })
			} else {
				await User.findByIdAndUpdate({ _id: userId }, { $set: { user_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Customer unblock sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}



};

//customerDetails
const customerDetails = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) {
			res.status(400).json({ "result": "false", "message": "required parameter is userId" });

		} else {
			const findData = await User.findOne({ _id: userId });
			if (findData) {
				const data = await User.findOne({ _id: userId });
				res.status(200).json({ "result": "true", "message": " Customer details show sucessfully", data: data })
			} else {

				res.status(400).json({ "result": "true", "message": " Customer does not found" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};

/*........................customers end operation.................... */




const createBrand = async (req, res) => {
    try {
        const { categoryId, brand } = req.body;
        if (!categoryId || !brand) {
            return res.status(400).json({ "result": "false", "message": "required parameters are categoryId and brand" });
        }

        const existingSize = await Brand.findOne({categoryId });

        if (existingSize) {
            if (existingSize.brand) {
                existingSize.brand.push(brand);
            } else {
                existingSize.brand = [brand];
            }
            const updatedSize = await existingSize.save();
            res.status(200).json({ "result": "true", "message": "Data added successfully" });
        } else {
            const newSize = new Brand({
                categoryId,
                brand:brand
            });
            const savedSize = await newSize.save();
            res.status(200).json({ "result": "true", "message": "New data added successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "result": "false", "message": error.message });
    }
};



const brandList=async(req,res)=>{
	try {  
        const existingSize = await Brand.find({}).populate("categoryId");
		if(!existingSize){
			res.status(400).json({"result":"false","message":"Records does not found",data:existingSize})
		}else{
            res.status(200).json({ "result": "true", "message": "Brand list get successfully",data:existingSize });
		 }
        }
     catch (error) {
        console.error(error);
        res.status(500).json({ "result": "false", "message": error.message });
    }

};



/*  .........................privacy and pulicy start operation................. */
// create privacy pollicy api
const create_privacy = async (req, res) => {
	try {
		const { title, text, type } = req.body;
		if (!title || !text || !type) {
			return res.status(400).json({ "result": "false", "message": "require parameters are title, text, and type (user for 1 and vendor for 2)" });
		}

		let matchData = await Privacy.findOne({ type });

		if (matchData) {
			if (matchData.type === 1) {
				const updated = await Privacy.findOneAndUpdate({ type: 1 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			} else if (matchData.type === 2) {
				const updated = await Privacy.findOneAndUpdate({ type: 2 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			}
		} else {
			const insertData = new Privacy({ title, text, type });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted successfully", data: data });
		}
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ "result": "false", "message": err.message });
	}
};




// privacy list api
const privacy_list = async (req, res) => {
	try {

		const data = await Privacy.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "privacy list are", data: data });
		}


	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })
	}

};



// create contact us api
const create_contactUs = async (req, res) => {
	try {

		const { client_name, phone_no, email, whatsapp_number } = req.body;
		if (!client_name || !phone_no || !email || !whatsapp_number) {
			res.status(400).json({ "result": "false", "message": "required parameter client_name,phone_no,email,whatsapp_number" });

		} else {

			const insertData = new Contact({
				client_name,
				phone_no,
				email,
				whatsapp_number,

			});
			const data = await insertData.save();
			res.status(200).json({ "result": "true", "message": "data  inserted sucessfully", data: data });
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}


};


// contact us list api
const contactUs_list = async (req, res) => {
	try {

		const data = await Contact.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "contact list are", data: data });
		}


	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })
	}

};


// contact us update api
const updateContact_us = async (req, res) => {
	try {
		const { client_name, whatsapp_number, email, contactId, phone_no } = req.body;

		if (!client_name || !phone_no || !email || !whatsapp_number || !contactId) {
			return res.status(400).json({ "result": "false", "message": "Required parameters are client_name, phone_no, email, whatsapp_number, contactId" });
		} else {
			// Use await to get the modified data
			const modifiedData = await Contact.findByIdAndUpdate(
				{ _id: contactId },
				{ $set: { client_name, whatsapp_number, email, phone_no } },
				{ new: true }
			);

			// Check if data is modifiedData or null
			if (!modifiedData) {
				return res.status(400).json({ "result": "false", "message": "Contact not found with the provided ID" });
			}

			return res.status(200).json({ "result": "true", "message": "Contact updated successfully", data: modifiedData });
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({ "result": "false", "message": err.message });
	}
};






// faq create api
const create_faq = async (req, res) => {
	try {
		const { title, text } = req.body;
		if (!title || !text) {
			return res.status(400).json({ "result": "false", "message": "require parameter are title,text" });
		}

			const insertData = new Faq({ title, text });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted sucessfully", data: data });


	} catch (err) {
		console.log(err.message)
	}
};





// faq list api
const faq_list = async (req, res) => {
	try {

		const data = await Faq.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "faq list are", data: data });
		}


	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })
	}

};



// create about us api
const create_about_us = async (req, res) => {
	try {
		const { title, text, type } = req.body;
		if (!title || !text || !type) {
			return res.status(400).json({ "result": "false", "message": "require parameters are title, text, and type (user for 1 and vendor for 2)" });
		}

		let matchData = await About.findOne({type});

		if (matchData) {
			if (matchData.type === "1") {
				const updated = await About.findOneAndUpdate({ type: 1 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			} else if (matchData.type ==="2") {
				const updated = await About.findOneAndUpdate({ type: 2 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			}
		} else {
			const insertData = new About({ title, text, type });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted successfully", data: data });
		}


	} catch (err) {
		console.log(err.message)
	}

};




// about list api
const aboutUs_list = async (req, res) => {
	try {

		const data = await About.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "About list are", data: data });
		}


	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })
	}

};




const Term_condiction = async (req, res) => {
	try {
		const { title, text, type } = req.body;
		if (!title || !text || !type) {
			return res.status(400).json({ "result": "false", "message": "require parameters are title, text, and type (user for 1 and vendor for 2 , 3 for driver)" });
		}

		let matchData = await Term.findOne({ type });

		if (matchData) {
			if (matchData.type === 1) {
				const updated = await Term.findOneAndUpdate({ type: 1 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			} else if (matchData.type === 2) {
				const updated = await Term.findOneAndUpdate({ type: 2 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			} else if(matchData.type === 3){
				const updated = await Term.findOneAndUpdate({ type: 3 }, { title, text, type }, { new: true });
				res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updated });
			}

		} else {
			const insertData = new Term({ title, text, type });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted successfully", data: data });
		}
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ "result": "false", "message": err.message });
	}
};




// Term and condiction list api
const Term_condiction_list = async (req, res) => {
	try {

		const data = await Term.find({});
		if (!data) {
			res.status(200).json({ "result": "false", "message": "data does not found" });

		} else {
			res.status(200).json({ "result": "false", "message": "Term & condiction list are", data: data });
		}


	} catch (err) {
		console.log(err.message)
		res.status(400).json({ "result": "false", "message": err.message })
	}

};






//   Admin singup api
const AdminSignup = async (req, res) => {
	try {
		const { email, password,type,first_name,last_name,address,restrictions } = req.body;
		if (!email || !password) {
		return 	res.status(400).json({ "result": "false", "message": "required parameter are email,password,restrictions,first_name,last_name,address" });
		}

		const matchData = await Admin.findOne({ email: email });
		if (matchData) {
			res.status(400).json({ "result": "false", "message": "Staff allready exist" })
		} else {
			// Hash the password before saving it
			const hashedPassword = await bcrypt.hash(password, 10);

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
		

			const newUser = new Admin({ email, password: hashedPassword,first_name,last_name,address,type:1,restrictions:parsedRestrictions });
			const data = await newUser.save();
			res.status(200).json({ "result": "true", "message": "Staff created sucessfully", data: data })
		}
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




//  Admin  Login api
const AdminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
		 return	res.status(400).json({ "result": "false", "message": "required parameter are email,password" });
		} 
			const matchData = await Admin.findOne({email});
			if (!matchData) {
				return res.status(400).json({ "result": "false",
					"message": "Invalid email and password"
					})
			}
			if(matchData.staff_status=="1"){
				return res.status(400).json({ "result": "false", "message": "Your account has been blocked" });
			}

			if(matchData.type=="0"){
				// Compare the provided password with the hashed password in the database
				const passwordMatch = await bcrypt.compare(password, matchData.password);
 
				if (!passwordMatch) {
                    return res.status(400).json({ "result": "false", "message": "Invalid email and password" });
				}else{
					// Generate a JWT token
					const token = jwt.sign({ adminId: matchData._id, email: matchData.email }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '24h' });
					res.status(200).json({ "result": "true", "message": "Admin login sucessfully",
						 token,
						  data: matchData,
						  permission:{
							"Customers":["/Customer List","/Customer Reviews","/Loyalty Points"],
							"Staff":["/Add New Staff","/Staff List"],
							" Vendor": ["/Add New Vendor","/Vendor List","/Vendor Withdrow"], 
							 "Delivery Men": ["/Add New Deliveryman","/Delivery Man List","/Delivery Man Withdrow","/Emergency Contact"],
							   "Category": ["/Main Cetagory","/Cetagory","/Subcategory","/Sub Subcetagory"],
							  "Product Attribute": ["/Brands","/Product Type"], 
							  "Add Attribute" :["/Add Attribute"], 
							  "Vendor Products ":["/New Products Requests","/Approved Products","/Denied Products"],
							   "Order": ["/Pending","/Confirmed","/Packing","/Shipped","/Delivered","/Returned","/Not delivered","/Cancelled"], 
							  "Refund Request List" :["/Pending Refund","/Approved Refund","/Refunded Refund","/Rejected Refund"], Banners: ["/Banners"],
							   "Advertisement & Deals" :["/Add Advertisement","/Deal of the day","/Today Offer"], 
							   "Notification" :["/Send Notification"],
							    "Suggestion":["/Suggestion"],
								 "Messages" :["/Messages"],
								  "All Transaction" :["/All Transaction"],
								   "Setting" :["/Tax & Fare charge","/About Us","/Term & Conditions","/Return Policy","/Cancellation Policy","/Refund Policy","/Privacy & Policy","/Faq","/Contact Us"]
						  } 
						})
				}
				
			}else{
				// Compare the provided password with the hashed password in the database
				const passwordMatch = await bcrypt.compare(password, matchData.password);
 
				if (!passwordMatch) {
					return res.status(400).json({ "result": "false", "message": "Invalid email and password" });
				} else {
					// Generate a JWT token
					const token = jwt.sign({ adminId: matchData._id, email: matchData.email }, process.env.ACCESS_TOKEN_SECURITY, { expiresIn: '24h' });
					const dinu=matchData.restrictions;
					res.status(200).json({ "result": "true", "message": "Staff login sucessfully", token, data: matchData,permission:dinu })
				}

			}
	
		}catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};






// forgot password
const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		res.status(400).json({ 'result': "false", "message": "required parameter are email" })
	};
	try {
		const findData = await Admin.findOne({ email: email });
		if (!findData) {
			res.status(400).json({ 'result': "false", "message": "Invalid email" })
		} else {
			const otp = generate_otp();
			const data = await Admin.findOneAndUpdate({ email: email }, { $set: { otp: otp } }, { new: true });
			res.status(200).json({ 'result': "true", "message": "Please check your email", data: data })
		}

	} catch (err) {
		console.log(err.mesage)
		res.status(400).json({ 'result': "false", "message": err.mesage })
	}

};



// verifyEmail
const verifyEmail = async (req, res) => {
	const { email, otp } = req.body;
	if (!email || !otp) {
		res.status(400).json({ 'result': "false", "message": "required parameter are otp, email" })
	};
	try {
		const data = await Admin.findOne({ email, otp });
		if (!data) {
			res.status(400).json({ 'result': "false", "message": "Invalid otp" })

		} else {
			res.status(200).json({ 'result': "true", "message": "Your email verified sucessfully", data: data })

		}

	} catch (err) {
		console.log(err.mesage)
	}


};



// resetPassword
const resetPassword = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).json({ 'result': "false", "message": "required parameter are password, email" })
	};
	try {
		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(password, 10);
		await Admin.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });
		res.status(200).json({ 'result': "true", "message": "Password reset sucessfully" })

	} catch (err) {
		console.log(err.mesage)
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
  
  


//..............................ProductType api...............................

const createProductType = async (req, res) => {
    try {
        const {productType} = req.body;
        if (!productType ) {
            return res.status(400).json({ "result": "false", "message": "required parameters is productType " });
        }

        const existingSize = await ProductType.findOne({ productType });

        if (existingSize) {         
            res.status(400).json({ "result": "false", "message": "Product type allready exist" });
        } else {
            const newProductType = new ProductType({
                productType
                
            });
            const savedSize = await newProductType.save();
            res.status(200).json({ "result": "true", "message": "New data added successfully", data:savedSize});
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ "result": "false", "message": error.message });
    }
};



const productTypeList=async(req,res)=>{
	try {  
        const existingSize = await ProductType.find({});
		if(!existingSize){
			res.status(400).json({"result":"false","message":"Records does not found",data:existingSize})
		}else{
            res.status(200).json({ "result": "true", "message": "Size list get  successfully",data:existingSize });
		 }
        }
     catch (error) {
        console.error(error);
        res.status(500).json({ "result": "false", "message": error.message });
    }

};







// create Language api
const createLanguage = async (req, res) => {
	try {
		const { language_name } = req.body;
		if (!language_name) {
			res.status(400).json({ "result": "false", "message": "required parameter language_name" });
		}
		const matchData = await Language.findOne({ language_name: language_name });
		if (matchData) {
			res.status(400).json({ "result": "false", "message": "Language_name allready exist" });

		} else {
			const newLanguage = new Language({ language_name });
			const data = await newLanguage.save();
			res.status(200).json({ "result": "true", "message": "Language created sucessfully", data: data })
		}
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}


};




// longuage list api
const languageList = async (req, res) => {
	try {
		const data = await Language.find({});
		if (!data) {
			res.status(400).json({ "result": "true", "message": "Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Language list is sucessfully", data: data })
		}

	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};




/*.............................end salller operation....................... */


//categoryList on basis of innt and out
const categoryList_inntOut = async (req, res) => {
	const { main_category } = req.body;
	if (!main_category) {
		res.status(400).json({ "result": "false", "message": "required parameter are main_category" })

	};
	try {
		const data = await Category.find({ mainCategory_name: main_category });
		if (!data) {
			res.status(400).json({ 'result': "false", "message": "Data does not found" })
		} else {
			const dinu = data.map(item => ({
				categoryId: item._id,
				category_englishName: item.category_englishName,
				category_frenchName: item.category_frenchName


			}))
			res.status(200).json({ 'result': "true", "message": "Category list are", data: dinu })
		}

	} catch (err) {
		console.log(err)
		res.status(400).json({ 'result': "false", "message": err.message })

	}

};




//  productlist api
const requestProductList=async(req,res)=>{
	try {
	
	  const newProduct =await Product.find({
		  status:0
	  }).sort({_id: -1});
  
	  if(newProduct || newProduct.length>0){
	  res.status(200).json({"result":"true","message":"Product list get sucessfully",data:newProduct});
  }else{
	  res.status(400).json({"result":"false","message":"Record not found"});
  }
 
  } catch (error) {
	  // Handle errors
	  console.error(error);
	  res.status(400).json({"result":"false","message":error.message});
  }
  
  };
  
  
//dealsoftheday
const dealsoftheday=async(req,res)=>{
	try {
		const {productId} = req.body;
		if (!productId) {
			res.status(400).json({ "result": "false", "message": "required parameter is productId" });

		} else {
			const findData = await Product.findOne({ _id: productId });
			if (findData.hot_of_deals_status === 0) {
				const data = await Product.findByIdAndUpdate({_id: productId}, { $set: { hot_of_deals_status: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product added in deals of the day list sucessfully" })
			} else {
				await Product.findByIdAndUpdate({_id: productId }, { $set: { hot_of_deals_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product remove in deals of the day list sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};


// create commission and delevery api
const createCommission_delivery=async(req,res)=>{
	try {
	const {delivery_charge,commission} = req.body;
	if (!delivery_charge || !commission) {
		return res.status(400).json({ "result": "false", "message": "required parameter  are delivery_charge,commission" })
	};
       
	const data=await Charge.findOne({});
		if (data) {
           await Charge.findOneAndUpdate({},{delivery_charge,commission},{new:true});
		   res.status(200).json({"result":"true","message": 'Update successfully' });
		}else{
			const newdata = new Charge({delivery_charge,commission});
			await newdata.save();
			res.status(200).json({ "result":"true","message": 'Data added successfully' });
		}

		
	} catch (error) {
		console.error(error);
		res.status(400).json({ "message": error.mesage });
	}

};



// create commission and delevery api
const Commission_delivery_list=async(req,res)=>{
	try {
	 
	const data=await Charge.findOne({});
		if (data) {
		   res.status(200).json({"result":"true","message": 'Delivery & commission list get successfully',data:data });
		}else{
		
			res.status(400).json({ "result":"false","message": 'Records does not found' });
		}

		
	} catch (error) {
		console.error(error);
		res.status(400).json({ "message": error.mesage });
	}

};






const returnPolicy = async (req, res) => {
	try {
		const { title, text } = req.body;
		if (!title || !text) {
			return res.status(400).json({ "result": "false", "message": "require parameter are title,text" });
		}
			const matchData=await Return_policy.findOne({});
			if(matchData){
			const updated = await Return_policy.findOneAndUpdate({},{title,text},{new:true});
				res.status(200).json({"result":"true","message":"Data updated sucessfully",data:updated})
			}else{
			const insertData = new Return_policy({ title, text });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted sucessfully", data: data });
		}


	} catch (err) {
		console.log(err.message)
	}


};




// faq create api
const refundPolicy = async (req, res) => {
	try {
		const { title, text } = req.body;
		if (!title || !text) {
			return res.status(400).json({ "result": "false", "message": "require parameter are title,text" });
		}
			const matchData=await Refund_policy.findOne({});
			if(matchData){
			const updated = await Refund_policy.findOneAndUpdate({},{title,text},{new:true});
				res.status(200).json({"result":"true","message":"Data updated sucessfully",data:updated})
			}else{
			const insertData = new Refund_policy({ title, text });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted sucessfully", data: data });
		}


	} catch (err) {
		console.log(err.message)
	}


};



// faq create api
const cancellationPolicy = async (req, res) => {
	try {
		const { title, text } = req.body;
		if (!title || !text) {
			return res.status(400).json({ "result": "false", "message": "require parameter are title,text" });
		}
			const matchData=await Cancellation_policy.findOne({});
			if(matchData){
			const updated = await Cancellation_policy.findOneAndUpdate({},{title,text},{new:true});
				res.status(200).json({"result":"true","message":"Data updated sucessfully",data:updated})
			}else{
			const insertData = new Cancellation_policy({ title, text });
			const data = await insertData.save();
			res.status(200).json({ "result": "false", "message": "Data inserted sucessfully", data: data });
		}


	} catch (err) {
		console.log(err.message)
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


//dashboard api
const dashboardData=async(req,res)=>{
	try {
		const products=await Product.find().countDocuments();
		const users=await User.find().countDocuments();
		const stores=await Vender.find().countDocuments();
		const sales = await Order.find({});
		
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

  


const responseData = {
	products:products,
	users:users,
	stores:stores,
	totalSales:totalSum,
	pending: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 0).length, 0),
	confirm: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 2).length, 0),
	packing: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 3).length, 0),
	shipped: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 4).length, 0),
	cancel: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 1).length, 0),
	not_delivered: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 5).length, 0),
	delivered: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 6).length, 0),
	return: sales.reduce((total, order) => total + order.products.filter(product => product.order_status === 7).length, 0),
};



		
		res.status(200).json({ "result": "false", "message": "Dashboard data list are", data: responseData });

	} catch (err) {
		res.status(400).json({"result":"false","message":err.mesage});
	}


};



//top customer list
const topCustomer_list=async(req,res)=>{
	try {
const sales = await Order.find({});
const userIds = sales.map(data => data.userId);
const customerList = await User.find({ _id: { $in: userIds } }).limit(10);

const userIdCounts = userIds.reduce((counts, userId) => {
	counts[userId] = (counts[userId] || 0) + 1;
	return counts;
  }, {});
  
  const customerListWithCounts = customerList.map(customer => ({
	...customer.toObject(), // Convert Mongoose document to plain JavaScript object
	count: userIdCounts[customer._id] || 0 // Add count property based on userIdCounts or default to 0 if not found
  }));
  
   // Sort customerListWithCounts array in descending order based on count
   customerListWithCounts.sort((a, b) => b.count - a.count);

		res.status(200).json({ "result": "false", "message": "Dashboard data list are",data:customerListWithCounts});

	} catch (err) {
		res.status(400).json({"result":"false","message":err.mesage});
	}


};



//most popular store list
const mostPopular_storelist=async(req,res)=>{
	try {

		const likeshops = await Shopfavourite.find({});
		const shopIds = likeshops.map(data => data.shopId);
		const shopList = await Vender.find({ _id: { $in: shopIds } }).limit(10);
		const shopData=await shopList.map(item=>({
			shopId:item._id,
			shopname:item.shop_name,
			shop_logo:item.shop_logo,

		}))
		
		const shopIdCounts = shopIds.reduce((counts, shopId) => {
			counts[shopId] = (counts[shopId] || 0) + 1;
			return counts;
		  }, {});
		  
		  // Merge data
const mergedShopData = shopData.map(shop => ({
    ...shop,
    count: shopIdCounts[shop.shopId] || 0,
}));
		
mergedShopData.sort((a, b) => b.count - a.count);
				res.status(200).json({ "result": "false", "message": "Dashboard data list are",data:mergedShopData});
		
			} catch (err) {
				res.status(400).json({"result":"false","message":err.mesage});
			}
		

};





//top selling store
const topSelling_stores=async(req,res)=>{
	try {
        const sales = await Order.find({});
		
		const filteredResponse = sales.map(order => ({
			...order.toObject(), // Convert Mongoose model to plain JavaScript object
			products: order.products.filter(product => product.order_status === 6)
		})).filter(order => order.products.length > 0);
		
		const shopIds = filteredResponse.map(product => product.shopId);

        const productList = await Vender.find({_id: { $in: shopIds } }).limit(10);

        const productData = productList.map(item => ({
            shopId: item._id,
            shop_name: item.shop_name,
            shop_logo: item.shop_logo,
        }));

        const productIdCounts = shopIds.reduce((counts, shopId) => {
            counts[shopId] = (counts[shopId] || 0) + 1;
            return counts;
        }, {});

        // Merge data
        const mergedProductData = productData.map(product => ({
            ...product, // No need for .toObject() here
            count: productIdCounts[product.shopId] || 0,
        }));

        mergedProductData.sort((a, b) => b.count - a.count);

        res.status(200).json({ "result": "false", "message": "Dashboard data list are", data: mergedProductData });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }


};




//top selling store
const topSelling_products=async(req,res)=>{
	try {
        const sales = await Order.find({});
		
		const filteredResponse = sales.map(order => ({
			...order.toObject(), // Convert Mongoose model to plain JavaScript object
			products: order.products.filter(product => product.order_status === 6)
		})).filter(order => order.products.length > 0);
		
		const productsId = filteredResponse.flatMap(order => order.products.map(product => product.productId));

        const productList = await Product.find({_id: { $in: productsId } }).limit(10);

        const productData = productList.map(item => ({
            productId: item._id,
            product_name: item.product_name,
            image1: item.image1,
        }));

        const productIdCounts = productsId.reduce((counts, productId) => {
            counts[productId] = (counts[productId] || 0) + 1;
            return counts;
        }, {});

        // Merge data
        const mergedProductData = productData.map(product => ({
            ...product, // No need for .toObject() here
            count: productIdCounts[product.productId] || 0,
        }));

        mergedProductData.sort((a, b) => b.count - a.count);

        res.status(200).json({ "result": "false", "message": "Dashboard data list are", data: mergedProductData });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }

};




const mostPopular_products = async (req, res) => {
    try {
        const likeshops = await Like.find({ like_status: 1 });
        console.log(likeshops);
        const productIds = likeshops.map(data => data.productId);
        const productList = await Like.find({ productId: { $in: productIds } }).populate('productId').limit(10);

        const productData = productList.map(item => ({
            productId: item.productId._id,
            product_name: item.productId.product_name,
            image1: item.productId.image1,
        }));

        const productIdCounts = productIds.reduce((counts, productId) => {
            counts[productId] = (counts[productId] || 0) + 1;
            return counts;
        }, {});

        // Merge data
        const mergedProductData = productData.map(product => ({
            ...product, // No need for .toObject() here
            count: productIdCounts[product.productId] || 0,
        }));

        mergedProductData.sort((a, b) => b.count - a.count);

        res.status(200).json({ "result": "false", "message": "Dashboard data list are", data: mergedProductData });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};




//add advertisement
const Add_advertisementProduct=async(req,res)=>{
	try {
		const {productId} = req.body;
		if (!productId) {
			res.status(400).json({ "result": "false", "message": "required parameter is productId" });

		} else {
			const findData = await Product.findOne({ _id: productId });
			if (findData.adds === 0) {
				const data = await Product.findByIdAndUpdate({_id: productId}, { $set: { adds: 1 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product added in advertisement list sucessfully" })
			} else {
				await Product.findByIdAndUpdate({_id: productId }, { $set: { adds: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product remove from advertisement list sucessfully" })
			}
		}

	}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



const orderList=async(req,res)=>{
	try {
		const {status } = req.body;
		if (!status) {
			return res.status(400).json({ "result": "false", "message": "required parameters are  status (Note: cancel for 1, confirm 2, packing 3, shipped 4, not delivered 5, delivered 6, return 7)" });
		}
  
		const matchData = await Order.find({"products.order_status": status }).populate('checkoutId userId').sort({ _id: -1 });
  
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



const orderDetails=async(req,res)=>{
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
			size: filteredProduct.size,
			color: filteredProduct.color,
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




// Trending now
const advertisementProduct_list = async (req, res) => {
    try {
        const productList = await Product.find({adds:1});
		if(!productList || productList.length==0){
			res.status(400).json({
				"result": "false",
				"message": "Advertisement data not found",
				"path": "http://103.104.74.215:3037/uploads/",
				data: productList
			});
		}else{
        res.status(200).json({
            "result": "true",
            "message": "Advertisement data retrieved successfully",
            "path": "http://103.104.74.215:3037/uploads/",
            data: productList
        });
}
	
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};






const customerOrderList=async(req,res)=>{
	try {
        const {userId} = req.body;
		
		if (!userId ) {
            return res.status(400).json({ "result": "false", "message": "Required parameters is userId" });
        }
		const data=await Order.find({userId}).sort({_id:-1})
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






//shop order list
const shopOrder_list=async(req,res)=>{
	try {
		const { shopId} = req.body;
		if (!shopId ) {
			return res.status(400).json({ "result": "false", "message": "required parameters are shopId " });
		}
  
		const matchData = await Order.find({ shopId: shopId}).populate('checkoutId userId').sort({ _id: -1 });
  
		if (!matchData || matchData.length === 0) {
			return res.status(400).json({ "result": "false", "message": "data not found" });
		}
  
		
		res.status(200).json({
			"result": "true",
			"message": "Order list retrieved successfully",
			"path": "http://103.104.74.215:3037/uploads/",
			data: matchData
		});
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};


const shopOrder_details=async(req,res)=>{
	try {
		const { orderId} = req.body;
		if (!orderId ) {
			return res.status(400).json({ "result": "false", "message": "required parameters are orderId " });
		}
  
		const matchData = await Order.find({ _id: orderId}).populate('checkoutId userId').sort({ _id: -1 });
  
		if (!matchData || matchData.length === 0) {
			return res.status(400).json({ "result": "false", "message": "data not found" });
		}
  
		
		res.status(200).json({
			"result": "true",
			"message": "Order details retrieved successfully",
			"path": "http://103.104.74.215:3037/uploads/",
			data: matchData
		});
	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
};





const shopProduct_list=async(req,res)=>{
	try {
		const {shopId} = req.body;
		
			if(!shopId){
				return res.status(400).json({
				  "result":"true","message":"required parameters are shopId"
				});
			}
		
		const newProduct =await Product.find({
			venderId:shopId
		});
	
		if(newProduct || newProduct.length>0){
		res.status(200).json({"result":"true","message":"Product list get sucessfully",data:newProduct});
	}else{
		res.status(400).json({"result":"false","message":"Record not found"});
	}

	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(400).json({"result":"false","message":error.message});
	}


};




const shopProduct_details=async(req,res)=>{
	try {
		const {productId} = req.body;
		
			if(!productId){
				return res.status(400).json({
				  "result":"true","message":"required parameters are productId"
				});
			}
		
		const newProduct =await Product.find({
			_id:productId
		});
	
		if(newProduct || newProduct.length>0){
		res.status(200).json({"result":"true","message":"Product details get sucessfully",data:newProduct});
	}else{
		res.status(400).json({"result":"false","message":"Record not found"});
	}

	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(400).json({"result":"false","message":error.message});
	}


};




const shopReviews_list=async(req,res)=>{
	try {
		const { shopId } = req.body;
	
		if (!shopId) {
		  return res.status(400).json({ "result": "false", "message": "Required parameter 'shopId' is missing" });
		}
	
		
		const viewList = await Product.find({ venderId:shopId }).sort({"rating":-1});
		if(!viewList || viewList.length===0){
		  return res.status(400).json({ "result": "false", "message": "Data does not found" });
		}
	
		const raterList = await Rating.find({ venderId:shopId });
	
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
		  raters: item.raters,
		 
		}));
	
		// Send response with the formatted data
		res.status(200).json({ "result": "true", "message": "Review list retrieved successfully", data:data });
	
	  } catch (error) {
		console.error(error);
		res.status(400).json({ "result": "false", "message": error.message });
	  }

};





// products operation start
const deniedProductList= async (req, res) => {
	try {
		const Data = await Product.find({status:2}).sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Denied products list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


const userInnt_ratingList= async (req, res) => {
	try {
		const Data = await Innt_rating.find({}).populate('userId').sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "User rating list are ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};


const vendorWithdraw_requestList= async (req, res) => {
	try {
		const Data = await Withdraw.find({status_type:1}).populate('venderId').sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Withdraw  list get sucessfully ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




const settleWithdraw= async (req, res) => {
	try {
		const {WithdrawId,venderId,status,notes}=req.body;
		if(!venderId || !status){
			return res.status(400).json({"result":"false","message":"required parameters are venderId,WithdrawId, and status(1 for appprove and 2 for denied and notes is optional"});
		}

		const validation = await Withdraw.findOne({_id:WithdrawId,withdraw_status:1});
		if(validation){
			return res.status(400).json({"result":"false","message":"Request is closed"});
		}

		if(status=="1"){
			const Data = await Withdraw.findOne({_id:WithdrawId,status:0,withdraw_status:0});
			const Datas = await Vender.findOne({_id:venderId});
			const remaining_amount=Number(Datas.wallet - Data.amount);
			await Vender.findByIdAndUpdate({_id:venderId},{wallet:remaining_amount},{new:true});
			await Withdraw.findByIdAndUpdate({_id:WithdrawId},{status:1,withdraw_status:1},{new:true});
			res.status(200).json({ "result": "true", "message": "Withdraw approved sucessfully "})

		}else{
			await Withdraw.findByIdAndUpdate({_id:WithdrawId},{notes,status:2},{new:true});
			res.status(200).json({ "result": "true", "message": "Withdraw denied sucessfully "})
		}
	
	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




const Withdraw_requestDetils= async (req, res) => {
	try {
		const {withdrawId}=req.body;
		if(!withdrawId){
			return res.status(400).json({"result":"false","message":"required parameter is withdrawId"})
		}
		const Data = await Withdraw.find({_id:withdrawId}).populate('venderId').sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Withdraw  list get sucessfully ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




// withdraw  request
const withdrawRequest=async(req,res)=>{
	try {
	  const {adminId} = req.body;
	  if (!adminId) {
		  return res.status(400).json({ "result": "false", "message": "required parameters are adminId" });
	  }
	  
	  const existData= await Withdraw.findOne({adminId,status:0});
	  if(existData){
		
		return res.status(400).json({
		  "result": "false",
		  "message": "You have allready sent withdraw request",
		  
	  });
	  }
	  const existDatas= await Admin.findOne({_id:adminId});
	   if(!(existDatas.wallet >= amount)) {
		return res.status(400).json({
		  "result": "false",
		  "message": "You have not sufficient blance",
		  
	  });
  
	   }
  
  
		  const insertData=new Withdraw({adminId,amount});
		  const data=await insertData.save();
		  res.status(200).json({
			"result": "true",
			"message": "Yor request sent successfully",
			data: data
		});
	
  
  } catch (err) {
	  res.status(400).json({ "result": "false", "message": err.message });
  }
  
  };
  
  
  


  
const adminWallet_details = async (req, res) => {
    try {
		
		const sales = await Order.find({});
        
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

        // Sum all commission values
        const totalCommission = filteredResponse.reduce((sum, item) => {
            return sum + item.products.reduce((commissionSum, product) => {
                return commissionSum + product.commission;
            }, 0);
        }, 0);

       
        const existData = await Withdraw.find({status: 1 }); 
        let withdraw = 0;
        if (existData && existData.length > 0) {
            withdraw = existData.reduce((total, withdraw) => total + withdraw.amount, 0);
        }
		const pendingwithdraw = await Withdraw.find({status:0 }); 
		let pending = 0;
        if (pendingwithdraw && pendingwithdraw.length > 0) {
            pending = pendingwithdraw.reduce((total, requests) => total + requests.amount, 0);
        }

           const Wable=Number(totalSum -withdraw ).toFixed(2);

		const data={
			withdrawable_amount:Wable,
			allreadywithdraw_amount:withdraw,
			pendingwithdraw:pending,
			earn_delivery_charge:0,
			collect_cash:0,
			takenCommission:totalCommission,
		}

        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:data });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};








  
  //product reviews list
  const productReviews=async(req,res)=>{
	try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are productId" });
        }

        const findMatch = await Rating.find({ productId: productId }).populate('userId');
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }

  };


  

  //driver api
  const driverList=async(req,res)=>{
	try {
        const findMatch = await Driver.find({ }).sort({_id:-1});
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }

  };




  const driverDetails=async(req,res)=>{
	try {
        const {driverId } = req.body;
        if (!driverId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are driverId" });
        }

        const findMatch = await Driver.find({ _id: driverId });
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }


  };

  

  const driverAdd=async(req,res)=>{
	try {
		const {fname, lname,phone,email,password,conform_password,dob,fcm_id,city} = req.body;
    
		if (!phone || !fcm_id) {
			return res.status(400).json({ "result": "false", "message": "required parameters are fname, lname,phone,email,password,conform_password,dob,fcm_id,city,frontId_iamge,backId_iamge,vehical_iamge,document" });
		}

    const {frontId_iamge,backId_iamge,vehical_iamge,document}=req.files;

		const exist_driver = await Driver.findOne({phone,status:1});
		if (exist_driver) {
			return res.status(400).json({ "result": "false", "message": "Allready exist" });
		}

		if (password !== conform_password) {
			return res.status(400).json({ "result": "false", "message": "Passwords do not match." });
		}

		const otp = generate_otp();
		const hashedPassword = await bcrypt.hash(password, 10);

		const objectData = {
			fname,
         lname,
         phone,
         email,
         password:hashedPassword,
         dob,
         fcm_id,
         city,
		otp: otp,
		status:1,
        frontId_iamge: frontId_iamge ? frontId_iamge[0].filename : null,
        backId_iamge: backId_iamge ? backId_iamge[0].filename : null,
        vehical_iamge: vehical_iamge ? vehical_iamge[0].filename : null,
        document: document ? document[0].filename : null,
		};

			const driver_data = new Driver(objectData);
			const dinu = await driver_data.save();
			res.status(200).json({ "result": "true", "message": "Driver registerd bsucessfully", data:dinu });



	} catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
		console.log(err.message)
	}

  };






const approveDriver=async(req,res)=>{
	try {
        const {driverId,status } = req.body;
        if (!driverId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are driverId and status(1 for aprove and 2 reject)" });
        }

        const updateData = await Driver.findByIdAndUpdate({ _id: driverId },{driver_status:status},{new:true});
        if(updateData){
        res.status(200).json({ "result": "true", "message": "Updated data sucessfully",data:updateData });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }

};



const returnOrderList = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ "result": "false", "message": "Required parameters: status (0 pending, 1 approve, 2 refunded, 3 reject)" });
        }

        const data = await Returnorder.find({ return_status: status }).populate('orderId userId').sort({_id:-1});
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




const allTransjection=async(req,res)=>{
	try {
        const findMatch = await Transjection.find({ }).populate('userId').sort({_id:-1});
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }


};


const transjectionDetails=async(req,res)=>{
	try {
		const {transId}=req.body;
		if(!transId){
			return res.status(400).json({"result":"false","message":"required parameter is transId"});
		}
        const findMatch = await Transjection.find({_id:transId}).populate('userId orderId').sort({_id:-1});
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }


};


const improvementSuggestionList=async(req,res)=>{
	try {
		
        const findMatch = await Suggestion.find({}).populate('userId').sort({_id:-1});
        if(findMatch){
        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:findMatch });
	}else{
		res.status(400).json({"result":"false","message":"data not found"})
	}
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }

};





const graphData = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ "result": "false", "message": "Required field is status (1 for weekly, 2 for monthly, and 3 for last 30 days)" })
        }

        const sales = await Order.find({});
        
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





const driverWithdraw_requestList= async (req, res) => {
	try {
		const Data = await Withdraw.find({status_type:2}).populate('driverId').sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Withdraw  list get sucessfully ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




const settleWithdraw_driver= async (req, res) => {
	try {
		const {WithdrawId,driverId,status,notes}=req.body;
		if(!driverId || !status){
			return res.status(400).json({"result":"false","message":"required parameters are venderId,WithdrawId, and status(1 for appprove and 2 for denied and notes is optional"});
		}

		const validation = await Withdraw.findOne({_id:WithdrawId,withdraw_status:1});
		if(validation){
			return res.status(400).json({"result":"false","message":"Request is closed"});
		}

		if(status=="1"){
			const Data = await Withdraw.findOne({_id:WithdrawId,status:0,withdraw_status:0});
			const Datas = await Driver.findOne({_id:driverId});
			const remaining_amount=Number(Datas.wallet - Data.amount);
			await Driver.findByIdAndUpdate({_id:driverId},{wallet:remaining_amount},{new:true});
			await Withdraw.findByIdAndUpdate({_id:WithdrawId},{status:1,withdraw_status:1},{new:true});
			res.status(200).json({ "result": "true", "message": "Withdraw approved sucessfully "})

		}else{
			await Withdraw.findByIdAndUpdate({_id:WithdrawId},{notes,status:2},{new:true});
			res.status(200).json({ "result": "true", "message": "Withdraw denied sucessfully "})
		}
	
	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};




const driverWithdraw_requestDetils= async (req, res) => {
	try {
		const {withdrawId}=req.body;
		if(!withdrawId){
			return res.status(400).json({"result":"false","message":"required parameter is withdrawId"})
		}
		const Data = await Withdraw.find({_id:withdrawId}).populate('driverId').sort({_id: -1});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Withdraw  list get sucessfully ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}

};



const insertEmergancy_Contact=async(req,res)=>{
	try {
        const {phone,contact_name} = req.body;
        if (!phone) {
            return res.status(400).json({ "result": "false", "message": "Required parameters phone,contact_name" });
        }

        const data = await Emergancy_support.findOne({phone});

        if (data) {
			return res.status(400).json({ "result": "false", "message": "This phone is allready exist" });
		}
		const insertData=new Emergancy_support({phone,contact_name});
		const datas=await insertData.save();
		res.status(200).json({"result":"true","message":"Data inserted sucessfully",data:datas})
    } catch (err) {
        console.error(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }
	
};



const emergancy_Contact_list=async(req,res)=>{
	try {
		const Data = await Emergancy_support.find({});
		if (!Data) {
			res.status(400).json({ "result": "false", "message": " Data does not found" })

		} else {
			res.status(200).json({ "result": "true", "message": "Emergancy contact  list get sucessfully ", data: Data })
		}


	} catch (err) {
		console.log(err)
		res.status(400).json({ "result": "false", "message": err.message });

	}
	
};

const deleteEmergancy_Contact = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({ "result": "false", "message": "Required parameter _id" });
        }

        const data = await Emergancy_support.findByIdAndDelete({ _id: _id });
        if (!data) {
            return res.status(404).json({ "result": "false", "message": "No emergency contact found with the given ID" });
        }

        res.status(200).json({ "result": "true", "message": "Data deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }
};





const changeStatusEmergancy_Contact=async(req,res)=>{
	try {
        const {_id} = req.body;
        if (!_id) {
            return res.status(400).json({ "result": "false", "message": "Required parameters _id" });
        }

        const data = await Emergancy_support.findOne({_id:_id});
		if(data.status===0){
			await Emergancy_support.findByIdAndUpdate({_id:_id},{status:1},{new:true});
            res.status(200).json({"result":"true","message":"Status actived sucessfully"})
		}else{
			await Emergancy_support.findByIdAndUpdate({_id:_id},{status:0},{new:true});
            res.status(200).json({"result":"true","message":"Status deactived sucessfully"})
		}
		
    } catch (err) {
        console.error(err);
        res.status(500).json({ "result": "false", "message": err.message });
    }
	
};




const updateDriver = async (req, res) => {
    try {
        const { fname, lname,dob, city, driverId } = req.body;

        if (!driverId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are fname, lname, dob, city, driverId,frontId_image,backId_image,vehicle_image,document" });
        }

        const { frontId_image, backId_image, vehicle_image, document } = req.files;
        const objectData = {
            fname,
            lname,
            dob,
            city
        };

        if (req.files) {
            if (frontId_image) objectData.frontId_image = frontId_image[0].filename;
            if (backId_image) objectData.backId_image = backId_image[0].filename;
            if (vehicle_image) objectData.vehicle_image = vehicle_image[0].filename;
            if (document) objectData.document = document[0].filename;
        }
        const driver_data = await Driver.findByIdAndUpdate(driverId, objectData, { new: true });

        res.status(200).json({ "result": "true", "message": "Driver data updated successfully", data: driver_data });

    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
        console.error(err);
    }
};





const updateDriver_password = async (req, res) => {
    try {
        const {driverId,password,confirm_password } = req.body;

        if (!driverId || !password) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are driverId,password,confirm_password" });
        }


        if (password !== confirm_password) {
			return res.status(400).json({ "result": "false", "message": "Passwords do not match." });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
        const driver_data = await Driver.findByIdAndUpdate(driverId,{password:hashedPassword}, { new: true });

        res.status(200).json({ "result": "true", "message": "Driver password updated successfully", data: driver_data });

    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
        console.error(err);
    }
};




const vendorWallet_details=async(req,res)=>{
	try {
        const {vendorId} = req.body;

        if (!vendorId) {
            return res.status(400).json({ "result": "false", "message": "Required parameters are vendorId" });
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

        // Sum all commission values
        const totalCommission = filteredResponse.reduce((sum, item) => {
            return sum + item.products.reduce((commissionSum, product) => {
                return commissionSum + product.commission;
            }, 0);
        }, 0);

       
        const existData = await Withdraw.find({venderId:vendorId,status: 1 }); 
        let withdraw = 0;
        if (existData && existData.length > 0) {
            withdraw = existData.reduce((total, withdraw) => total + withdraw.amount, 0);
        }
		const pendingwithdraw = await Withdraw.find({venderId:vendorId,status:0 }); 
		let pending = 0;
        if (pendingwithdraw && pendingwithdraw.length > 0) {
            pending = pendingwithdraw.reduce((total, requests) => total + requests.amount, 0);
        }

           const Wable=Number(totalSum -withdraw ).toFixed(2);

		const data={
			withdrawable_amount:Wable,
			allreadywithdraw_amount:withdraw,
			pendingwithdraw:pending,
			earn_delivery_charge:0,
			collect_cash:0,
			givenCommission:totalCommission,
		}

        res.status(200).json({ "result": "true", "message": "Get data sucessfully",data:data });
       
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
        console.error(err);
    }

};



const todayOffer_add=async(req,res)=>{
	try {
		const {productId} = req.body;
		if (!productId) {
			res.status(400).json({ "result": "false", "message": "required parameter is productId" });

		} else {
			const findData = await Product.findOne({ _id: productId });
			if (findData.hot_of_deals_status === 0) {
				const data = await Product.findByIdAndUpdate({_id: productId}, { $set: { hot_of_deals_status: 2 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product added in today offer of the day list sucessfully" })
			} else {
				await Product.findByIdAndUpdate({_id: productId }, { $set: { hot_of_deals_status: 0 } }, { new: true });
				res.status(200).json({ "result": "true", "message": " Product remove from today offer of the day list sucessfully" })
		
		}

	}
}

	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};


const inntProductList=async(req,res)=>{
	try{
	// Find product list
	const Maincategories=await Maincategory.find({maincategory_englishName:"Innt"});
	const categories=await Category.find({maincategoryId:Maincategories});
	const categoryIds = categories.map(category => category._id);
   const Data = await Product.find({categoryId:{$in:categoryIds},status:1 }).sort({_id: -1});
   if (!Data) {
	   res.status(400).json({ "result": "false", "message": " Data does not found" })

   } else {
	   res.status(200).json({ "result": "true", "message": "products list are ", data: Data })
   }
	}
   catch (err) {
	res.status(400).json({ "result": "false", "message": err.message });
}

};


const inntOutProductList=async(req,res)=>{
	try{
	// Find product list
	const Maincategories=await Maincategory.find({maincategory_englishName:"InntOut"});
	const categories=await Category.find({maincategoryId:Maincategories});
	const categoryIds = categories.map(category => category._id);
	const Data = await Product.find({categoryId:{$in:categoryIds},status:1 }).sort({_id: -1});
   if (!Data) {
	   res.status(400).json({ "result": "false", "message": " Data does not found" })

   } else {
	   res.status(200).json({ "result": "true", "message": "products list are ", data: Data })
   }
	}
	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
	

};



const userQueryList=async(req,res)=>{
	try{
	// Find product list
	const QueryList=await userQuery.find({}).sort({_id:-1});
   if (!QueryList) {
	   res.status(400).json({ "result": "false", "message": " Data does not found" })

   } else {
	   res.status(200).json({ "result": "true", "message": "QueryList  are ", data: QueryList })
   }
	}
	catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}
	

};



const insertAttributes= async (req, res) => {
    try {
        const {categoryId, attribute_name, attribute_values } = req.body;
		if(!categoryId || !attribute_name || !attribute_values){
			return res.status(400).json({"result":"false","message":"required parameter are categoryId,attribute_name, attribute_values"})
		};
		const validation=await Attribute.findOne({attribute_name,categoryId});
		if(validation){
			return res.status(400).json({"result":"false","message":"Data allready exist"})
		}
        const attibutess=attribute_values.split(",");
        // Create a new attribute document
        const attribute = new Attribute({
            attribute_name,
            attribute_values:attibutess,
			categoryId,
        });

        // Save the attribute document to the database
       const data= await attribute.save();
        res.status(200).json({"result":"true","message":"Data inserted sucessfully",data:data});
    } catch (error) {
        console.error('Error inserting attribute', error);
        res.status(400).json({ "result":"false","message":error.message});
    }
};



// Update Attributes function
const updateAttributes = async (req, res) => {
    try {
        const {attributeId,categoryId,attribute_name, attribute_values } = req.body;
        if (!attributeId) {
            return res.status(400).json({ "result": "false", "message": "required parameters are attributeId,categoryId,attribute_name, attribute_values" });
        };

        const attibutess = attribute_values.split(',');
        // Find the document and update
        const updatedAttribute = await Attribute.findOneAndUpdate(
            {_id:attributeId},
            { attribute_name ,categoryId,attribute_values: attibutess },
            { new: true} 
        );

        if (!updatedAttribute) {
            return res.status(404).json({ "result": "false", "message": "Attribute not found" });
        }

        res.status(200).json({ "result": "true", "message": "Data updated successfully", data: updatedAttribute });
    } catch (error) {
        console.error('Error updating attribute', error);
        res.status(400).json({ "result": "false", "message": error.message });
    }
};




// Update Attributes function
const attributes_list = async (req, res) => {
    try {
       
        const findData = await Attribute.find({}).populate('categoryId');
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




// Delete Attributes function
const deleteAttributes = async (req, res) => {
    try {
        const {attributeId} = req.body;
        if (!attributeId) {
            return res.status(400).json({ "result": "false", "message": "required parameter is attributeId" });
        }

        // Find the document and delete
        const deletedAttribute = await Attribute.findOneAndDelete({_id:attributeId});

        if (!deletedAttribute) {
            return res.status(404).json({ "result": "false", "message": "Attribute not found" });
        }

        res.status(200).json({ "result": "true", "message": "Data deleted successfully"});
    } catch (error) {
        console.error('Error deleting attribute', error);
        res.status(400).json({ "result": "false", "message": error.message });
    }
};



// const { GoogleAuth } = require('google-auth-library');
// const fs = require('fs');
// const path = require('path');

// const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../inntadmin.json');
// const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

// async function getAccessToken() {
//     const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));

//     const client = new GoogleAuth({
//         credentials: serviceAccount,
//         scopes: SCOPES,
//     });

//     const authClient = await client.getClient();
//     const accessToken = await authClient.getAccessToken();
//     return accessToken.token;
// }

// getAccessToken().then(token => {
//     console.log('Access Token:', token);
// }).catch(err => {
//     console.error('Error getting access token:', err);
// });





const addPushNotification = async (req, res) => {
    try {
    //     const { title, text } = req.body;

    //    const accessToken = await getAccessToken();
    //     const FCM_ENDPOINT = 'https://fcm.googleapis.com/v1/innt-6700e/your-project-id/messages:send';
    //     const message = {
    //         message: {
    //             token: "f96U4qSZSS6MNFKrzJRk_P:APA91bEQ0kH7GgkjTdmDRORE9U6fjbgd_jSkY4YTAX8gRkX2OsfW4DgT5Kmak1PhTiO43koQM7vC0It7N4Ek6x_-UgOWQ7S97xc5x6m6LkpnzZmIlk4WSm58fQlOS9cqvL7N2KwvWSgS",
    //             notification: {
    //                 title: title,
    //                 body: text,
    //             }
    //         }
    //     };

        // const headers = {
        //     'Authorization': `Bearer ${accessToken}`,
        //     'Content-Type': 'application/json; UTF-8'
        // };

    //     const response = await axios.post(FCM_ENDPOINT, message);

    //     if (response.status === 200) {
    //         const pushNotification = new Notification({ title: title, text: text });
    //         await pushNotification.save();
    //         res.status(200).json({ "result": "true", "message": "Message sent successfully", data: response.data });
    //     } else {
    //         res.status(response.status).json({ "result": "false", "message": "Failed to send message", data: response.data });
    //     }
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
     }
};






//  staffList
const staffList = async (req, res) => {
	try {
			const matchData = await Admin.find({type:1}).sort({_id:-1});
			if (!matchData) {
				return res.status(400).json({ "result": "false",
					"message": "Record does not found"
					})
			}
				res.status(200).json({ "result": "true", "message": "Staff list got sucessfully",
				data: matchData,
						  
			});
	
		}catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



//  staffList
const staff_active_deactive = async (req, res) => {
	try {
		const {staffId}=req.body;
		if(!staffId){
        return res.status(400).json({"result":"false","message":"required parameter is staffId"})
		}
		   const data=await Admin.findOne({_id:staffId,type:1,staff_status:0});
		   if(data){
			const matchData = await Admin.findOneAndUpdate({_id:staffId,type:1},{staff_status:1},{new:true});
			  res.status(200).json({ "result": "true", "message": "Staff blocked sucessfully",
				data:matchData,
						  
			});
		}else{
			const matchData = await Admin.findOneAndUpdate({_id:staffId,type:1},{staff_status:0},{new:true});
			res.status(200).json({ "result": "true", "message": "Staff unblocked sucessfully",
			  data:matchData,
		})
	}
			
			
		}catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};



//  staffList
const update_staff = async (req, res) => {
	try {
		const {staffId,first_name,email,password,last_name,restrictions}=req.body;
		if(!staffId){
        return res.status(400).json({"result":"false","message":"required parameter is staffId and optionals are first_name,email,password,last_name,restrictions"})
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
		
			const matchData = await Admin.findOneAndUpdate({_id:staffId,type:1},{staffId,first_name,email,password,last_name,restrictions:parsedRestrictions},{new:true});
			if (!matchData) {
				return res.status(400).json({ "result": "false",
					"message": "Record does not found"
					})
			}
				res.status(200).json({ "result": "true", "message": "Staff data updated sucessfully",
				data: matchData,
						  
			});
	
		}catch (err) {
		res.status(400).json({ "result": "false", "message": err.message });
	}

};








/*....................exports variables...........*/
module.exports = {
	// banner
	create_banner_api,
	get_banner_api,
	update_banner_api,
	delete_banner_api,
	activeDeactive_banner,
	getBanner_byId,
	bannerType_list,
	//main category
	mainCategory,
	mainCategory_list,
	get_mainCategory_list,
	
	// category
	createCategory,
	getCategory,
	updateCategory,
	getCategory_byId,
	activeDeactive_category,
	deleteCategory,
	categorySearch_api,

	//subcategory
	createSubcategory,
	updateSubcategory,
	getSubcategory,
	activeDeactive_subcategory,
	deleteSubcategory,
	getSubcategory_byId,
	subcategorySearch_api,

	//sub subcategory
	Insert_subSubcategory,
	updatesubSubcategory,
    getsubSubcategory,
    getsubSubcategory_byId,
    deletesubSubcategory,
	
	// vender and saller
	sallerList_api,
	sallerBlock_unblock_api,
	sallerDetails,
	sallerSignup,
	sellerApproved,
	// customer 
	customerList,
	userBlock_unblock_api,
	customerDetails,

	// prodct list
	productList,
	product_approve,
	productDetails,

	
	 createBrand,
     brandList,
	




	//pulicy
	create_privacy,
	privacy_list,
	create_contactUs,
	contactUs_list,
	updateContact_us,

	create_faq,
	faq_list,
	create_about_us,
	aboutUs_list,
	Term_condiction,
	Term_condiction_list,



	AdminSignup,
	AdminLogin,
	createLanguage,
	languageList,

	


	//all 
	categoryList_inntOut,
	forgotPassword,
	verifyEmail,
	resetPassword,
	maincategory_list,
	createProductType,
	productTypeList,
	requestProductList,
	//getCategory_list,
	dealsoftheday,
	createCommission_delivery,
	Commission_delivery_list,
     //today
	 returnPolicy,
    cancellationPolicy,
    refundPolicy,
	returnPolicyList,
    cancellationPolicyList,
    refundPolicyList,
	dashboardData,
	topCustomer_list,
	mostPopular_storelist,
    topSelling_stores,
    topSelling_products,
    mostPopular_products,
	Add_advertisementProduct,
	//order api
   orderList,
   orderDetails,
   advertisementProduct_list,

	 customerOrderList,
     shopOrder_list,
     shopProduct_list,
     shopReviews_list,
	 shopOrder_details,
	 shopProduct_details,
	 deniedProductList,
	 userInnt_ratingList,
	 vendorWithdraw_requestList,
	 settleWithdraw,
	 Withdraw_requestDetils,
	 withdrawRequest,
	 adminWallet_details,
	 productReviews,
	 driverList,
	 driverDetails,
	 driverAdd,
	 approveDriver,
	 returnOrderList,
	 returnOrderDetails,
	 allTransjection,
	 transjectionDetails,
	 improvementSuggestionList,
	 graphData,
	 driverWithdraw_requestList,
   settleWithdraw_driver,
   driverWithdraw_requestDetils,
   insertEmergancy_Contact,
emergancy_Contact_list,
deleteEmergancy_Contact,
changeStatusEmergancy_Contact,
updateDriver,
updateDriver_password,
vendorWallet_details,
todayOffer_add,
inntProductList,
inntOutProductList,
userQueryList,
insertAttributes,
updateAttributes,
attributes_list,
deleteAttributes,
get_attribute,
addPushNotification,
staffList,
staff_active_deactive,
update_staff,



};