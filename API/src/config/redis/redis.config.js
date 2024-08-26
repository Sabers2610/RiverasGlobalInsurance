import {createClient} from 'redis'
import CustomError from '../../utils/exception.util.js'
import config from '../config.js'

export const REDIS_CLIENT = createClient({
    password: config.redisPass,
    socket: {
        host: config.redisUri,
        port: config.redisPort
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