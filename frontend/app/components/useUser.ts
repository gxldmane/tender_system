import { IUserDetails } from "@/app/http/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

function fetchUserData(): IUserDetails {
  return JSON.parse(Cookies.get('user_data')) || null;
}

function saveUserData(userDetails: IUserDetails): void {
  Cookies.set('user_data', JSON.stringify(userDetails));
}

interface UseUserHook {
  isFetching: boolean;
  userDetails: IUserDetails;
  saveUserData: (userDetails: IUserDetails) => void;
}

export default function useUser(): UseUserHook {
  const { data: userDetails, isFetching } = useQuery<IUserDetails>({
    queryKey: ['user_data'],
    queryFn: fetchUserData,
  });
  return { userDetails, isFetching, saveUserData };
};
