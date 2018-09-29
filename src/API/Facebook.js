var axios = require('axios')
require('dotenv').config()


function getUserProfile(psid){
    return new Promise((resolve,reject)=>{
        console.log("start")
        axios.get(
            `https://graph.facebook.com/v2.6/${psid}?access_token=${PAGE_ACCESS_TOKEN}`
        )
        .then(res=>{resolve(res)})
        .catch(err=>{reject(err)})
    })
}

getUserProfile(process.env.testUser)
    .then(res=>{console.log(res)})
    .catch(err=>{console.error(err)})