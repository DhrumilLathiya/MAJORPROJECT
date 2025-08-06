const express=require("express");
//mergeparams use: when app.js try to share id parameter but not reach at review.js 
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
 const Review=require("../models/review.js");
 const Listing=require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");
const Reviewcontrollers=require("../controllers/reviews.js");



//reviews post route
router.post("/",isLoggedIn,validateReview,validateReview, wrapAsync(Reviewcontrollers.Createreview));//controllers name na folder ni andar reviews.js name ni file sathe connect kari che...



//review delete route
//when you click on review delete button then review delete
//review delete thay jashe pan listing delete nai thay 
  router.delete(
    "/:reviewId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(Reviewcontrollers.Destroyreview));//controllers name na folder ni andar reviews.js name ni file sathe connect kari che...






module.exports=router;