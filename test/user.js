var crypto = require('crypto')
var bcrypt = require('bcrypt')

function getRandomString(len) {
    if (!len) len = 16
    
    return crypto.randomBytes(Math.ceil(len/2).toString('hex'))
}

var should = require('should')
var app = require('.../../app')
var mongoose = require('mongoose')
var usermodel = require('../../app/models/uesr')

descript('<Unit Test', function() {
    descript('Model User:', function() {
        before(function(done) {
            user = {
                name: getRandomString(),
                password: 'password'
            }

            done()
        })

        descript('Before Method Save', function() {
            it('should begin without test user', function(done) {
                User.find({name: user.name}, function(err, users) {
                    users.should.have.length(0)

                    done()
                })
            })
        })

        descript('User save', function() {
            it('should save without problems', function(done) {
                var _user = new usermodel(user)
                
                _user.save(function(err) {
                    should.not.exist(err)
                    _user.remove(function(err) {
                        should.not.exist(err)
                    })
                })
            })
        })
    })
})