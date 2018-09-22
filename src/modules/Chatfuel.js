var axios = require('axios')

function send(senderID, msg, type){
    console.log(senderID,msg,type)
    return new Promise((resolve,reject) => {
        switch(type){
            case "text":
                var block_id = process.env.block_text
                break;
            case "image":
                var block_id = process.env.block_image
                break;
            case "audio":
                var block_id = process.env.block_audio
                break;
        }    
        axios
        .post(
            `https://api.chatfuel.com/bots/${
            process.env.BOT_ID
            }/users/${
            senderID
            }/send?chatfuel_token=${
            process.env.chatfuel_token
            }&chatfuel_block_id=${
            block_id
            }&CHATFUEL_MESSAGE_TAG=${
            process.env.CHATFUEL_MESSAGE_TAG
            }`, {
                "reply": msg
            }
        )
        .then(res => resolve(res))
        .catch(err => {
            if (err) reject(err)
        })
    })
}

// var request = require('request')

// function send(senderID, msg, type){
//     switch(type){
//         case "text":
//             //request 
//             var r = request.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_text+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"reply": msg})
//             break;
//         case "image":
//             var r = request.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_image+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"urlImage": msg})   
//             break;
//         case "audio":
//             var r = request.post('https://api.chatfuel.com/bots/'+process.env.BOT_ID+'/users/'+senderID+'/send?chatfuel_token='+process.env.chatfuel_token+'&chatfuel_block_id='+process.env.block_audio+'&CHATFUEL_MESSAGE_TAG='+process.env.CHATFUEL_MESSAGE_TAG, json={"urlAudio": msg})
//             break;
//         case "video":
//             //request
//             break;
//     }
// }

module.exports = {
    send
}