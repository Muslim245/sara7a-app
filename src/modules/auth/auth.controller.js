import { Router } from "express";
import { confirmEmail, forgetPassword, loginWithGmail, resetPassword, signIn, signUp } from "./auth.services.js";

const router = Router()


router.post("/signup" , signUp)
router.post("/signin" , signIn)
router.post("/loginwithgmail" , loginWithGmail)
router.patch("/confirmEmail" , confirmEmail)
router.patch("/forgetPassword" , forgetPassword)
router.patch("/resetPassword" , resetPassword)

export default router