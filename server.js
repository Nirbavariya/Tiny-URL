const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");

const app = express();

mongoose.connect("mongodb+srv://neerrocks:neerrocks@cluster0.pq8rg.mongodb.net/tinyURL?retryWrites=true&w=majority",{useNewUrlParser:true , useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.urlencoded({extended : false}));


app.get("/",async (req,res) => {
    const shortUrls = await shortUrl.find();
    res.render("index" , { shortUrls: shortUrls});
});

app.post("/shortUrls",async (req,res) => {
    await shortUrl.create({full : req.body.fullUrl });
    res.redirect("/");
});

app.get("/:shorturl", async (req,res) => {
    const shorturl = await shortUrl.findOne({short : req.params.shorturl});
    if(shorturl === null) res.status(404);
    
    shorturl.clicks++; 
    shorturl.save();

    res.redirect(shorturl.full);
});
app.listen(process.env.PORT || 5000 , function(){
    console.log("Server listening on port 5000!!");
});