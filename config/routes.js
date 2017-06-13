var _ = require('underscore')
var moviemodel = require('../models/movie')
var usermodel = require('../models/user')

module.exports = function (app) {
    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user

        if (_user) {
            app.locals.user = _user
        }
        return next()
    })

    app.get('/', function (req, res) {
        console.log('user login successfully')
        console.log(req.session.user)
    /*  提前到预处理过程
        var _user = req.session.user

        if (_user) {
            app.locals.user = _user
        }*/
        moviemodel.fetch(function (err, movies) {
            if (err) { console.log(err); }
            res.render('index', {
                title: 'micoci',
                movies: movies
            })
        })
    })
    // 注册视图
    app.post('/user/signup', function (req, res) {
        var _user = req.body.user
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            usermodel.findOne({ name: _user.name }, function (err, user) {
                console.log(user)
                if (err) {
                    console.log(err)
                }
                if (user) {
                    res.redirect('/')
                } else {
                    user = new usermodel(_user)
                    user.save(function (err, user) {
                        if (err) {
                            console.log(err)
                        }
                        res.redirect('/admin/userlist')
                    })
                }
            })
        }
    })

    // 登录视图
    app.post('/user/signin', function (req, res) {
        /*console.log(req.body)
        console.log(req.body.user.name) //req.body 格式出问题了
        console.log()*/
        var _user = req.body.user
        console.log(req.body.user[name])
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
    })

    // 退出视图
    app.get('/logout', function (req, res) {
        delete req.session.user
        // 删除app中的缓存，使得页面也同步进行更改
        delete app.locals.user

        res.redirect('/')
    })
    // 用户列表视图
    app.get('/admin/userlist', function (req, res) {
        usermodel.fetch(function (err, users) {
            if (err) {
                console.log(err)
            }
            res.render('userlist', {
                title: '用户列表页',
                users: users
            })
        })
    })

    // 电影详情页视图
    app.get('/movie/:id', function (req, res) {
        var id = req.params.id
        moviemodel.findById(id, function (err, movie) {
            res.render('detail', {
                title: 'imovie' + movie.title,
                movie: movie
            })
        })
    })

    app.post('/admin/movie/new', function (req, res) {
        if (!req.body) { return res.sendStatus(400) }

        const id = req.body.movie._id
        let movieObj = req.body.movie
        let _movie

        if (id == 'undefined' || id == '') {
            _movie = new moviemodel({
                title: movieObj.title,
                directer: movieObj.directer,
                country: movieObj.country,
                language: movieObj.language,
                poster: movieObj.poster,
                flash: movieObj.flash,
                year: movieObj.year,
                summary: movieObj.summary
            })
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        } else {
            console.log(id)
            console.log('OK')
            moviemodel.findById(id, function (err, movie) {
                if (err) { console.log(err) }
                _movie = _.extend(movie, movieObj)
                _movie.save(function (err, _movie) {
                    if (err) { console.log(err) }
                })
                res.redirect('/movie/' + _movie._id)
            })
        }
    })

    app.get('/admin/movie', function (req, res) {
        res.render('admin', {
            movie: {}
        })
    })

    app.get('/admin/list', function (req, res) {
        moviemodel.fetch(function (err, movies) {
            if (err) { console.log(err) }
            res.render('list', {
                title: 'imovie List',
                movies: movies
            })
        })
    })

    app.get('/admin/update/:id', function (req, res) {
        var id = req.params.id
        if (id) {
            moviemodel.findById(id, function (err, movie) {
                res.render('admin', {
                    title: 'micoci更新',
                    movie: movie
                })
            })
        }
    })

    app.delete('/admin/list', function (req, res) {
        var id = req.query.id
        console.log(id)

        if (id) {
            moviemodel.remove({ _id: id }, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    res.json({ success: 1 })
                }
            })
        }
    })
}