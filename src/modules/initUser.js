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

module.exports = {
    checkUser
}