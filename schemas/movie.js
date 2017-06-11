const mongoose = require('mongoose')

let movieSchema= new mongoose.Schema({
    title:String,
    directer:String,
    language:String,
    country:String,
    year:Number,
    poster:String,
    flash:String,
    summary:String,
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