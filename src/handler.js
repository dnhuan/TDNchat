var qu = []

function handle(name, senderID, msg, gender){
    console.log("Start handler: ",name,senderID)
    //check db
    var user = global.db.collection("User")
    var query = user.findOne({'_id': senderID}).then((res) => {
        console.log(res)
        if(res == null){
            console.log("Insert:",senderID)
            res = {
                "_id":  senderID,
                "name": name,
                "gender": gender,
                "status": 0,
                "connect": 0,
                "chatID": 0
            }
            user.insertOne(res)
        }
        return res
    })
    //status 0-free, 1-pending, 2-paired
    if(query.status == 0){
        if(msg.toLowerCase() == "bắt đầu"){
            checkQueue(senderID,user,(err,res)=>{
                if(err) console.error(err)
                if(res.status == "Pairing"){
                    console.log(res.usrA," <--> ",res.usrB)
                }
                if(res.status == "Queuing"){
                    if(res.size == 1) console.log("Queuing: ",res.inline)
                }
            })
        }else{
            //nhắn linh tinh
        }
    }
    if(query.status == 1) //báo đang tìm kiếm
    if(query.status == 2){
        if(msg == "stop"){
            //stop
        }else{
            //forward msg
        }
    }
}

function checkQueue(senderID,user,cb){
    console.log("Checking queue")
    qu.push(senderID)
    if(qu.length > 1){
        var usrA = qu[0], usrB = qu[1];
        qu.shift()
        qu.shift()
        //pairing
        //thong bao chatfuel
        user.updateOne({"_id":usrA},{$set: {"status": 2,"connect":usrB}})
        user.updateOne({"_id":usrB},{$set: {"status": 2,"connect":usrA}})
        //tra ve cb
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