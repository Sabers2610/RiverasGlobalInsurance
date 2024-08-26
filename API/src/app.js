import {APP} from './index.js'
import config from './config/config.js'

const PORT = config.port
APP.listen(PORT, () => {
    console.log(`Api running in port ${PORT}`)
})