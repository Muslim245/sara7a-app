import { create, findOne, findOneAndUpdate } from "../../DB/db.repositroy.js"
import userModel from "../../DB/Models/user.model.js"
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../utils/response/error.response.js"
import sucessResponse from "../../utils/response/sucess.response.js"
import { decrypt, encrypt } from "../../utils/security/encrypt.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"
import { OAuth2Client } from 'google-auth-library';
import { createLoginCredentials } from "../../utils/security/token.js"
import { generateOTP } from "../../utils/generateOtp/generateOtp.js"
import { eventEmit } from "../../utils/events/sendemail.event.js"
import { HashEnum } from "../../utils/enums/security.enum.js"
import { ProviderEnum } from "../../utils/enums/user.enum.js"
export const signUp = async (req , res)=>{
    const {email} = req.body
    const otp =  generateOTP()
    const existingEmail  = await findOne({model : userModel , filter : {email}})
    if (existingEmail) {
        ConflictException({message : "user is already exisit"})
    }
    const hashPassowrd = await generateHash(req.body.password)
    const encryptPhone = encrypt(req.body.phone)
    const confirmEmailOtp = await generateHash(otp.toString(),HashEnum.Argon2)
    const user = await create({model : userModel , data : {...req.body , password : hashPassowrd , phone : encryptPhone , confirmEmailOtp : confirmEmailOtp}})
    if (!user) {
        BadRequestException({message : "user is not created"})
    }
    eventEmit.emit("confirmEmail",{to : email , firstName :user.fName , otp})
    return sucessResponse({res , message : "user is created" , data : user })
    
}

export const signIn = async (req , res)=>{
   const {email , password} = req.body 
   const user = await findOne({model : userModel , filter : {email , confirmEmail : {$exists : true} }})
   if (!user) {
   throw NotFoundException({message : "user is not found"})
   }
   const hashresult = await compareHash(password , user.password)
   if (!hashresult) {
       throw UnauthorizedException({message : "password is not correct"})
    }
    const userData = user.toObject();
    userData.phone = decrypt(user.phone)
    const tokens = await createLoginCredentials({user})
   return sucessResponse({res , data : tokens })

}

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}
export const loginWithGmail = async (req, res) => {
  const { idToken } = req.body;

  const { email, picture, given_name, family_name, email_verified } = await verifyGoogleAccount({ idToken });

  if (!email_verified) {
    throw BadRequestException({ message: "Email not verified" });
  }

  const user = await dbService.findOne({ model: UserModel, filter: { email } });

  if (user) {
    if (user.provider === ProviderEnum.GOOGLE) {
      const tokens = await getNewLoginCredentials(user);
      sucessResponse({ res, message: "Done", data: { tokens } });
    }
  } else {
    const newUser = await dbService.create({
      model: userModel,
      data: [{
        firstName: given_name,
        lastName: family_name,
        email,
        profilePic: picture,
        provider: ProviderEnum.GOOGLE
      }]
    });
    const tokens = await getNewLoginCredentials(newUser);
    sucessResponse({ res, message: "Done", statusCode: 201, data: { tokens } });
  }
};

export const confirmEmail = async (req , res)=>{
const {email ,  otp} = req.body
const user = await findOne({model : userModel , filter : {email , confirmEmailOtp : {$exists : true} }})
if (!user) throw BadRequestException({message : "invaild email"})

const isOtpValid = await compareHash(otp , user.confirmEmailOtp)
if (!isOtpValid) throw BadRequestException({message : "invaild otp"})
await findOneAndUpdate({model : userModel , filter : {email} , update : {
  $unset:{
    confirmEmailOtp : true
  } ,
  $set : {
    confirmEmail:Date.now()
  }
}})
await sucessResponse({res , message : "otp is valid"})
}

export const forgetPassword = async (req , res)=>{
const {email} = req.body
const user = await findOne({model : userModel , filter : {email , provider : ProviderEnum.SYSTEM , confirmEmail : {$exists : true}}})
if(!user) throw BadRequestException({message : "invaild email"})
const otp = generateOTP()
const hashOtp = await generateHash(otp.toString())
await findOneAndUpdate({model : userModel , filter : {
  email ,
  provider : ProviderEnum.SYSTEM,
  confirmEmail : {$exists : true} },
  update : {$set : {forgetPasswordOtp : hashOtp}} }) 
eventEmit.emit("forgetPassword" , {to : email , otp : otp , firstName : user.fName })
await sucessResponse({res , message : "check your gmail "})

}

export const resetPassword = async (req , res)=>{
const {email , otp , newPassword} = req.body
const user = await findOne({model : userModel , filter : {email ,
provider : ProviderEnum.SYSTEM ,
confirmEmail : {$exists : true} ,
forgetPasswordOtp : {$exists : true}
}})
if(!user) throw BadRequestException({message : "invalid Email"})
const isOtpVaild = await compareHash(otp , user.forgetPasswordOtp)
if (!isOtpVaild) throw BadRequestException({message : "invalid otp"})
const hashNewPassword = await generateHash(newPassword)
await findOneAndUpdate({model : userModel , filter : {email ,
provider : ProviderEnum.SYSTEM ,
confirmEmail : {$exists : true} ,
forgetPasswordOtp : {$exists : true}} ,
update : {$unset : {forgetPasswordOtp : true} , 
 $set: {password : hashNewPassword}},

})
await sucessResponse({res,message : "password is changed sucessfully "})
}
