var axios = require('axios')
var url = require('url')

function send(senderID, msg, type){
    console.log(senderID,msg)
    return new Promise((resolve,reject) => {
        console.time('axios')
        switch(msgType(msg)){
            case "text":
                var payload = {
                    "sender":senderID,
                    "reply": msg
                }
                break;
            case "image":
                var payload = {
                    "sender":senderID,
                    "imageURL": msg
                }
                break;
            case "audio":
                var payload = {
                    "sender":senderID,
                    "audioURL": msg
                }
                break;
            case "invalid":
                var payload = {
                    "sender":senderID,
                    "reply": "Hệ thống không cho phép đối phương gửi ảnh"
                }
                break;
        }
        var baseUrl = "http://localhost:712/GoAxios"
        axios
        .post(
            baseUrl, payload
        )
        .then(res => {
            console.timeEnd('axios')
            console.timeEnd(global.all)
            resolve(true)
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