//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const auth = express();

auth.use(express.static("public"));
auth.set("view engine", "ejs");
auth.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
auth.use(
	session({
		secret: "Our little secret.",
		resave: false,
		saveUninitialized: false,
	})
);
auth.use(passport.initialize());
auth.use(passport.session());
mongoose.connect(`mongodb://localhost:27017/userDB`);

mongoose.connection.once("open", () => {
	console.log("connected to database");
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	secret: String,
	googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/secrets",
			userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile);

			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return cb(err, user);
			});
		}
	)
);

auth.get("/", function (req, res) {
	res.render("home");
});

auth.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile"] })
);

auth.get(
	"/auth/google/secrets",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect to secrets.
		res.redirect("/secrets");
	}
);

auth.get("/login", function (req, res) {
	res.render("login");
});
auth.get("/register", function (req, res) {
	res.render("register");
});
auth.get("/secrets", function (req, res) {
	User.find({ secret: { $ne: null } }, function (err, foundUsers) {
		if (err) {
			console.log(err);
		} else {
			if (foundUsers) {
				res.render("secrets", { usersWithSecrets: foundUsers });
			}
		}
	});
});
auth.get("/submit", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("submit");
	} else {
		res.redirect("/login");
	}
});
auth.post("/submit", function (req, res) {
	const submittedSecret = req.body.secret;

	//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
	// console.log(req.user.id);

	User.findById(req.user.id, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				foundUser.secret = submittedSecret;
				foundUser.save(function () {
					res.redirect("/secrets");
				});
			}
		}
	});
});

auth.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});
auth.post("/register", function (req, res) {
	User.register(
		{ username: req.body.username },
		req.body.password,
		function (err, user) {
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/secrets");
				});
			}
		}
	);
});
auth.post("/login", function (req, res) {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	req.login(user, function (err) {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/secrets");
			});
		}
	});
});
auth.listen(3000, function () {
	console.log("Server started on port 3000.");
});
