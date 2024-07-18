import dotenv from 'dotenv'
dotenv.config()

export default {
    port: 3000,
    dbUser: process.env.USER_DATABASE,
    dbPass: process.env.PASS_DATABASE,
    dbPort: process.env.PORT_DATABASE,
    dbName: process.env.NAME_DATABASE,
    dbHost: process.env.HOST_DATABASE,
    redisconfig: process.env.REDIS,
}