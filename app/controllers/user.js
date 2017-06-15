var usermodel = require('../models/user')

// 注册视图
exports.signup = function (req, res) {
    var _user = req.body.user
    if (!req.body) {
        return res.sendStatus(400)
    } else {
        usermodel.findOne({ name: _user.name }, function (err, user) {
            if (err) {console.log(err)}

            if (user) {
                res.redirect('/')
            } else {
                user = new usermodel(_user)
                user.save(function (err, user) {
                    if (err) { console.log(err)}
                    
                    res.redirect('/admin/userlist')
                })
            }
        })
    }
}

// 登录视图
exports.signin = function (req, res) {

    var _user = req.body.user
    var name = _user.name
    var password = _user.password
    usermodel.findOne({ name: name }, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect('/')
        } else {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log(err)
                } else if (isMatch) {
                    // session 需要cookie-parser来保存信息，session是服务器和客户端的会话状态
                    req.session.user = user

                    return res.redirect('/')
                } else {
                    console.log('Password is not matched')
                    return res.redirect('/')
                }
            })
        }
    })
}

// 退出视图
exports.logout = function (req, res) {
    delete req.session.user
    // 删除app中的缓存，使得页面也同步进行更改
   // delete app.locals.user

    res.redirect('/')
}

// 用户列表视图
exports.list =  function (req, res) {
    usermodel.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        })
    })
}

// midware for user
exports.signinRequired =  function (req, res, next) {
    var user = req.session.user

    if (!user) {
        return res.redirect('/')   //
    }
    next()
}

// midware for admin user
exports.adminRequired =  function (req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        return res.redirect('/')   //
    }
    next()
}