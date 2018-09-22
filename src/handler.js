var Chatfuel = require('./modules/Chatfuel')
var queryUser = require('./modules/queryUser')

async function handle(name, senderID, msg, gender){
    console.log("Start handler:",name,senderID)
    //check db
    var query = await queryUser.checkUser(name,senderID,gender).then((obj)=>{return obj}).catch((err)=>{console.error(err)})
    //status 0-free, 1-pending, 2-paired
    if(query.status == 0){
        if(msg.toLowerCase() == "bắt đầu"){
            queryUser.checkQueue(query._id).then(()=>{}).catch(err=>{throw err})
        }else{
            //nhắn linh tinh
        }
    }
    if(query.status == 1) Chatfuel.send(query._id,"Đang tìm kiếm, bạn hãy chờ tí nhé!","text")
    //var prompt = false
    if(query.status == 2){
        if(msg.toLowerCase() == "exit"){
                queryUser.unpair(query).then(()=>{prompt = false}).catch(err=>{throw err})
        }else{
            prompt = false
            //forward msg
            Chatfuel.send(query.connect,msg,"text")
        }
    }
}

module.exports = {
    handle
}