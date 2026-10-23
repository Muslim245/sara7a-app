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
export const Access_user_Token_signature = process.env.Access_user_Token_signature
export const Refresh_user_Token_signature = process.env.Refresh_user_Token_signature
export const Access_Admin_Token_signature = process.env.Access_Admin_Token_signature
export const Refresh_Admin_Token_signature = process.env.Refresh_Admin_Token_signature
export const Expisers_IN_Access_Token = process.env.Expisers_IN_Access_Token
export const Expisers_IN_Refresh_Token = process.env.Expisers_IN_Refresh_Token
export const user_Email = process.env.user_Email
export const user_Password = process.env.user_Password