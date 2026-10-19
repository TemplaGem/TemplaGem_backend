import { userModel } from "../models/user-model.ts";
import { promptModel } from "../models/prompt-model.ts";
import bcrypt from "bcrypt";
import type { IUser } from "../types/user.types.ts";

export class UserService {
  async createUser(userData: IUser): Promise<void> {
    if (!userData.email || !userData.password) {
      throw new Error("Email and password are required to create a user.");
    }
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists.");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUserData = { ...userData, password: hashedPassword };

    const newUser = new userModel(newUserData);
    await newUser.save();
  }

  async deleteUser(email: string): Promise<void> {
    if (!email) {
      throw new Error("Email is required to delete a user.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }

    // Каскадное удаление всех промптов пользователя
    await promptModel.deleteMany({ createdBy: user._id });

    // Удаление пользователя
    await userModel.deleteOne({ _id: user._id });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    if (!email || !newPassword) {
      throw new Error("Email and new password are required to update a user.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await userModel.updateOne(
      { email },
      { password: hashedPassword },
    );
    if (result.matchedCount === 0) {
      throw new Error("User not found.");
    }
  }

  async updateEmail(email: string, newEmail: string): Promise<void> {
    if (!email || !newEmail) {
      throw new Error("Email and new email are required to update a user.");
    }
    const result = await userModel.updateOne({ email }, { email: newEmail });
    if (result.matchedCount === 0) {
      throw new Error("User not found.");
    }
  }

  async findUser(email: string): Promise<IUser | null> {
    return userModel.findOne({ email });
  }

  async getUsers(): Promise<Omit<IUser, "password">[]> {
    return userModel.find({}, "-password");
  }

  async getUserByEmail(email: string): Promise<Omit<IUser, "password">> {
    if (!email) {
      throw new Error("Email is required.");
    }
    const user = await userModel.findOne({ email }, "-password");
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }
}
