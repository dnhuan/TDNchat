function sendMsg(senderID, msg, type){
    switch(type){
        case "text":
            //request r = requests.post('https://api.chatfuel.com/bots/'+os.getenv('BOT_ID')+'/users/'+str(senderId)+'/send?chatfuel_token='+os.getenv('CHATFUEL_TOKEN')+'&chatfuel_block_id='+os.getenv('CHATFUEL_BLOCK_TEXT'), json={"repmsg": msg})        
            break;
        case "image":
            //request r = requests.post('https://api.chatfuel.com/bots/'+os.getenv('BOT_ID')+'/users/'+str(senderId)+'/send?chatfuel_token='+os.getenv('CHATFUEL_TOKEN')+'&chatfuel_block_id='+os.getenv('CHATFUEL_BLOCK_IMAGE'), json={"urlImage": msg})   
            break;
        case "audio":
            //request r = requests.post('https://api.chatfuel.com/bots/'+os.getenv('BOT_ID')+'/users/'+str(senderId)+'/send?chatfuel_token='+os.getenv('CHATFUEL_TOKEN')+'&chatfuel_block_id='+os.getenv('CHATFUEL_BLOCK_VOICE'), json={"urlVoice": msg})
            break;
        case "video":
            //request
            break;
    }
    return r.status_code.toString()
}