const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const Reply = require("./reply");

const ImageSchema = new Schema({
	url: String,
	filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
	{
		title: String,
		images: [ImageSchema],
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
	},
	opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
	return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});
CampgroundSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		console.log("DOOCCC", doc);
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
		await Reply.deleteMany({
			_id: {
				$in: doc.reviews.reply,
			},
		});
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
