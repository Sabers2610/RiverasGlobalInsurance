import {createClient} from 'redis'
import CustomError from '../../utils/exception.util.js'

export const REDIS_CLIENT = createClient({
    password: 'MyozHr20Bb5wlcAOvWzYMFUCwJ85eJPf',
    socket: {
        host: 'redis-13651.c16.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 13651
    }
});

async function connectionRedis() {
    await REDIS_CLIENT.connect()

    REDIS_CLIENT.on("error", (err) => {
        console.log("Paso esto")
        throw new CustomError(err, 500, "API_REDIS_ERROR")
    })
}

await connectionRedis();