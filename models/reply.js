const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const replySchema = new Schema({
	replyBody: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});
module.exports = mongoose.model("Reply", replySchema);
