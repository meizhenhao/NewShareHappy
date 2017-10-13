/**
 * Created by Administrator on 2017/9/24 0024.
 */
var eventproxy = require('eventproxy');
var UserModel= require('../model/user');

exports.showSignup=function (req,res) {
    res.render('sign/signup');
}

exports.doSignup=function (req,res) {
    //获取用户数据
    var username = req.body.username;
    var pass = req.body.password;
    var re_pass = req.body.Repassword;
    var email = req.body.email;
    var ep = new eventproxy();
    ep.on('info_error', function(msg){
        res.status(422);
        res.render('sign/signup', {error: msg});
    })
    //校验数据
    var hasEmptyInfo = [username, pass, re_pass, email].some(function(item){
        return item === '';
    });
    var isPassDiff = pass !== re_pass;

    if(hasEmptyInfo || isPassDiff){
        ep.emit('info_error', '注册信息错误');
        reutrn;
    }
    //保存到数据库
    UserModel.getUserBySignupInfo(username, email, function(err, users){
        if(err){
            ep.emit('info_error', '获取用户数据失败！');
            return;
        }
        if(users.length>1){
            console.log(users.length+"长度");
            console.log(users.toString());
            ep.emit('info_error', '用户名或者邮箱被占用！');
            return;
        }
        UserModel.addUser({username: username, pass: pass, email: email}, function(err, result){
            if(result){
                // res.render('sign/signup', {success: '恭喜你，注册成功'});
                res.render('sign/RegisterSuccess');
            }else{
                ep.emit('info_error', '注册失败！');
            }
        })
    })
}

exports.showSignin=function (req,res) {
    res.render('sign/signin');
}

exports.doSignin=function (req,res) {
    var username = req.body.username;
    var pass = req.body.password;
    if(!username || !pass){
        res.status(422);
        return res.render('sign/signin', {error: '您填写的信息不完整'});
    }
    UserModel.getUser(username, pass, function(err, user){
        if(err){
            res.render('sign/signin', {error: '数据库查询失败！'});
            return;
        }

        if(user){
            req.session.user = user;
            // res.render('sign/signin', {success: '登陆成功'});
            res.render('sign/LoginSuccess');
        }else{
            res.status(422);
            res.render('sign/signin', {error: '用户名或者密码错误！'});
        }
    })
}

exports.doSignout=function (req,res) {
    req.session.destroy();
    return res.redirect('/')
}


