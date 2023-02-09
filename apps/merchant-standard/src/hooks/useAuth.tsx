import { User } from "@bloom-trade/types";
import { authService } from "../services/auth.services";

export default function useAuth() {
  function getUserLoggedIn() {
    const _user: User = {
      userid: "undefined",
      displayName: "undefined by Alex",
      email: "undefined",
    };

    return _user;
  }

  return {
    getUserLoggedIn,
  };
}
