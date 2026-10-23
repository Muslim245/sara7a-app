import { Router } from "express";
import { refrshToken, uploadFile } from "./user.services.js";
import { authentication } from "../../middelware/middelware.auth.js";
import { tokenEnum } from "../../utils/enums/security.enum.js";
import { loclaFileUpload } from "../../utils/multer/local.multer.js";
const router = Router()

router.post("/refresh-token",authentication({tokenType: tokenEnum.Refresh}), refrshToken);
router.patch("/uploadFile" , loclaFileUpload().single("attachments") ,uploadFile)

export default router