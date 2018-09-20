require('dotenv').config()
var express = require('express')
var app = express()
var bodyparser = require('body-parser');
var handler = require('./src/handler.js')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/TDNchat', function (req, res) {
    //res.send(200)
    console.log("ok!")
    console.log(req.body)
    handler.handle(req.body.name, req.body.senderID, req.body.msg, req.body.gender)
})

app.listen(80)