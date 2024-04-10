import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

function fetchAuthToken(): string {
  return JSON.parse(Cookies.get('auth_token')) || null;
}

function saveAuthToken(authToken: string): void {
  Cookies.set('auth_token', JSON.stringify(authToken));
}

interface UseTokenHook {
  isFetching: boolean;
  authToken: string;
  saveAuthToken: (authToken: string) => void;
}

export default function useToken(): UseTokenHook {
  const { data: authToken, isFetching } = useQuery<string>({
    queryKey: ['auth_token'],
    queryFn: fetchAuthToken,

  });
  return { authToken, isFetching, saveAuthToken };
};
