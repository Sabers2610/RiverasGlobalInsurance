import { Sequelize } from 'sequelize'
import config from '../config.js'

export const SEQUELIZE = new Sequelize(
    config.dbName, 
    config.dbUser, 
    config.dbPass, 
    {
        host: config.dbHost,
        port: config.dbPort,
        dialect: "mysql",
    }
)