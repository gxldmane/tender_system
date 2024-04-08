import { useEffect, useState } from "react";
import { IUserDetails } from "@/app/http/types";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

// We are using cookies for a persistent storage, while react-query cache is used as a session storage.
// Could be done better tho.
export default function useUser(): { userDetails: IUserDetails | null, isLoading: boolean } {
  const [user, setUser] = useState<IUserDetails | null>(undefined);
  const queryClient = useQueryClient();
  useEffect(() => {
    let userData = queryClient.getQueryData<IUserDetails>(["user_data"]);
    if (!userData) {
      const data = Cookies.get("user_data");
      userData = data ? JSON.parse(data) : null;
      queryClient.setQueryData(["user_data"], userData);
    }
    setUser(userData);
  }, []);
  return { userDetails: user, isLoading: user === undefined };
};
