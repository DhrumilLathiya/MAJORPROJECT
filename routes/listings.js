const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
const multer  = require('multer');

const{storage}=require("../CloudConfig.js");
const upload = multer({ storage })
//const upload = multer({ dest: 'uploads/' })//multer is use to data parsing: to upload image in form. atyare to uploads name nu folder automatically VScode ma  banshe and tema image store thase pan industry ma third party clouds use thay uper ni two lines cloud mate lakhel che


//validate listings when api call is using hopscthch

//same route vala ne router.route vade ek sathe lakhya che
router.route("/")
//index route
.get(wrapAsync(listingControllers.index))//controllers name na folder ni andar listing.js sathe connect karel che.
//when you click on add button in new.ejs file thenfetch the data and data store in database.
//(create route)
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.Createlistings));//controllers name na folder ni andar listing.js sathe connect karel che.NOTE: use multer to get data upload.single("listing[image]")
  


//new route
//when you click on new button generate one form 
//IMPORTANT: following("/listings/new") get req ne show route req pehala lakhavi nakar error avse
//isLoggedIn is middleware which will do of authentication

router.get("/new",isLoggedIn,listingControllers.renderNewForm);//controllers name na folder ni andar listing.js sathe connect karel che.


//same route vala ne router.route vade ek sathe lakhya che
router.route("/:id")
//show route
.get( wrapAsync(listingControllers.Showlistings))//controllers name na folder ni andar listing.js sathe connect karel che.
//after edit listing when click on the Edit button then database was updated.
//update route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.Updatelistings))//controllers name na folder ni andar listing.js sathe connect karel che.
//delete Route delete button is in show.ejs file
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.Destroylistings));//controllers name na folder ni andar listing.js sathe connect karel che.


//when you click on edit anchor tag then open edit form
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.Editlistings));//controllers name na folder ni andar listing.js sathe connect karel che.

module.exports=router;