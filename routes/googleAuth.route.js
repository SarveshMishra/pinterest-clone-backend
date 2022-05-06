require("dotenv").config();
const express = require("express");
const google = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const googleUser = require("../models/user.model");
const cors = require("cors");

google.use(cors());
// Google OAuth Strategy
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
		},
		function (accessToken, refreshToken, profile, done) {
			googleUser
				.findOne({ googleId: profile.id })
				.then((currentUser) => {
					if (currentUser) {
						done(null, currentUser);
					} else {
						new googleUser({
							googleId: profile.id,
							name: profile.displayName,
							email: profile.email,
							avatar: profile.picture,
						})
							.save()
							.then((newUser) => {
								done(null, newUser);
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	)
);

google.get(
	"/",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

google.get(
	"/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		res.redirect("/");
	}
);

module.exports = google;
