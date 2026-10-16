import sucessResponse from "../../utils/response/sucess.response.js";
import { createLoginCredentials } from "../../utils/security/token.js";

export const refrshToken = async (req, res, next) => {

  const tokens = await createLoginCredentials({ user: req.user });

  sucessResponse({
    res,
    statusCode: 200,
    message: "Token rotated successfully",
    data: tokens,
  });
};