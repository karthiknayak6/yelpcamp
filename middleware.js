const { campgroundSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./util/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const Reply = require("./models/reply.js");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;

		req.flash("error", "You must be logged in first!");
		return res.redirect("/login");
	}

	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission!!");
		return res.redirect(`/campgrounds/${campground._id}`);
	}
	next();
};
module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	console.log(error, error, error);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { reviewId, id } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission!!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.isReplyAuthor = async (req, res, next) => {
	const { id, replyId } = req.params;
	const reply = await Reply.findById(replyId);
	if (!reply.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission!!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};
