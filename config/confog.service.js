import path, {resolve} from "node:path"
import dotenv from "dotenv"

const envPath = {
    devPath : `dev.env` ,
    prodPayh : `prod.env`
}

dotenv.config(path.resolve(`./config${envPath.devPath}`))

export const Port = process.env.port
export const DB_URI = process.env.DB_URI 
export const saltRounds = process.env.salt_Rounds
export const ENC_KEY = process.env.ENC_KEY