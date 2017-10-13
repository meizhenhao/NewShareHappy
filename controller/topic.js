/**
 * Created by Administrator on 2017/9/24 0024.
 */
var TopicModel = require('../model/topic');
var validator = require('validator');
var eventproxy = require('eventproxy');
var _ = require('lodash');
var timeHelper = require('../time_helper');
var replyModel = require('../model/reply');
// 显示创建话题的页面
exports.showCreateTopic=function (req,res) {
    res.render('topic/createTopic');
}

// 通过post方式提交话题
exports.doCreateTopic=function (req,res) {

    var tab = validator.trim(req.body.tab);

    var title =  validator.trim(req.body.title);

    var content =  validator.trim(req.body.content);

    if(req.session.user){
        req.session.user = req.session.user;
        console.log("req.session.user.username",req.session.user.username);
    }
    // 判断是否为空
    var hasEmptyInfo = [title, tab, content].some(function(item){
        return item === '';
    })

    if(hasEmptyInfo){
        res.status(422);
        return res.render('topic/create', {error: '您填写的信息不完整'});
    }

    var topicData = {
        title: title,
        content: content,
        tab: tab,
        username: req.session.user.username,
        insertTime: Date.now()
    };

    TopicModel.addTopic(topicData, function(err, result){
        if(err){
            return res.render('topic/createTopic', {error: '发表话题失败'});
        }

            return res.render('topic/createTopic', {success: '发表话题成功！'});

    })
}

exports.detail = function (req,res) {
    var topicId = req.params.tid;
    var ep = new eventproxy();
    console.log("detail方法开始。。。")
    TopicModel.getTopic(topicId,function (err,topic) {

        topic.newTime = topic.insertTime.toLocaleDateString()
            + ' '
            + topic.insertTime.toTimeString().replace(/\sGM.*$/, '');
        console.log('getTopic方法开始...');
        ep.emit('topic_data_ok',topic);

    })
    // 获取总的评论数
    replyModel.count({topicId:topicId},function (err,count) {
        console.log('获取总评论方法开始...');
        ep.emit('reply_data_ok',count);

    })
     // 获取评论列表
    replyModel.getReplys(topicId,function (err,replys) {
        replys = _.map(replys,function (reply) {
            reply.timeStr = timeHelper.formatTime(reply.insertTime);
            return reply;
        });
        console.log('获取评论列表方法开始...');
        ep.emit('reply_list_ok',replys);

    })
    // 捕获所有事件
    ep.all('topic_data_ok','reply_data_ok','reply_list_ok',function (topic,count,replys) {
        res.render('topic/detail',{topic:topic,count:count,replys:replys});
        console.log('捕获所有事件方法开始...')
    })
}

