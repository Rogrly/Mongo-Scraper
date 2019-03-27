var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HeadlineSchema = new Schema ({
	headline: {
			type: String,
			unique: true
	},
	summary: {
			type: String
	},
	link: {
			type: String
	},
	photo: {
			type: String
	},
	date: {
			type: Date
	},
	saved: {
			type: Boolean,
			default: false
	},
	note: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});
var Headline = mongoose.model("Headline", HeadlineSchema);
module.exports = Headline;