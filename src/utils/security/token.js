import {
  Access_Admin_Token_signature,
  Access_user_Token_signature,
  Expisers_IN_Access_Token,
  Expisers_IN_Refresh_Token,
  Refresh_Admin_Token_signature,
  Refresh_user_Token_signature,
} from "../../../config/confog.service.js";
import jwt from "jsonwebtoken";
import { RoleEnum } from "../enums/user.enum.js";
import { tokenEnum } from "../enums/security.enum.js";
import {
  BadRequestException,
  NotFoundException,
} from "../response/error.response.js";
import { findById } from "../../DB/db.repositroy.js";
import userModel from "../../DB/Models/user.model.js";

export const generateToken = (
  payload = {},
  secretKey = Access_user_Token_signature,
  options = {}
) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = (
  token = "",
  secretKey = Access_user_Token_signature
) => {
  return jwt.verify(token, secretKey);
};

export const getTokenSignature = async ({ role = RoleEnum.USER } = {}) => {
  let signature = {};
  switch (role) {
    case RoleEnum.ADMIN:
      signature = {
        accessSignature: Access_Admin_Token_signature,
        refreshSignature: Refresh_Admin_Token_signature,
      };
      break;
    default:
      signature = {
        accessSignature: Access_user_Token_signature,
        refreshSignature: Refresh_user_Token_signature,
      };
      break;
  }
  return signature;
};

export const getSignature = async ({
  typeToken = tokenEnum.Access,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignature({ role });
  return typeToken === tokenEnum.Access
    ? signatures.accessSignature
    : signatures.refreshSignature;
};

export const decodeToken = async ({
  token = "",
  tokenType = tokenEnum.Access,
} = {}) => {
  const decode = jwt.decode(token);

  if (!decode || decode.aud?.[0] === undefined || decode.aud?.[0] === null) {
    throw BadRequestException({ message: "Invalid token" });
}

  const payload = verifyToken(
    token,
    await getSignature({
      typeToken: tokenType,
      role: decode.aud[0],
    })
  );

  console.log("payload", payload);
  if (!payload.sub) {
    throw BadRequestException({ message: "missing token payload" });
  }

  const user = await findById({
    model: userModel,
    id: payload.sub,
  });

  if (!user) {
    throw NotFoundException({ message: "invalid User" });
  }

  return { user, payload };
};

export const createLoginCredentials = async ({ user, options = {} } = {}) => {
  if (!user) {
    throw new Error("createLoginCredentials: user is required");
  }

  const role = user.role || RoleEnum.USER;

  const { accessSignature, refreshSignature } = await getTokenSignature({ role });

  const accessToken = generateToken({ sub: user._id }, accessSignature, {
    ...options,
    audience: [role],
    expiresIn: Expisers_IN_Access_Token,
  });

  const refreshToken = generateToken({ sub: user._id }, refreshSignature, {
    ...options,
    audience: [role],
    expiresIn: Expisers_IN_Refresh_Token,
  });

  return { accessToken, refreshToken };
};