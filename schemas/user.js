const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

var UserSchema= new mongoose.Schema({
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

UserSchema.pre('save', function(next){
    var user = this   // 将当前环境赋值给user
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
})

// 实例方法
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMathch) {
            if (err) return cb(err)
            // 返回一个值来标识匹配与否
            cb(null, isMathch)
        })
    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.createdAt').exec(cb)
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb)
    }
}

module.exports = UserSchema