import { compare, hash } from "bcrypt";
import {HashEnum} from "../enums/security.enum.js"
import  argon2  from "argon2";
import { BadRequestException } from "../response/error.response.js";
import { saltRounds } from "../../../config/confog.service.js";
export const generateHash = async (plainText , saltRound = Number(saltRounds) , algorithm = HashEnum.Bcrypt )=>{
let hashResult = ""
switch (algorithm) {
    case HashEnum.Bcrypt:
        hashResult = await hash(plainText , saltRound)
        break;
    case HashEnum.Argon2 :
         hashResult = await argon2.hash(plainText)
         break;
    default: throw BadRequestException({message : "unsupported hashing algorithm"})
}
return hashResult
} 

export const compareHash = async (plainText , cipherText , algorithm = HashEnum.Bcrypt)=>{
    let match = ""

    switch (algorithm) {
        case HashEnum.Bcrypt:
        match = await compare(plainText , cipherText)
            break;
        case HashEnum.Argon2:
        match = await argon2.verify(cipherText , plainText)
        break;
        default:
        throw BadRequestException({message : "unsupported hashing algorithm"})
    }
    return match
}