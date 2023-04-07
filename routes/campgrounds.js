const express = require("express");
const mongoose = require("mongoose");

const catchError = require("../util/catchError");
const ExpressError = require("../util/ExpressError");

const session = require("express-session");
const flash = require("connect-flash");

const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { campgroundSchema } = require("../schema");

const { application } = require("express");
const { isLoggedIn } = require("../middleware");
const router = express.Router();

const { isAuthor } = require("../middleware");
const { validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/").get(campgrounds.index).post(
	isLoggedIn,
	upload.array("image"),

	validateCampground,
	catchError(campgrounds.createCampground)
);

router.get("/new", isLoggedIn, campgrounds.renderNewCampground);

router
	.route("/:id")
	.put(upload.array("image"), validateCampground, campgrounds.updateCampground)
	.delete(isLoggedIn, isAuthor, catchError(campgrounds.deleteCampground))
	.get(catchError(campgrounds.renderShowCampground));

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchError(campgrounds.renderEditCampground)
);

module.exports = router;
