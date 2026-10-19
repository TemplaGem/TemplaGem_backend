import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  registeredAt: Date;
  prompts?: Array<Types.ObjectId>;
  rating: number;
}

export interface CreateUserBody {
  email: string;
  password: string;
}

export interface UpdateEmailBody {
  newEmail: string;
}

export interface UpdatePasswordBody {
  newPassword: string;
}

export interface UserParams {
  email: string;
}

export interface Payload extends JwtPayload {
  email: string;
  userId?: string;
}
