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

mongoose.connect(process.env.DATABASEURL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

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