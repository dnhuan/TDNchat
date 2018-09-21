require('dotenv').config()
var express = require('express')
var app = express()
var bodyparser = require('body-parser')
var handler = require('./src/handler.js')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
global.db

MongoClient.connect("mongodb://localhost:27017/",{ useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  else global.db = db.db("TDNchat")
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/TDNchat', function (req, res) {
    res.sendStatus(200)
    console.log("Receive request")
    console.log(req.body)
    if(req.body.handle_token == "02sr4KvZJ4VECgsMTerD4eMJpUlJ3DVa"){
      console.log("Token: true")
      handler.handle(req.body.name, req.body.senderID.toString(), req.body.msg, req.body.gender)
    }
})

app.listen(80)