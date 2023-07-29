import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/api";
import { User } from "@/types";

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  refresh: () => void;
};
const UserContext = createContext<UserContextType>({} as UserContextType);

const initialUser = auth.getUser();

type UserProviderProps = {
  children: ReactNode;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);

  const handleRefresh = useCallback(() => {
    return auth.refresh();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    await auth.login(email, password);
    const newUser = auth.getUser();
    setUser(newUser);
    return newUser;
  }, []);

  const handleLogout = useCallback(() => auth.logout(), []);

  const contextValue = useMemo(() => {
    return {
      user,
      login: handleLogin,
      logout: handleLogout,
      refresh: handleRefresh,
    };
  }, [handleLogin, handleLogout, handleRefresh, user]);

  useEffect(() => {
    auth.refresh();
    return auth.authStore.onChange(() => {
      setUser(auth.getUser());
    });
  }, []);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
