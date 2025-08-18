// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

 
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }

// const initDB = async () => {
//   await Listing.deleteMany({});//already exist data cleaning
//  initData.data= initData.data.map((obj)=>({...obj,owner:"687c7b39ec8f9266414095a0"}));//listing ma jetali pan listing hati tema ek owner name no navo attribute add kari didho 
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to Atlas DB");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    // Clean existing data
    await Listing.deleteMany({});
    
    // Add owner field to each object
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "687c7b39ec8f9266414095a0",
    }));

    // Insert fresh data
    await Listing.insertMany(initData.data);
    console.log("✅ Data was initialized successfully!");
  } catch (err) {
    console.error("❌ Error initializing data:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
