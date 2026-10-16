import { Router } from "express";
import { refrshToken } from "./user.services.js";
import { authentication } from "../../middelware/middelware.auth.js";
import { tokenEnum } from "../../utils/enums/security.enum.js";
const router = Router()

router.post("/refresh-token",authentication({tokenType: tokenEnum.Refresh}), refrshToken);

export default router