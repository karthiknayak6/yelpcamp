const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reply = require("./reply");

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reply: {
		type: [Schema.Types.ObjectId],
		ref: "Reply",
	},
});

module.exports = mongoose.model("Review", reviewSchema);
