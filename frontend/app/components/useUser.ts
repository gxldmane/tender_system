import { IUserDetails } from "@/app/http/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

async function fetchUserData(): Promise<IUserDetails> {
  const userData = await Cookies.get('user_data');
  if (!userData) {
    return null;
  }
  return await JSON.parse(userData);
}

function saveUserData(userDetails: IUserDetails): void {
  Cookies.set('user_data', JSON.stringify(userDetails));
}

function invalidateUserData(): void {
  Cookies.remove('user_data');
}

interface UseUserHook {
  isFetching: boolean;
  userDetails: IUserDetails;
  saveUserData: (userDetails: IUserDetails) => void;
  invalidateUserData: () => void;
}

export default function useUser(): UseUserHook {
  const [userDetails, setUserDetails] = useState<IUserDetails>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const details = await fetchUserData();
      setIsLoading(false);
      if (!details) return;
      setUserDetails(details);
    };
    fetchCurrentUser();
  }, []);

  return { userDetails, isFetching: isLoading, saveUserData, invalidateUserData };
};
