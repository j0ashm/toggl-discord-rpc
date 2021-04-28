require('dotenv').config()
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: 'ipc'
});
const axios = require('axios')

let lastJob = 'Idle'

rpc.on('ready', () => {
    rpc.setActivity({
        details: 'Idle',
        startTimestamp: new Date(),
        largeImageKey: 'toggl'
    });
})

async function makeRequest() {
    let runningJob = ''
    let duration = ''

    try {
        await axios.get('https://api.track.toggl.com/api/v8/time_entries/current', {
            auth: {
                username: `${process.env.API_KEY}`,
                password: 'api_token'
            },
            headers: {'Content-Type': 'application/json'},
        }).then((res) => {
            if (res.data.data == undefined) {
				runningJob = "Idle";
				duration = new Date();
            } else {
                const entries = Object.entries(res.data.data)
                runningJob = entries[5][1]
                duration = entries[3][1]

                console.log(runningJob)
            }
            
        })
    } catch(error) {
        console.error(error)
    }
    
    return [runningJob, new Date(duration).getTime()]
}

setInterval(async () => {
    let [job, startTimestamp] = await makeRequest()
    
    if (lastJob !== job) {
        rpc.setActivity({
            details: `${job}`,
            startTimestamp: startTimestamp,
            largeImageKey: 'toggl'
        });
        lastJob = job;
    }
}, 1 * 60 * 1000)

rpc.login({
    clientId: '824556435098042369'
});