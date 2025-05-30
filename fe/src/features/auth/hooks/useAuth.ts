import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/authService";
import { userService } from "../services/userService";
import { User } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchCurrentUser(); // ① API 호출
        if (me) {
          setUser(me);
        } else {
          // fallback: 프로필 API
          const profile = await userService.getMyProfile();
          setUser(profile);
        }
      } catch (e) {
        console.error("사용자 정보 로드 실패", e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
