var request = require('../request')

function send(senderID, msg, type){
    var r
    switch(type){
        case "text":
            //request 
            r = requests.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_text+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"reply": msg})
            break;
        case "image":
            r = requests.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_image+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"urlImage": msg})   
            break;
        case "audio":
            r = requests.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_audio+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"urlAudio": msg})
            break;
        case "video":
            //request
            break;
    }
    return r.status_code.toString()
}

module.exports = {
    send
}