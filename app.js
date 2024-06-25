/*...............import dependancies..............*/
const express=require("express");
const app=express();
const bodyParser = require("body-parser");
const cors=require("cors");
const path=require("path");
const ejs=require("ejs");
const jwt = require('jsonwebtoken');






/*................built-in express middleware............*/
app.use(express.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


     const allowedOrigins = [
      'https://www.vendor.innt.bf',
      'https://www.admin.innt.bf',
      'https://www.innt.bf'
    ];
    
    app.use(cors({
      origin: function (origin, callback) {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, token'
    }));



/*................routes express middleware..............*/
const user_routes=require("./routers/user_routers");
const admin_routes=require("./routers/admin_routers");
const vender_routes=require("./routers/vender_routers");
const driver_routes=require("./routers/driver_routers");
app.use("/user/api",user_routes);
app.use("/admin/api",admin_routes);
app.use("/vender/api",vender_routes);
app.use("/driver/api",driver_routes);



/*................third party express middleware..........*/
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
const filePath = path.join(__dirname, '/uploads');
app.set(path.join(__dirname, '/uploads'));
app.engine('html', require('ejs').renderFile);


/*................error-handler middleware.................*/
app.use((err,req,res,next)=>{
	res.status(404).json({error:err.message});

});




//exports app file from here
module.exports=app;


