import { tokenEnum } from "../utils/enums/security.enum.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../utils/response/error.response.js";
import { decodeToken } from "../utils/security/token.js";

export const authentication = (tokenType = tokenEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      throw UnauthorizedException("Unauthorized account");
    }

    const [key, token] = authorization.split(" ");
    if (!key || !token) {
      throw UnauthorizedException("Invalid authorization header");
    }

    const { user, payload } = await decodeToken({
      tokenType,
      token,
    });

    req.user = user;
    req.payload = payload;
    next();
  };
};

export const authorization = (accessRole = []) => {
  return async (req, res, next) => {
    if (!accessRole.includes(req.user.role)) {
      throw ForbiddenException("Forbidden Account");
    }
    next();
  };
};