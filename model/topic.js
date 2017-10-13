var mongoose = require('../mongoose_helper').mongoose;

var TopicSchema = new mongoose.Schema({
	title: String,
	content: String,
	tab: String,
	username:String,
	insertTime:Date
});


TopicSchema.statics.addTopic = function(topic, callback){
	console.log("话题开始存入...")
	this.create(topic, callback);
    console.log("话题结束存入...")
};

// 获得所有话题
TopicSchema.statics.getTopics = function(query, option, callback){

    this.find(query, {}, option, callback);
    console.log("model中的getTopic方法执行。。。")
};

TopicSchema.statics.getTopic = function (topicId,callback) {
	this.findOne({_id:topicId},callback);
}
module.exports = mongoose.model('Topic', TopicSchema);