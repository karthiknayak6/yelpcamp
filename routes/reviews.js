const express = require("express");
const mongoose = require("mongoose");
const catchError = require("../util/catchError");
const ExpressError = require("../util/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor, isReplyAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post(
	//reviews
	"/",
	isLoggedIn,
	validateReview,
	catchError(reviews.postReview)
);

router.delete(
	//reviews
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchError(reviews.deleteReview)
);

router.post("/:reviewId", isLoggedIn, catchError(reviews.reviewReply));

router.delete(
	"/:reviewId/:replyId",
	isLoggedIn,
	isReplyAuthor,
	catchError(reviews.deleteReply)
);

module.exports = router;
