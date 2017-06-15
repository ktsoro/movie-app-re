let mongoose = require('mongoose')

let UserSchema = require('../schemas/user')

var user = mongoose.model('user', UserSchema)

module.exports = user