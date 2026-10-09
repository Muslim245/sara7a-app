import { create, findOne } from "../../DB/db.repositroy.js"
import userModel from "../../DB/Models/user.model.js"
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../utils/response/error.response.js"
import sucessResponse from "../../utils/response/sucess.response.js"
import { decrypt, encrypt } from "../../utils/security/encrypt.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"

export const signUp = async (req , res)=>{
    const {email} = req.body

    const existingEmail  = await findOne({model : userModel , filter : {email}})
    if (existingEmail) {
        ConflictException({message : "user is already exisit"})
    }
    const hashPassowrd = await generateHash(req.body.password)
    const encryptPhone = encrypt(req.body.phone)
    const user = await create({model : userModel , data : {...req.body , password : hashPassowrd , phone : encryptPhone}})
    if (!user) {
        BadRequestException({message : "user is not created"})
    }

    return sucessResponse({res , message : "user is created" , data : user })
    
}

export const signIn = async (req , res)=>{
   const {email , password} = req.body 
   const user = await findOne({model : userModel , filter : {email }})
   if (!user) {
   throw NotFoundException({message : "user is not found"})
   }
   const hashresult = await compareHash(password , user.password)
   if (!hashresult) {
       throw UnauthorizedException({message : "password is not correct"})
    }
    const userData = user.toObject();
    userData.phone = decrypt(user.phone)
   return sucessResponse({res , data : userData })

}