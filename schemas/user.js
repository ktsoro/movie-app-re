const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

let UserSchema= new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt:{
            type: Date,
            default: Date.now()
        }
    }
})

movieSchema.pre('save', function(next){
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) { // SALT_WORK_FACTOR 加密严格程度和计算时间相关
        if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)

                user.password = hash
                next()
            })
    })

    next()
})

movieSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.createdAt').exec(cb)
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb)
    }
}

module.exports = movieSchema