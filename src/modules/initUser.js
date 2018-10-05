var cache = require('memory-cache')

function checkUser(name,senderID,gender){
    return new Promise((resolve,reject) =>{
        var connectID = cache.get(senderID)
        if(connectID != null){
            resolve({
                "status": 2,
                "_id": senderID,
                "connect":connectID
            })
        }
        else{
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
                }else{
                    if(res.status == 2){
                        cache.put(res._id,res.connect)
                        cache.put(res.connect,res._id)
                    }
                    resolve(res)
                }
            })
        }
    })
}

module.exports = {
    checkUser
}