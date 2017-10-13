var mongoose = require('../mongoose_helper').mongoose;

var ReplySchema = new mongoose.Schema({
	FileId: String,
	content: String,
	username: String,
	insertTime: Date
});

ReplySchema.statics.addReply = function(reply, callback){
	this.create(reply, callback);
};

ReplySchema.statics.getReplys = function(fileId, callback){
	this.find({FileId: fileId}, callback);
};

module.exports = mongoose.model('ReplyFiles', ReplySchema);