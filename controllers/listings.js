 const Listing=require("../models/listing");



 module.exports.index=async(req,res)=>{
const mylisting=await Listing.find({});
res.render("listings/index.ejs",{mylisting});
};

module.exports.renderNewForm=(req,res)=>{

      res.render("listings/new.ejs");
};

module.exports.Showlistings=async(req,res)=>{
  let{id}=req.params;
  let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");//pehala reviews ne show karva hata etle reviews ne pupulate karya pachi review na author ne pan show karva hata etle nested populate no use karyo che
  if(! listing){
    req.flash("error","Listing not exist which you serach!");
     return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
};


module.exports.Createlistings=async(req,res)=>{
// let {title, description, image, price, country, location} = req.body;
let url =req.file.path;
let filename=req.file.filename;
// let result=listingSchema.validate(req.body); 
// console.log(result);
const newListing = new Listing(req.body.listing);
newListing.owner=req.user._id;//passport automatically store user related information req.userawait newListing.save();
newListing.image={url,filename};
await newListing.save();
req.flash("success","New Listing created!");// flash message creation
res.redirect("/listings");};


module.exports.Editlistings=async(req,res)=>{
   let{id}=req.params;
  let listing=await Listing.findById(id);
  if(! listing){
    req.flash("error","Listing not exist which you serach!");
    res.redirect("/listings");
  }

let originalImageUrl=listing.image.url;   
originalImageUrl=originalImageUrl.replace("upload","upload/h_300,w_250");//when we edit our listing then to give user breifly idea about of image we add blur image if we place full clearity image then it occupies more space
  res.render("listings/edit.ejs",{listing,originalImageUrl});
};


module.exports.Updatelistings=async(req,res)=>
{
let { id } = req.params;
//koi user direct api call karine listing ne update na kari jay te mate nu protection che

let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

if(typeof req.file !== "undefined")
{
let url =req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
await listing.save();
}
req.flash("success"," Listing Updated Successfully!");
res.redirect(`/listings/${id}`);
};

module.exports.Destroylistings=async(req,res)=>{
   let{id}=req.params;
  const deletedlist=await Listing.findByIdAndDelete(id);
   console.log(deletedlist);
   req.flash("success","Listing deleted!");//when delete listin then flash mesege shown..
   res.redirect("/listings");
};