var path = require('path');
var fs = require('fs');
var ReplyModel = require('../model/reply');
var ReplyFileModel = require('../model/replyFile');
//添加 对于话题的回复
exports.addReply = function(req, res){
	var topicId = req.body.topicId;
	var content = req.body.content;
	var username = req.session.user.username;

	ReplyModel.addReply({
		topicId: topicId,
		content: content,
		username: username,
		insertTime: Date.now()
	}, function(err, result){
		res.redirect('/topic/'+topicId);
	})
};

//添加 对于资源的回复
exports.addReplyFile = function(req, res){
    var FileId = req.body.FileId;
    var content = req.body.content;
    var username = req.session.user.username;

    ReplyFileModel.addReply({
        FileId: FileId,
        content: content,
        username: username,
        insertTime: Date.now()
    }, function(err, result){
        res.redirect('/file/'+FileId);
    })
};


exports.upload = function(req, res){
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
		var newFilename = String((new Date()).getTime())+path.extname(filename);
		var filePath = __dirname + '/../public/upload/'+ newFilename;
		var url = '/public/upload/'+newFilename;

		file.pipe(fs.createWriteStream(filePath));
		file.on('end', function(){
			res.json({success: true, url: url});
		})
	})
};