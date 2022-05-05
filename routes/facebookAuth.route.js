require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookModel = require("../models/user.model");
const FacebookStrategy = require("passport-facebook").Strategy;

const auth = express();
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
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
		res.redirect(`${process.env.FRONTEND_URL}/`);
	}
);
module.exports = auth;
