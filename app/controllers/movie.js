var _ = require('underscore')
var mongoose = require('mongoose')
var moviemodel = require('../models/movie')
var commentmodel = require('../models/comment')

// 电影详情页视图
exports.detail =  function (req, res) {
    var id = req.params.id
    moviemodel.findById(id, function (err, movie) {
        moviemodel.update({_id: id}, {$inc: {pv:1}}, function(err) {if(err) console.log(err)})
        commentmodel
            .find({movie: id}) // 找到评论数据
            .populate('from', 'name') // 根据obj数据from，查询name
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
             console.log(comments)
                res.render('detail', {
                    title: 'imovie' + movie.title,
                    movie: movie,
                    comments: comments
                })
            })
    })
}

exports.save = function (req, res) {
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
}

exports.new =  function (req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {}
    })
}

exports.list = function (req, res) {
    moviemodel.fetch(function (err, movies) {
        if (err) { console.log(err) }
        res.render('list', {
            title: 'imovie List',
            movies: movies
        })
    })
}

exports.update =  function (req, res) {
    var id = req.params.id
    if (id) {
        moviemodel.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'micoci更新',
                movie: movie
            })
        })
    }
}

exports.del =  function (req, res) {
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
}