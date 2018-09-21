var qu = []

function handle(name, senderID, msg, gender){
    console.log("Start handler",name," ",senderID)
    //
    var user = global.db.collection("User")
    var query  = user.findOne({'_id': senderID})
    if(query == undefined){
    console.log(senderID)
        user.insertOne({
            "_id":  senderID,
            "name": name,
            "gender": gender,
            "status": 0,
            "connect": 0,
            "chatID": 0
        })
    }
    //status 0-free, 1-pending, 2-paired
    // checkQueue(senderID,(err,res)=>{
    //     if(err) console.error(err)
    //     if(res.status == "Pairing"){
    //         console.log(res.usrA," <--> ",res.usrB)
    //     }
    //     if(res.status == "Queuing"){
    //         if(res.size == 1) console.log("Queuing: ",res.inline)
    //     }
    // })
}

function checkQueue(senderID,cb){
    console.log("Checking queue")
    qu.push(senderID)
    if(qu.length > 1){
        var usrA = qu[0], usrB = qu[1];
        qu.shift()
        qu.shift()
        //pairing
        cb("",{
            "status": "Pairing",
            "usrA": usrA,
            "usrB": usrB
        })
    }else{
        cb("",{
            "status": "Queuing",
            "size": qu.length,
            "inline": qu[0],
        })
    }
}

module.exports = {
    handle
}