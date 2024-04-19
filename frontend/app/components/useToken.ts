import Cookies from "js-cookie";
import { useEffect, useState } from "react";

async function fetchAuthToken(): Promise<string> {
  const authToken = Cookies.get('auth_token');
  if (!authToken) {
    return null;
  }
  return await authToken;
}

function saveAuthToken(authToken: string): void {
  Cookies.set('auth_token', authToken);
}

function invalidateToken(): void {
  Cookies.remove('auth_token');
}

interface UseTokenHook {
  isFetching: boolean;
  authToken: string;
  saveAuthToken: (authToken: string) => void;
  invalidateToken: () => void;
}

export default function useToken(): UseTokenHook {
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAuthToken();
      setIsLoading(false);
      if (!token) return;
      setToken(token);
    };
    fetchToken();
  }, []);
  return { authToken: token, isFetching: isLoading, saveAuthToken, invalidateToken };
};
