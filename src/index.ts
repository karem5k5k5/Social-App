import { log } from "console"
import express from "express"
import { bootstrap } from "./app.controller"
import { config } from "dotenv"
import { devConfig } from "./config/env/dev.config"
import { initSocket } from "./socket.io"

// env config
config()
// initiate express app
const app = express()
const port = devConfig.PORT || 3000

bootstrap(app, express)

const server = app.listen(port, () => {
    log("server is running on port:", port)
})

// initiate socket.io server
initSocket(server)