import { UserModel } from "../models";

class UserService {
  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<any> {
    const newUser = await UserModel.create({
      username,
      email,
      password: password,
    });

    await newUser.save();
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const existingUser = await UserModel.findOne({ username });

    // If a user with the given username exists, it's not available.
    return !existingUser;
  }

  async checkEmailAvailability(email: string): Promise<void> {
    // Implement email availability check logic here
  }
}

export default new UserService();
