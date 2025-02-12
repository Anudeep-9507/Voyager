const mongoose = require("mongoose");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const initData=require("./data");
const Listing= require("../models/listing");

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"678a9882aefe6f13c261ea6d"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();

// 678a9882aefe6f13c261ea6d