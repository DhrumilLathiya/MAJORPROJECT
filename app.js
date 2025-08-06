if(process.env.NODE_Env !== "production")//to prevent share in github
{
require('dotenv').config()//to use .env file(cloud setup)
// console.log(process.env.Secret) 
}


const express = require("express");
 const app = express();
 const mongoose = require("mongoose");
 const methodOverride=require("method-override");
 const path=require("path");
 const ejsMate=require("ejs-mate");
 const Review=require("./models/review.js");
 const session =require("express-session");
 const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");
const { error } = require('console');
// const MONGOURL="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;




main().then(()=>{console.log("datbase connected.")}).catch(err => console.log(err));


app.set("view engine","ejs");//file rendering mate ejs template  
app.set("views",path.join(__dirname,"views"));//file rendering mate ejs template
app.use(express.urlencoded({extended:true}));//url mathi id leva mate
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//for common code usage in evry page like navabar and footer
app.use(express.static(path.join(__dirname,"/public")));//to make things are common in every webpage

async function main() {
  await mongoose.connect(dburl);

}

// one extra collection is added in atlas mongodb to store session rprocess.env.SECRET
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("error in mongo session store.",error);
})


//create session   
const sessionOptions = {
  store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,//by default when we close the browser then cookies will be deleted but we can set expire time EX.facebook login ( a jetalo time set hashe tya sudhi login nahi karvu pade)
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
},
};


// app.get("/",(req,res)=>{
//     res.send("app is working very well..... and i am root....");
// }) 



//middle ware for the session
app.use(session(sessionOptions));
app.use(flash());//to display one time message when new things are occure //flash message declaration is in create route in listing.js 

   app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//during one seession user has not requre to relogin
passport.deserializeUser(User.deserializeUser());//ek vakhat seession puro thay pachi farithi login karvu pade.. 

//display the flash and this display flash show in index.ejs in second line 
//flash middleware
app.use((req,res,next) =>  {
res.locals.success=req.flash("success");//in argument "success "is key 
// console.log(res.locals.success);
res.locals.error=req.flash("error");
res.locals.currUser=req.user;//req.user ne direct navbar.ejs ma use nota kari shakata etle avu karu
next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings",listingsRouter) ;
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter) ;





// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

//middleware define for the error handling jo a handel na karu hot to jayare new list ma price ma string nakhet to bov moto error msg avet jena badale khali something went wrong j msg avse.
app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.send("something went wrong...");
});


 app.listen(8080, () => {
   console.log("server is listening to port 8080");
});

