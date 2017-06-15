var commentmodel = require('../models/comment')

// 评论页视图
exports.save = function (req, res) {
    var _comment = req.body.comment
    console.log(req.body)
    var movieId  = _comment.movie

    if (_comment.cid) {
        console.log(_comment.cid)
        commentmodel.findById(_comment.cid, function(err, comment) {
            console.log(comment)
            var reply = {
                from: _comment.form,
                to: _comment.tid,
                content: _comment.content
            }
            comment.reply.push(reply)

            comment.save(function(err, comment) {
                if(err) console.log(err)

                res.redirect('/movie/' + movieId)
            })
        })
    }else {
        var comment =new commentmodel(_comment)

        comment.save(function(err, comment) {
            if (err) {console.log(err)}

            res.redirect('/movie/'+ movieId)
        })
    }
}
