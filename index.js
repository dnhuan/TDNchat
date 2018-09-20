var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/TDNchat', function (req, res) {
    res.send(200)
    console.log(res)
})

app.listen(80)