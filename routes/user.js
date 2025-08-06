const express=require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const Usercontrollers=require("../controllers/users.js");

//same route vala ne router.route vade ek sathe lakhya che
router.route("/signup")
//when you req for api call :localhost:3000/signup then one form is render for sign up details 
.get(Usercontrollers.singupRenderForm)//controller name na folder ni andar users.js file sathe link karyu che.
//when in form click signup button then username and email store in database and password is automatically store by passport npm package in form of hash.
.post(wrapAsync(Usercontrollers.singup));//controller name na folder ni andar users.js file sathe link karyu che.




//same route vala ne router.route vade ek sathe lakhya che
router.route("/login")
//when you call api::localhost:3000/login then one login form is open 
.get(Usercontrollers.loginpagerender)//controller name na folder ni andar users.js file sathe link karyu che.
//when you click on login button then if password and username is correcct then you are loggedin....
.post(saveRedirectUrl ,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),Usercontrollers.login);//controller name na folder ni andar users.js file sathe link karyu che.




//req.logout is passport method when it call then data will be automatically deleted and user need to relogin 
router.get("/logout", Usercontrollers.logout);//controller name na folder ni andar users.js file sathe link karyu che.
 
module.exports=router;