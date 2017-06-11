const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const _ = require('underscore')
var moviemodel = require('./models/movie')
const port = process.port || 3000

var app = express()

mongoose.connect('mongodb://imovie:test@106.14.144.157:27017/imovie')

app.locals.moment = require('moment')
app.set('view engine', 'pug')
app.set('views', './views/pages')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res) {
    moviemodel.fetch(function(err, movies) {
        if (err) { console.log(err); }
        res.render('index', {
            title: 'micoci',
            movies: movies
        })
    })
})
app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    moviemodel.findById(id, function(err, movie){
        res.render('detail', {
            title: 'imovie'+movie.title,
            movie: movie
        })
    })
})
app.post('/admin/movie/new', function(req, res) {
    if (!req.body) { return res.sendStatus(400) }

    const id = req.body.movie._id
    let movieObj = req.body.movie
    let _movie

    if (id == 'undefined' || id == ''){
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
        _movie.save(function(err, movie){
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/'+movie._id)
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
            res.redirect('/movie/'+_movie._id)
        })
    }
})

app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        movie: {}
    })
})
app.get('/admin/list',function (req, res) {
    moviemodel.fetch(function(err, movies){
        if (err) {console.log(err)}
        res.render('list',{
            title:'imovie List',
            movies: movies
        })
    })
})

app.get('/admin/update/:id',function(req,res){
    var id = req.params.id
    if(id) {
        moviemodel.findById(id, function(err, movie){
            res.render('admin',{
                title: 'micoci更新',
                movie: movie
            })
        })
    }
})
app.delete('/admin/list', function(req, res) {
    var id = req.query.id
    console.log(id)

    if(id) {
        moviemodel.remove({_id: id}, function(err) {
            if (err) {
                console.log(err)
            }else {
                res.json({success: 1})
            }
        })
    }
})
app.listen(port)
console.log('micoci use the port:'+3000 )