const { InfluxDB } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'mytoken'
const org = 'myorg'
const bucket = 'mybucket'

const client = new InfluxDB({ url: 'http://localhost:8086', token: token })

const { Point } = require('@influxdata/influxdb-client')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function logEverySecond() {
    for (let index = 0; index < 1200; index++) {
        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({ app: 'data-generator' })
        let rd = Math.floor(Math.random() * 100) + 1;
        const point = new Point('pulse')
            .floatField('number', rd)
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => {
                console.log('Pulse: ', rd)
            })
            .catch(e => {
                console.error(e)
                console.log('\\nFinished ERROR')
            })

        await sleep(1000)
    }
}

(async () => {
    if (process.argv.length <= 2) {
        console.log('no command specified');
        return;
    }

    if (process.argv[2] === 'auto') {
        console.log('Push to InfluxDB every second (max 20 mins)');
        await logEverySecond();
    } else if (process.argv[2] === 'test') {
        console.log('Just a test command');
    }
})();