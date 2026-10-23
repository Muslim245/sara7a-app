import { EventEmitter } from "node:events";
import { sendEmail } from "../email/nodemailer.email.js";
import { emailSubject } from "../enums/email.enum.js";
import { template } from "../Html/templeteHtml.js";
export const eventEmit = new EventEmitter
eventEmit.on("confirmEmail" ,async (data)=>{
    console.log(data);
    
await sendEmail({
    to : data.to ,
    subject : emailSubject.confirmEmail ,
html: template(data.otp,data.firstName,emailSubject.confirmEmail)
}).catch((err)=>{
    console.log(`error to send email ${err} `);
}) 
})

eventEmit.on("forgetPassword" ,async (data)=>{
await sendEmail({
    to : data.to ,
    subject : emailSubject.resetPassword ,
html: template(data.otp,data.firstName,emailSubject.resetPassword)
}).catch((err)=>{
    console.log(`error to send otp ${err} `);
}) 
})