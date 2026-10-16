import { Router } from "express";
import { loginWithGmail, signIn, signUp } from "./auth.services.js";

const router = Router()


router.post("/signup" , signUp)
router.post("/signin" , signIn)
router.post("/loginwithgmail" , loginWithGmail)

export default router