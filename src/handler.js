var Chatfuel = require('./modules/Chatfuel')
var queryUser = require('./modules/queryUser')
var initUser = require('./modules/initUser')

async function handle(name, senderID, msg, gender){
    console.log("Start handler:",name,senderID)
    //check db
    var query = await initUser.checkUser(name,senderID,gender).then(obj=>{return obj}).catch((err)=>{console.error(err)})
    //status 0-free, 1-pending, 2-paired
    if(query.status == 0){
        if(msg.toLowerCase() == "bắt đầu"){
            queryUser.checkQueue(query._id).then(()=>{}).catch(err=>{console.error(err)})
        }else{
            Chatfuel.send(query._id,'Hãy gửi cú pháp "bắt đầu" để trò chuyện',"text").then(()=>{}).catch(err => {console.error(err)})
        }
    }
    if(query.status == 1) Chatfuel.send(query._id,"Đang tìm kiếm, bạn hãy chờ tí nhé!","text").then(()=>{}).catch(err => {console.error(err)})
    if(query.status == 2){
        if(msg.toLowerCase() == "exit"){
                queryUser.unpair(query).then(()=>{}).catch(err=>{console.error(err)})
        }else{
            //forward msg
            Chatfuel.send(query.connect,msg,"text").then(()=>{}).catch(err => {console.error(err)})
        }
    }
}

module.exports = {
    handle
}