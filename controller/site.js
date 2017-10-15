var topicModel = require('../model/topic');
var fileModel = require('../model/FileModel');
var _ = require('lodash');
var eventproxy = require('eventproxy');
var timeHelper = require('../time_helper');

//显示所有话题列表
exports.index = function(req, res){
	console.log("index方法执行。。。");
	var page = parseInt(req.query.page) || 1;
	page = page > 0 ? page : 1;
	var tab = req.query.tab || 'all';
	var query = {};
	if(tab !== 'all'){
		query.tab = tab;
	}
	var ep = new eventproxy();
	var count = 5;
	var option = {skip: (page-1)*count, limit: count, sort: '-insertTime'};

	topicModel.getTopics(query, option, function(err, topics){
		topics = _.map(topics, function(topic){

			topic.newTime = timeHelper.formatTime(topic.insertTime);
            console.log("时间。。。"+topic.newTime);
			return topic;

		})
		ep.emit('topic_data_ok', topics);

	});
    console.log("controller中的getTopics方法结束。。。")

	topicModel.count(query, function(err, allCount){
		var pageCount = Math.ceil(allCount/count);
		ep.emit('page_count_ok', pageCount);
	})
	ep.all('topic_data_ok', 'page_count_ok', function(topics, pageCount){
        console.log("ep.all方法执行。。。")
		res.render('index', {topics: topics, tab: tab, page: page, pageCount: pageCount});
	})
}


//显示所有考研资源列表
exports.showResourceList = function(req, res){

    var page = parseInt(req.query.page) || 1;
    page = page > 0 ? page : 1;
    var tab = req.query.tab || 'all';

    var query = {};
    if(tab !== 'all'){
        query.Filetab = tab;
    }

    var ep = new eventproxy();
    var count = 5;
    var option = {skip: (page-1)*count, limit: count, sort: '-insertTime'};

    fileModel.getFiles(query, option, function(err, files){
        files = _.map(files, function(file){

            file.newTime = timeHelper.formatTime(file.insertTime);
            console.log("时间。。。"+file.newTime);
            return file;

        })
        ep.emit('File_data_ok', files);

    });
    console.log("controller中的getFiles方法结束。。。")

    fileModel.count(query, function(err, allCount){
        var pageCount = Math.ceil(allCount/count);
        ep.emit('page_count_ok', pageCount);
    })
    ep.all('File_data_ok', 'page_count_ok', function(files, pageCount){
        console.log("ep.all方法执行。。。")
        res.render('file/resourceList', {files: files, tab: tab, page: page, pageCount: pageCount});
    })
}