import mongoose, { InferSchemaType } from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  return this.password === hash;
};

export type User = InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
