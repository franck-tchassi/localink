// types/auth.ts

import { User } from "@prisma/client";

export type RegisterResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type LoginResult =
  | { user: UserSafe; error: null }
  | { user: null; error: string; requiresOtp?: boolean };

export type UserSafe = Omit<User, "passwordHash">;
