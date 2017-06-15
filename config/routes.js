var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')

module.exports = function (app) {
    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user
        // 去除判断，使得空值也能被传入
        app.locals.user = _user
        
        return next()
    })

    // index
    app.get('/', Index.index)
   
   // user
   app.post('/user/signup', User.signup)
   app.post('/user/signin', User.signin)
   app.get('/signin', User.showSignin)
   app.get('/logout', User.logout)
   app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)

   // movie
   app.get('/movie/:id', Movie.detail)
   app.get('/admin/update/:id', User.signinRequired, User.adminRequired, Movie.update)
   app.get('/admin/list', User.signinRequired, User.adminRequired, Movie.list)
   app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save)
   app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.new)
   app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

   // comment
   app.post('/user/comment', User.signinRequired, Comment.save)

 
}