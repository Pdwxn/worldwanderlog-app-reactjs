import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { City } from "../models/City";
import { CitiesContextType } from "../models/CityContextType";

interface CitiesProviderProps {
  children: ReactNode;
}

interface State {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  error: string;
}

interface Action {
  type: string;
  payload?: City[] | City | number | string;
}

const BASE_URL = "https://wonderlog-db.vercel.app";

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

const initialState: State = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload as City[],
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload as City };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload as City],
        currentCity: action.payload as City,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== (action.payload as number)),
        currentCity: null,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }: CitiesProviderProps) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Fetch cities on mount
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(async function (id: number | string) {
    if (currentCity && Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city...",
      });
    }
  }, [currentCity]);

  async function createCity(newCity: City) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      console.error('Error:', error);
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id: number | string) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}


function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
