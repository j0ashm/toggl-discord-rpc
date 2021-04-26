require('dotenv').config()
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: 'ipc'
});
const axios = require('axios')

const makeRequest = async () => {
    var runningJob = ''
    try {
        await axios.get('https://api.track.toggl.com/api/v8/time_entries/current', {
            auth: {
                username: `${process.env.API_KEY}`,
                password: 'api_token'
            },
            headers: {'Content-Type': 'application/json'},
        }).then((res) => {
            const entries = Object.entries(res.data.data)
            runningJob += entries[5][1]
            console.log(runningJob)
        })
    } catch(error) {
        console.error(error)
    }
    
    return runningJob
}

console.log(makeRequest())