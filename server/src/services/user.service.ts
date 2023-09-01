import { UserModel } from "../models";

class UserService {
  async createUser(username: string, email: string, password: string) {
    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    return await newUser.save();
  }

  async isUsernameAvailable(username: string) {
    // If a user with the given username exists, it's not available.
    const existingUser = await UserModel.findOne({ username });

    return !existingUser;
  }

  async isEmailAvailable(email: string) {
    // If a user with the given email exists, it's not available.
    const existingUser = await UserModel.findOne({ email });

    return !existingUser;
  }
}

export default new UserService();
