import { City } from "./City";

export interface CitiesContextType {
    cities: City[];
    isLoading: boolean;
    currentCity: City | null;
    error: string;
    getCity: (id: number | string) => Promise<void>;
    createCity: (newCity: City) => Promise<void>;
    deleteCity: (id: number | string) => Promise<void>;
  }