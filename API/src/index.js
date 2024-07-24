import express from 'express'
import morgan from 'morgan'
import { syncTables } from "./utils/syncDatabase.util.js"
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { ROUTER } from './routes/user.route.js';
await syncTables(); // sincronizamos la base de datos con los modelos de ./src/models/...


const APP = express()
APP.use(morgan("tiny"))
APP.use(express.json())
APP.use(cookieParser())
APP.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}))

APP.get("/", (req, res) => {
    return res.send("<h1>Api Running!</h1>")
})
APP.use((err, req, res, next) => {
    console.error(err.stack);
    if (APP.get('env') === 'development') {
        res.status(500).send({ error: err.message, stack: err.stack });
    } else {
        res.status(500).send('Something broke!');
    }
});

// definir rutas de cada endpoint debajo
APP.use("/api/v1/", ROUTER)


const PORT = config.port
APP.listen(PORT, () => {
    console.log(`Api running in port ${PORT}`)
})
