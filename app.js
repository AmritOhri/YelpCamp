var express = require("express"),
app 		= express(),
bodyParser  = require("body-parser"),
mongoose 	= require("mongoose"),
Campground  = require("./models/campground"),
Comment		= require("./models/comment"),
seedDB		= require("./seeds"),
passport 	= require("passport"),
LocalStrategy=require("passport-local"),
User		= require("./models/user"),
methodOverride=require("method-override"),
flash		= require("connect-flash");


//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");


mongoose.connect('mongodb://localhost:27017/YelpCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));







// Campground.create(
// 	{
// 		name: "Granite Hill",
// 		image: "https://images.unsplash.com/photo-1528433556524-74e7e3bfa599?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 		description: "A complete granite hill, which will make you feel awesome!"
// 	}
// 	,function(err,campground)
// 	{
// 		if(err) console.log(err);
// 		else
// 		{
// 			console.log("NEW CAMPGROUND CREATED");
// 			console.log(campground);
// 		}
// 	});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


//seed the database
//seedDB();

app.use(flash());


//PASSPORT CONG=FIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(methodOverride("_method"));

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



var port = process.env.PORT || 3000;
app.listen(port,function()
{
	console.log("YelpCamp server has started!");
});