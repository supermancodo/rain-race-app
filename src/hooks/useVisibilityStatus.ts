import { useEffect } from "react";
import { User } from "../types";

export const useVisibilityStatus = (
  users: User[],
  nameInput: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUsers((prev: User[]) =>
          prev.map((user) =>
            user.name === nameInput ? { ...user, isOnline: false } : user
          )
        );
      } else {
        setUsers((prev: User[]) =>
          prev.map((user) =>
            user.name === nameInput ? { ...user, isOnline: true } : user
          )
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [nameInput, setUsers]);
};
