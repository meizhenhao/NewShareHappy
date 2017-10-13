/**
 * Created by Administrator on 2017/9/24 0024.
 */
var express = require('express');
var router = express.Router();
var signController = require('../controller/sign');
var topicController = require('../controller/topic');
var auth = require('../middleware/auth');
var siteController = require('../controller/site');
var replyController = require('../controller/reply');
var FileController = require('../controller/fileController');
//显示注册页面
router.get('/signup',signController.showSignup);

//提交注册信息
router.post('/signup',signController.doSignup);

//显示登陆页面
router.get('/signin',signController.showSignin);

//提交登陆信息
router.post('/signin',signController.doSignin);

//登出
router.get('/signout',signController.doSignout);

//关于我
router.get('/aboutMe',function (req,res) {
    res.render('aboutMe');
});
//关于考研人
router.get('/aboutWeb',function (req,res) {
    res.render('aboutWeb');
});

//显示发表话题页面
router.get('/topic/create',auth.requireLogin,topicController.showCreateTopic);

//处理用户提交的话题信息
router.post('/topic/create',auth.requireLogin,topicController.doCreateTopic);



//显示上传文件页面
router.get('/upload/createFile',auth.requireLogin,FileController.showCreateFile);

//处理上传文件的信息
router.post('/upload/createFile',auth.requireLogin,FileController.doCreateFile);



//显示主页信息,话题信息
router.get('/',siteController.index);


//显示考研资源信息列表
router.get('/ResourceList',siteController.showResourceList);
//显示考研资源的详情页信息
router.get('/file/:fid',FileController.detail);
//下载资源文件
router.get('/downloadFile',auth.requireLogin,FileController.downloadFile);
//处理用户对于资源的评论
router.post('/replyFile/replyFile', auth.requireLogin,replyController.addReplyFile);

//显示话题详情页信息
router.get('/topic/:tid',topicController.detail);

//处理用户对于话题的评论
router.post('/reply/reply', auth.requireLogin,replyController.addReply);

//用户上传评论图片
router.post('/upload', auth.requireLogin, replyController.upload);

module.exports = router;