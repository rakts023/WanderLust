const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

//Mongoo connection
const MONGOO_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(MONGOO_URL)
}

main()
.then((res) => {
    console.log("DB Connection Success")
})
.catch((err) => {
    console.log(err)
})

const initDb = async () => {
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDb()