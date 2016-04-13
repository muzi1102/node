var express = require('express');
var router = express.Router();
// md5保护密码
var crypto = require('crypto');
/* GET home page. */
router.get('/', function(req, res, next) {
    // var User = global.dbHelper.getModel('user');
    var Post = global.dbHelper.getModel('post');
    Post.find({},function(error,docs1){
        if (docs1) {
            res.render('index',{
                posts:docs1,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        }
    })
});
// register
router.get('/reg',function(req, res, next){
    res.render('reg',{
        title:'Register',
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
});
router.post('/reg',function(req, res, next){
    var name=req.body.username;
    var passwordrepeat=req.body.passwordrepeat;
    var password=req.body.password;
    var User = global.dbHelper.getModel('user');
    // 先检查2次密码是否一致
    if (password!=passwordrepeat) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var spassword=md5.update(password).digest('base64');
    // 检查用户名是否已经存在
    User.findOne({name:name},function(err,docs){
        if (docs) {
            err="用户名已存在"
        }
        if (err) {
            req.flash('error',err);
            return res.redirect('/reg');
        }
        // 不存在的存入数据库
        User.create({name:name,password:spassword},function(err,docs){
            if (err) {
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user=docs;
            req.flash('success', '注册成功');
            res.redirect('/');
        })
    })
})
// login
router.get('/login',checkNotLogin);
router.get('/login',function(req,res,next){
    res.render('login',{
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
});
router.post('/login',function(req,res,next){
    var username=req.body.username;
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var User=global.dbHelper.getModel('user');
        User.findOne({name:username},function(err,docs){
            if (!docs) {
                req.flash('error','用户不存在');
                return res.redirect('/reg');
            }
            if (docs.password!=password) {
                req.flash('error','密码错误');
                return res.redirect('/login');
            }
            req.session.user=docs;
            req.flash('success', '登入成功');
            res.redirect('/');
        })
})
// say的路由
router.post('/post',function(req,res,next){
    var currentUser=req.session.user;
    var Post = global.dbHelper.getModel('post');
    Post.create({pname:currentUser.name,content:req.body.post},function(err,docs){
        if (err) {
            req.flash('error',err);
        }
        req.flash('success','发表成功');

        res.redirect('/u/'+currentUser.name)
    })
})
// 这里有问题
// 个人主页
router.get('/u/:user',checkLogin);
router.get('/u/:user',function(req,res,next){
    var User = global.dbHelper.getModel('user');
    var Post = global.dbHelper.getModel('post');
    User.findOne({name:req.params.user},function(err,user){
        if (!user) {
            req.flash('error','用户不存在');
            return res.redirect('/');
        }
        Post.find({pname:user.name},function(err,docs){
            if (err) {
                req.flash('error', err);
                res.redirect('/')
            }
            res.render('user',{
                user:req.session.user,
                posts:docs,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })
})
// loginout
router.get('/logout',checkLogin)
router.get('/logout',function(req,res,next){
    req.session.user=null;
    req.flash('success','loginout success');
    res.redirect('/');
})
function checkNotLogin(req,res,next){
    if (req.session.user) {
        req.flash('error', 'User already login');
        return res.redirect('/');
    }
    next();
}
function checkLogin(req,res,next){
    if (!req.session.user) {
        req.flash('error', 'User not login');
        return res.redirect('/');
    }
    next();
}
module.exports = router;
