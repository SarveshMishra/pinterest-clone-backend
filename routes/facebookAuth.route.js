require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const FacebookModel = require("../models/facebook.model");
const FacebookStrategy = require("passport-facebook").Strategy;

const auth = express();
auth.use(
	session({
		secret: "Our little secret.",
		resave: false,
		saveUninitialized: false,
	})
);
auth.use(passport.initialize());
auth.use(passport.session());

passport.use(FacebookModel.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	FacebookModel.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
			profileFields: ["id", "displayName", "photos", "email"],
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile.photos[0].value);
			let avatar = profile.photos[0].value;
			FacebookModel.findOrCreate(
				{
					facebookId: profile.id,
					name: profile.displayName,
					avatar: avatar,
					email: null,
				},
				function (err, user) {
					return cb(err, user);
				}
			);
		}
	)
);

auth.get("/", passport.authenticate("facebook"));

auth.get(
	"/callback",
	passport.authenticate("facebook", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.send(true);
	}
);
module.exports = auth;
