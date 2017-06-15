var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
// mongoose.Promise = global.Promise

var commentSchema= new Schema({
    movie: {
        type: String,
        ref: 'movie'
    },
    from: {
        type: ObjectId,
        ref: 'user'
    },
    reply: [{
        from: {type: ObjectId, ref:'user'},
        to: {type: ObjectId, ref: 'user'},
        content: String
    }],
    to: {
        type: ObjectId,
        ref: 'user'
    },
    content: String,
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

commentSchema.pre('save', function(next){
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

commentSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.createdAt').exec(cb)
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb)
    }
}

module.exports = commentSchema