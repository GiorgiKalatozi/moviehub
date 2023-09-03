/* eslint-disable @typescript-eslint/no-explicit-any */

import UserModel from "../models/user.model";

async function createUser(username: string, email: string, password: string) {
  try {
    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    return await newUser.save();
  } catch (error: any) {
    throw new Error(`User creation failed: ${error.message}`);
  }
}

async function isUsernameAvailable(username: string) {
  try {
    // If a user with the given username exists, it's not available.
    const existingUser = await UserModel.findOne({ username });

    return !existingUser;
  } catch (error: any) {
    throw new Error(
      `Error while checking username availability: ${error.message}`
    );
  }
}

async function isEmailAvailable(email: string) {
  try {
    // If a user with the given email exists, it's not available.
    const existingUser = await UserModel.findOne({ email });

    return !existingUser;
  } catch (error: any) {
    throw new Error(
      `Error while checking email availability: ${error.message}`
    );
  }
}

export const UserService = {
  createUser,
  isUsernameAvailable,
  isEmailAvailable,
};
