var mongoDBQueue = require('mongodb-queue')
var Chatfuel = require('./Chatfuel')

function checkUser(name,senderID,gender){
    return new Promise((resolve,reject) =>{
        var user = global.db.user
        user.findOne({'_id': senderID}, (err,res)=>{
            if(err) reject(err)
            if(res == null){
                console.log("Insert:",senderID)
                res = {
                    "_id":  senderID,
                    "name": name,
                    "gender": gender,
                    "status": 0,
                    "connect": "",
                    "chatID": ""
                }
                user.insertOne(res,(err,sta) => {
                    if(err) throw err
                    resolve(res)
                } )
            }
            else resolve(res)
        })
    })
}

function checkQueue(senderID){
    return new Promise((resolve,reject)=>{
        console.log("Checking queue")
        var user = global.db.user
        var qu = mongoDBQueue(global.db,'QueueUser')
        var queueDB = global.db.collection("QueueUser")
        //check available
        queueDB.findOne({"payload":senderID},(err,obj)=>{
            console.log("objecttttt:",obj)
            if(obj == null){
                qu.add(senderID,(err,id)=>{
                    console.log("Inserted",id)
                    user.updateOne({"_id":senderID},{$set: {"status": 1,"connect":""}},err=>{statusQueue(senderID)})
                })
            }else statusQueue(senderID)
        })
    })
}

function statusQueue(senderID){
    return new Promise((resolve,reject)=>{
        var qu = mongoDBQueue(global.db,'QueueUser')
        var queueDB = global.db.queueDB
        qu.size((err,qsize)=>{
            if(qsize >= 2){
                //select
                qu.get((err, usrA)=>{
                    if(err) reject(err)
                    queueDB.deleteOne({"payload":usrA.payload},err=>{
                        if(err) reject(err)
                        qu.get((err,usrB)=>{
                            if(err) reject(err)
                            queueDB.deleteOne({"payload":usrB.payload},err=>{
                                if(err) reject(err)
                                pairUser(usrA.payload,usrB.payload).then((sol)=>{
                                        console.log(sol)
                                        resolve({
                                            "status": "Paired",
                                            "usrA": usrA,
                                            "usrB": usrB
                                        })
                                    }).catch((err)=>{throw err})
                        })
                    })
                })
            })}
            else{
                Chatfuel.send(senderID,"Đang tìm kiếm, bạn vui lòng chờ tí nhé!","text").then(()=>{resolve({"status":"Queuing"})}).catch((err)=>{throw err})
            }
        })
    })
}

function pairUser(usrA,usrB){
    console.log("userA",usrA)
    console.log("userB",usrB)
    return new Promise((resolve,reject)=>{
        var user = global.db.user
        user.updateOne({"_id":usrA},{$set: {"status": 2,"connect":usrB}},(err)=>{
            if(err) reject(err)
            user.updateOne({"_id":usrB},{$set: {"status": 2,"connect":usrA}},(err)=>{
                if(err) reject(err)
                return Promise.all([Chatfuel.send(usrA,'Đã ghép cặp! Cú pháp "exit!" để dừng trò chuyện',"text"),Chatfuel.send(usrB,'Đã ghép cặp! Cú pháp "exit!" để dừng trò chuyện',"text")]).then((res)=>{resolve(res)}).catch(err=>{throw err})
            })
        })    
    })
}

function unpair(sender){
    return new Promise((resolve,reject)=>{
        var usrA = sender._id
        var usrB = sender.connect
        var user = global.db.user
        user.updateOne({"_id":usrA},{$set: {"status": 0,"connect":""}},err=>{
            if(err) reject(err)
            user.updateOne({"_id":usrB},{$set: {"status": 0,"connect":""}},err=>{
                if(err) reject(err)
                return Promise.all([Chatfuel.send(usrA,"Đã ngắt kết nối với đối phương","text"),Chatfuel.send(usrB,"Đã ngắt kết nối với đối phương","text")]).then((res)=>{resolve(res)}).catch(err=>{throw err})
            })
        })
    })
}

module.exports = {
    checkUser,
    checkQueue,
    unpair
}