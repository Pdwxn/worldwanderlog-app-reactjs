/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useReducer } from "react";
import { AuthContextType } from "../models/AuthContextType";
import { User } from "../models/User";

interface LoginProps {
  email: string;
  password: string;
}

type AuthAction =
  | { type: 'login'; payload: User }
  | { type: 'logout' };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: { user: User | null; isAuthenticated: boolean } = {
  user: null,
  isAuthenticated: false,
};

function reducer(
  state: typeof initialState,
  action: AuthAction
): typeof initialState {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error('Unknown action');
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login({ email, password }: LoginProps) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
