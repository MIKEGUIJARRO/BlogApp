const express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

require('dotenv').config();

const Blog = require("./schema/blog");

mongoose.connect(process.env.MONGO_DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
// Avoid running malicious code
app.use(expressSanitizer());
//Useful to follow the Rest pattern with update (PUT) and delete (-).
app.use(methodOverride("_method"));


// RESTFULL ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

//Index route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (error, blogs) {
        if (error) {
            console.log("There is an error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

//New Route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function (req, res) {
    //console.log(req.body.blog);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //console.log(req.body.blog);
    //Create blog
    Blog.create(req.body.blog, function (error, newBlog) {
        if (error) {
            console.log("There is an error");
            res.render("new");
            //Redirect to the index
        } else {
            res.redirect("/blogs");
        }
    });

});

//Show Route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (error, foundBlog) {
        if (error) {
            console.log("Error route");
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (error, foundBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//Update Route
app.put("/blogs/:id", function (req, res) {
    // Blog.findByIdAndUpdate(id, data, callbackF())
    //console.log(req.body.blog);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //console.log(req.body.blog);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (error, updatedBlog) {
        //id = 5ebeeca99bd2be47ef27c6b3
        if (error) {
            res.redirect("/blogs");
            console.log(error);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function (req, res) {
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function (error, _) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    //Redirect blog
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server up...");
});



