var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX
router.get("/",function(req,res)
{
	Campground.find({},function(err,allCampgrounds){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("campgrounds/index",{campgrounds: allCampgrounds});
			}
	});
	
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res)
{
	 var name = req.body.name;
	var price = req.body.price;
	 var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	 var newCampground={name: name,price: price, image: image, description: desc, author: author};
	Campground.create(
		newCampground
	,function(err,campground)
	{
		if(err) console.log(err);
		else
		{
			res.redirect("/campgrounds");
		}
	});
});

//NEW
router.get("/new",middleware.isLoggedIn,function(req,res)
{
	res.render("campgrounds/new");
});

//SHOW
router.get("/:id",function(req,res)
{
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
	if(err) console.log(err);
	else
	{
		res.render("campgrounds/show",{campground: foundCampground});
	}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPRGOUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findOneAndUpdate({_id: req.params.id},req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPRGOUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findOneAndRemove({_id: req.params.id},function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});





module.exports = router;