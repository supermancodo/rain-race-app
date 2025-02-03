import { useEffect } from "react";
import { User } from "../types";

export const useLocalStorage = (
  key: string,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  useEffect(() => {
    const storedUsers = localStorage.getItem(key);
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Error parsing stored users:", error);
      }
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(users));
  }, [key, users]);
};
