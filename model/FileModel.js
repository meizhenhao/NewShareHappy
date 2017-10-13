var mongoose = require('../mongoose_helper').mongoose;

var FileSchema = new mongoose.Schema({
	Filetitle: String,
	Filecontent: String,
	Filetab: String,
    Fileurl: String,
	username:String,
	insertTime:Date
});


FileSchema.statics.addFile = function(File, callback){
	console.log("文件开始存入...")
	this.create(File, callback);
    console.log("文件结束存入...")
};

// 获得所有资源
FileSchema.statics.getFiles = function(query, option, callback){

    this.find(query, {}, option, callback);
    console.log("model中的getFiles方法执行。。。")
};

FileSchema.statics.getFile = function (FileId,callback) {
    this.findOne({_id:FileId},callback);
}

// // 获得所有话题
// TopicSchema.statics.getTopics = function(query, option, callback){
//
//     this.find(query, {}, option, callback);
//     console.log("model中的getTopic方法执行。。。")
// };
//
// TopicSchema.statics.getTopic = function (topicId,callback) {
// 	this.findOne({_id:topicId},callback);
// }
module.exports = mongoose.model('File', FileSchema);