import type { User } from "../types/user";

export function getCurrentUser(): User | null {
  const data = localStorage.getItem("currentUser");

  if (!data) return null;

  return JSON.parse(data);
}

export function logout() {
  localStorage.removeItem("currentUser");
}