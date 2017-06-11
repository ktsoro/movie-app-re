let mongoose = require('mongoose')

let movieSchema = require('../schemas/movie')

let movie = mongoose.model('movie', movieSchema)

module.exports = movie
