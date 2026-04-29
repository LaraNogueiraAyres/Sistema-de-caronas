import type { User } from "../types/user";

export function getCurrentUser(): User | null {
  const data = localStorage.getItem("currentUser");

  if (!data) return null;

  return JSON.parse(data);
}

export function saveCurrentUser(user: User) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function updateCurrentUser(changes: Partial<User>): User | null {
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const updatedUser = {
    ...currentUser,
    ...changes,
  };

  saveCurrentUser(updatedUser);

  return updatedUser;
}

export function logout() {
  localStorage.removeItem("currentUser");
}
