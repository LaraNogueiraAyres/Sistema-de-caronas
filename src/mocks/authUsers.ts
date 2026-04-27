import { mockUsers } from "./user";
import type { User } from "../types/user";

export type AuthUser = User & {
  password: string; 
};

export const authUsers: AuthUser[] = mockUsers.map((user) => ({
  ...user,
  password: "123456",
}));