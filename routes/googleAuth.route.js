require("dotenv").config();
const express = require("express");
const google = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const googleUser = require("../models/user.model");
const cors = require("cors");
const tokenGenerator = require("../lib/JWTToken");
const activeToken = require("../models/activeToken.model");
google.use(cors());
let token = null;
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
				.then(async (currentUser) => {
					if (currentUser) {
						done(null, currentUser);
					} else {
						token = await tokenGenerator.generateToken({
							googleId: profile.id,
							name: profile.displayName,
							email: profile.email,
							avatar: profile.picture,
						});

						new googleUser({
							googleId: profile.id,
							name: profile.displayName,
							email: profile.email,
							avatar: profile.picture,
						})
							.save()
							.then((newUser) => {
								const newToken = new activeToken({
									token: token,
									userId: newUser._id,
								});
								newToken.save();
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
		console.log(token);
		res.json({
			token: token,
			success: true,
		});
	}
);

module.exports = google;
