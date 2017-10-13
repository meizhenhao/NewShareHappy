/**
 * Created by Administrator on 2017/9/24 0024.
 */
var TopicModel = require('../model/topic');
var validator = require('validator');
var eventproxy = require('eventproxy');
var _ = require('lodash');
var timeHelper = require('../time_helper');
var replyModel = require('../model/replyFile');

var FileModel = require('../model/FileModel');
var path = require('path');
var fs = require('fs');
var inspect = require('util').inspect;

//下载http文件
// var request = require('request');
var downloadFile = require('download-to-file')
// 显示上传文件的页面
exports.showCreateFile=function (req,res) {
    res.render('file/createFile');
};


// 通过post方式提交上传文件
exports.doCreateFile=function (req,res) {
    var isFile = '';
    var Fileurl = '';
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
        var newFilename = String((new Date()).getTime())+filename;
        var filePath = __dirname + '/../public/upload/'+ newFilename;
        Fileurl = '/public/upload/'+newFilename;

        file.pipe(fs.createWriteStream(filePath));
        console.log('文件已经上传');
        // file.on('end', function(){
        //     res.json({success: true, url: url});
        // })
        isFile = filename;
        console.log('isFile=' + isFile);
    });
    var fieldsArray = [];
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        // console.log( fieldname + ' : ' + inspect(val));
        // fieldsArray[fieldname]=inspect(val);

        console.log( fieldname + ' : ' + val);
        fieldsArray[fieldname]=val;
    });

    req.busboy.on('finish', function() {
        console.log('总的上传文件完毕!');

        var Filetitle = fieldsArray['title'];
        var Filetab = fieldsArray['tab'];
        var Filecontent = fieldsArray['content'];
        // 判断是否为空
        console.log('判断空开始....！');
        var hasEmptyInfo = [Filetitle, Filetab, Filecontent,isFile].some(function(item){
            return item === '';
        })
        console.log('判断空结束！');
        if(hasEmptyInfo){
            res.status(422);
            return res.render('file/createFile', {error: '提交信息不完整！'});
        }
        console.log('信息正确无误！');

        var FileData = {
            Filetitle: Filetitle,
            Filecontent: Filecontent,
            Filetab: Filetab,
            Fileurl:Fileurl,
            username: req.session.user.username,
            insertTime: Date.now()
        };

        FileModel.addFile(FileData, function(err, result){
            if(err){
                return res.render('file/createFile', {error: '上传文件失败'});
            }

            return res.render('file/createFile', {success: '文件上传成功！'});

        })


    });
    // req.pipe(busboy);





    // var tab = validator.trim(req.body.tab);
    //
    // var title =  validator.trim(req.body.title);
    //
    // var content =  validator.trim(req.body.content);
    //
    // if(req.session.user){
    //     req.session.user = req.session.user;
    //     console.log("req.session.user.username",req.session.user.username);
    // }
    // // 判断是否为空
    // var hasEmptyInfo = [title, tab, content].some(function(item){
    //     return item === '';
    // })
    //
    // if(hasEmptyInfo){
    //     res.status(422);
    //     return res.render('topic/create', {error: '您填写的信息不完整'});
    // }
    //
    // var topicData = {
    //     title: title,
    //     content: content,
    //     tab: tab,
    //     username: req.session.user.username,
    //     insertTime: Date.now()
    // };
    //
    // TopicModel.addTopic(topicData, function(err, result){
    //     if(err){
    //         return res.render('topic/createTopic', {error: '发表话题失败'});
    //     }
    //
    //         return res.render('topic/createTopic', {success: '发表话题成功！'});
    //
    // })
}


//显示资源列表详情页信息
exports.detail = function (req,res) {
    var FileId = req.params.fid;
    var ep = new eventproxy();
    console.log("detail方法开始。。。")
    FileModel.getFile(FileId,function (err,file) {

        file.newTime = file.insertTime.toLocaleDateString()
            + ' '
            + file.insertTime.toTimeString().replace(/\sGM.*$/, '');
        console.log('getTopic方法开始...');
        ep.emit('file_data_ok',file);

    })

    // 获取资源的评论数
    replyModel.count({FileId:FileId},function (err,count) {
        console.log('获取总评论方法开始...');
        ep.emit('reply_data_ok',count);

    })

     // 获取评论列表
    replyModel.getReplys(FileId,function (err,replys) {
        replys = _.map(replys,function (reply) {
            reply.timeStr = timeHelper.formatTime(reply.insertTime);
            return reply;
        });
        console.log('获取评论列表方法开始...');
        console.log('replys的长度='+replys.length);
        ep.emit('reply_list_ok',replys);

    })
    // 捕获所有事件
    ep.all('file_data_ok','reply_data_ok','reply_list_ok',function (file,count,replys) {
        res.render('file/detail',{file:file,count:count,replys:replys});
        console.log('捕获所有事件方法开始...')
    })
}


exports.downloadFile = function (req,res) {
    var q = req.query;

    var fromUrl = q.Fileurl;
    var fileId = q.Fileid;
    if(fromUrl){
        // 使用绝对路径
        res.download('E:/myNodeJS/cnode'+fromUrl, function(err){
            if (err) {
                res.render('error',{message:'文件下载失败!'});
            } else {
                res.render('file/'+fileId);
            }
        });
    }else{
        res.render('error',{message:'文件路径有问题!'});
    }



}

