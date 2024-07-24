import dotenv from 'dotenv'
dotenv.config()

export default {
    port: 3000,
    dbUser: process.env.USER_DATABASE,
    dbPass: process.env.PASS_DATABASE,
    dbPort: process.env.PORT_DATABASE,
    dbName: process.env.NAME_DATABASE,
    dbHost: process.env.HOST_DATABASE,
    url_base: process.env.URL_BASE,
    user_gmail: process.env.USER_GMAIL,
    gmail_key: process.env.GMAIL_KEY
}