var moviemodel = require('../models/movie')

// index page
exports.index = function (req, res) {
    moviemodel.fetch(function (err, movies) {
        if (err) { console.log(err); }

        res.render('index', {
            title: 'micoci 首页',
            movies: movies
        })
    })
}