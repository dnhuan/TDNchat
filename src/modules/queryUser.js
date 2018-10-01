var mongoDBQueue = require('mongodb-queue')
var Chatfuel = require('./Chatfuel')
var cache = require('memory-cache')

function checkQueue(senderID){
    return new Promise((resolve,reject)=>{
        console.log("Checking queue")
        var user = global.db.user
        var qu = mongoDBQueue(global.db,'QueueUser')
        var queueDB = global.db.collection("QueueUser")
        //check available
        queueDB.findOne({"payload":senderID},(err,obj)=>{
            if(err) reject(err)
            console.log("objecttt:",obj)
            if(obj == null){
                qu.add(senderID,(err,id)=>{
                    if(err) reject(err)
                    console.log("Inserted",id)
                    user.updateOne({"_id":senderID},{$set: {"status": 1,"connect":""}},()=>{statusQueue(senderID).then(()=>{resolve(true)}).catch(err=>{console.error(err)})})
                })
            }else statusQueue(senderID).then(()=>{resolve(true)}).catch(err=>{console.error(err)})
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
                Chatfuel.send(senderID,"Đang tìm kiếm, bạn vui lòng chờ tí nhé!","text")
                resolve(true)
            }
        })
    })
}

function pairUser(usrA,usrB){
    console.log("userA",usrA)
    console.log("userB",usrB)
    return new Promise((resolve,reject)=>{
        cache.put(usrA,usrB)
        cache.put(usrB,usrA)
        var user = global.db.user
        user.updateOne({"_id":usrA},{$set: {"status": 2,"connect":usrB}},(err)=>{
            if(err) reject(err)
            user.updateOne({"_id":usrB},{$set: {"status": 2,"connect":usrA}},(err)=>{
                if(err) reject(err)
                Chatfuel.send(usrA,'Đã ghép cặp! Cú pháp "exit" để dừng trò chuyện',"text")
                Chatfuel.send(usrB,'Đã ghép cặp! Cú pháp "exit" để dừng trò chuyện',"text")
                resolve(true)
            })
        })    
    })
}

function unpair(sender){
    return new Promise((resolve,reject)=>{
        var usrA = sender._id
        var usrB = sender.connect
        cache.del(usrA)
        cache.del(usrB)
        var user = global.db.user
        user.updateOne({"_id":usrA},{$set: {"status": 0,"connect":""}},err=>{
            if(err) reject(err)
            user.updateOne({"_id":usrB},{$set: {"status": 0,"connect":""}},err=>{
                if(err) reject(err)
                Chatfuel.send(usrA,"Đã ngắt kết nối với đối phương","text")
                Chatfuel.send(usrB,"Đã ngắt kết nối với đối phương","text")
                resolve(true)
            })
        })
    })
}

module.exports = {
    checkQueue,
    unpair
}