import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
      minLegth: 3,
      maxLength: 20,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
      minLegth: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLegth: 3,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    provider: {
        type: String,
        enum: Object.values(ProviderEnum),
        default:  ProviderEnum.SYSTEM,
    },
    Role : {
        type : String ,
        enum : Object.values(RoleEnum),
        default : RoleEnum.ADMIN
    },
    confirmEmail : Date ,
    confirmEmailOtp : String ,
    profielImage: String,
    forgetPasswordOtp : String
  },
 {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 
const userModel = mongoose.models.User || mongoose.model("User",userSchema)
export default userModel