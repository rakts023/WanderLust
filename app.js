const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const Listing = require("./models/listing.js")
require("dotenv").config();


const app = express()
const PORT = process.env.PORT

//Mongoo connection
const MONGOO_URL = process.env.DB_URL
async function main() {
    await mongoose.connect(MONGOO_URL)
}
main().then((res) => {
    console.log("DB Connection Success")
}).catch((err) => {
    console.log(err)
})

//views setting
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended : true}))
app.engine("ejs", ejsMate)

app.listen(PORT, () => {
    console.log("Server is running")
})

app.get("/", (req, res) => {
    res.redirect("/listings")
})

//listing route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing  })
})

//create route
app.post("/listings", async (req, res) => {
    const newListing = Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listings")
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
})


// app.get("/testListing",  async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Vizag, Andhra pradesh",
//         country : "India"
//     })
//     await sampleListing.save()
//     res.send("successfull testing")
// })