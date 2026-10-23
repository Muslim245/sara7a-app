import nodemailer from "nodemailer"
import { user_Email, user_Password } from "../../../config/confog.service.js";
export const sendEmail = async ({to = "",subject = "" , text = "" , html = "" , cc = "" , bcc = "" , attachments = [] })=>{

const transporter = nodemailer.createTransport({
  service : "gmail" ,
  auth: {
    user: user_Email,
    pass: user_Password,
  },
});
try {
  const info = await transporter.sendMail({
    from: `"Route Team" <${user_Email}>`,
    to, 
    subject, 
    text, 
    html, 
    cc ,
    bcc , 
    attachments 
  });
  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}

}