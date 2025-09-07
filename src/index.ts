import { log } from "console"
import express from "express"
import { bootstrap } from "./app.controller"
import { config } from "dotenv"

// env config
config({path:"./config/.env"})
// initiate express app
const app = express()
const port = 3000

bootstrap(app, express)

app.listen(port, () => {
    log("server is running on port:", port)
})