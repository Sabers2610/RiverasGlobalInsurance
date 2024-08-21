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
        dialectOptions: {
            connectTimeout: 60000 // Tiempo de espera de conexión en milisegundos
        }
    },
)