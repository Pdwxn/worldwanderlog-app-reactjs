import { Position } from "./WorldPosition";

export interface City {
    cityName: string;
    country: string;
    emoji: string;
    date: Date | string;
    notes?: string;
    position: Position;
    id?: number | string;
}

export interface Country {
    country: string;
    emoji: string
}