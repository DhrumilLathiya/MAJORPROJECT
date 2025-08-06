const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

 
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});//already exist data cleaning
 initData.data= initData.data.map((obj)=>({...obj,owner:"687c7b39ec8f9266414095a0"}));//listing ma jetali pan listing hati tema ek owner name no navo attribute add kari didho 
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();