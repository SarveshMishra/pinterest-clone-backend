require("dotenv").config();
const express = require("express");
const passport = require("passport");
const FacebookModel = require("../models/user.model");
const FacebookStrategy = require("passport-facebook").Strategy;
const cors = require("cors");
const auth = express.Router();
const tokenGenerator = require("../lib/JWTToken");
const activeToken = require("../models/activeToken.model");
let token = null;

auth.use(cors());
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

		function (accessToken, refreshToken, profile, done) {
			let avatar = profile.photos[0].value;
			FacebookModel.findOne({ facebookId: profile.id })
				.then(async (currentUser) => {
					if (currentUser) {
						done(null, currentUser);
					} else {
						token = await tokenGenerator.generateToken({
							facebookId: profile.id,
							name: profile.displayName,
							email: "user@facebook.com",
							avatar: avatar,
						});

						new FacebookModel({
							facebookId: profile.id,
							name: profile.displayName,
							email: "user@facebook.com",
							avatar: avatar,
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

auth.get("/", passport.authenticate("facebook"));

auth.get(
	"/callback",
	passport.authenticate("facebook", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.json({
			token: token,
			success: true,
		});
	}
);
module.exports = auth;
