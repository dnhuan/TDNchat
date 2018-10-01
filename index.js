require('dotenv').config()
var express = require('express')
var app = express()
var bodyparser = require('body-parser')
var handler = require('./src/handler.js')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
global.db


MongoClient.connect(process.env.MongoURL,{ useNewUrlParser: true }, function(err, db) {
  if(err) console.error(err)
  global.db = db.db("TDNchat")
  global.db.user = global.db.collection("User")
  global.db.queueDB = global.db.collection("QueueUser")
  //
  app.use(bodyparser.json())
  app.use(bodyparser.urlencoded({ extended: true }))

  app.get('/', function (req, res) {
    res.send('Hello World')
  })
  app.post('/TDNchat', function (req, res) {
      res.sendStatus(200)
      console.log("-----------------------------------")
      if(req.body.handle_token == "02sr4KvZJ4VECgsMTerD4eMJpUlJ3DVa"){
        handler.handle(req.body.name, req.body.senderID.toString(), req.body.msg, req.body.gender)
      }
  })
  app.get('/audio',(req,res)=>{
    res.json({
      "messages": [
        {
          "attachment": {
            "type": "audio",
            "payload": {
              "url": req.query.audioURL
            }
          }
        }
      ]
    })
  })
  //
  app.get('/image',(req,res)=>{
    res.json({
      "messages": [
        {
          "attachment": {
            "type": "image",
            "payload": {
              "url": req.query.imageURL
            }
          }
        }
      ]
    })
  })
  //
  app.listen(process.env.APP_PORT)
})