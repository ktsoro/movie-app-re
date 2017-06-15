const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const multipart = require('connect-multiparty')
const logger = require('morgan')

const port = process.port || 3000
const dbUrl = 'mongodb://imovie:test@106.14.144.157:27017/imovie'

var app = express()

mongoose.connect(dbUrl)

app.set('view engine', 'pug')
app.set('views', './app/views/pages')

app.use(express.static('./public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'micoci',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    // 通过morgan来进行显示
    app.use(logger(':method :url :status'))
    // 格式化代码
    app.locals.pretty = true
    // mongoose debug的开关
    mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
console.log('micoci use the port:' + 3000)