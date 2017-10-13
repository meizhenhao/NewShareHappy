/**
 * Created by Administrator on 2017/9/26 0026.
 */
exports.requireLogin = function(req, res, next){
    if(req.session.user){
        return next();
    }
    res.status(402);
    // 说明没有登录
    res.redirect('/signin');
}