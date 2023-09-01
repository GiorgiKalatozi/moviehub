import { UserModel } from "../models";

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
  // If a user with the given username exists, it's not available.
  const existingUser = await UserModel.findOne({ username });

  return !existingUser;
}

async function isEmailAvailable(email: string) {
  // If a user with the given email exists, it's not available.
  const existingUser = await UserModel.findOne({ email });

  return !existingUser;
}

export const UserService = {
  createUser,
  isUsernameAvailable,
  isEmailAvailable,
};
