import { Router } from "express";
import { signIn, signUp } from "./auth.services.js";

const router = Router()


router.post("/signup" , signUp)
router.post("/signip" , signIn)

export default router