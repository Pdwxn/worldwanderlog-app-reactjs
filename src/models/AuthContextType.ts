import { User } from "./User";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: ({ email, password }: { email: string, password: string }) => void;
    logout: () => void;
  }