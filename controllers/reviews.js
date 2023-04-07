const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const Reply = require("../models/reply");
const ExpressError = require("../util/ExpressError");
const review = require("../models/review");

const postReview = async (req, res) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		console.log(msg);
		throw new ExpressError(msg, 400);
	}
	const { id } = req.params;
	const review = new Review(req.body.review);
	const campground = await Campground.findById(id).populate("reviews");
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash("success", "Successfully added your review!");

	res.redirect(`/campgrounds/${campground._id}`);
};

const reviewReply = async (req, res) => {
	const { reviewId, id } = req.params;
	console.log("REQ.BODY", req.body);
	const reply = new Reply(req.body);
	reply.author = req.user._id;
	await reply.save();
	console.log("REPLYY", reply);
	const campground = await Campground.findById(id).populate("reviews");
	const review = await Review.findById(reviewId).populate("reply");
	console.log(review);
	console.log("DISP CAMP", campground);
	review.reply.push(reply);

	await review.save();
	await campground.save();
	console.log("Review.Reply", review.reply);
	res.redirect(`/campgrounds/${campground._id}`);
};

const deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	req.flash("success", "Successfully deleted your review!");
	res.redirect(`/campgrounds/${id}`);
};
const deleteReply = async (req, res) => {
	const { id, reviewId, replyId } = req.params;
	await Reply.findByIdAndDelete(replyId);
	// await Review.findByIdAndUpdate(reviewId);
	const campground = await Campground.findById(id);
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports = { deleteReview, postReview, reviewReply, deleteReply };
