var axios = require('axios')
var url = require('url')

function send(senderID, msg, type){
    console.log(senderID,msg)
    return new Promise((resolve,reject) => {
        console.time('axios')
        switch(msgType(msg)){
            case "text":
                var block_id = process.env.block_text
                var payload = {
                    "reply": msg
                }
                break;
            case "image":
                var block_id = process.env.block_image
                var payload = {
                    "imageURL": msg
                }
                break;
            case "audio":
                var block_id = process.env.block_audio
                var payload = {
                    "audioURL": msg
                }
                break;
            case "invalid":
                var block_id = process.env.block_text
                var payload = {
                    "reply": "Hệ thống không cho phép đối phương gửi ảnh"
                }
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
            }`, payload
        )
        .then(res => {
            console.timeEnd('axios')
            console.timeEnd(global.all)
            resolve(res)
        })
        .catch(err => {
            console.timeEnd('axios')
            console.timeEnd(global.all)
            reject(err)
        })
    })
}

function msgType(msg){
    const urlparse = url.parse(msg);
    if (urlparse.protocol !== 'https:') return "text"
    if (urlparse.hostname.includes("fbcdn.net") || urlparse.hostname.includes("fbsbx.com") ){
        if( urlparse.pathname.endsWith(".png") || urlparse.pathname.endsWith(".jpg") || urlparse.pathname.endsWith(".jpeg") || urlparse.pathname.endsWith(".gif") ){
            if( urlparse.pathname.includes("p100x100") ) return "image"
            else return "invalid"
        }
        if( urlparse.pathname.endsWith(".mp4") || urlparse.pathname.endsWith(".acc") ) return "audio"
    }
    else return "text"
}

module.exports = {
    send
}