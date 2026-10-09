import express from "express"
import { bootstrap } from "./src/app.controller.js"
import { Port } from "./config/confog.service.js"
const app = express()

bootstrap(app , express)

app.listen(Port , ()=>{
    console.log(`server is running on 127.0.0.1:${Port}`);
})