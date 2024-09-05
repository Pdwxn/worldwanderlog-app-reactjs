import { Link } from "react-router-dom";
import { MouseEvent } from "react";
import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { City } from "../models/City";

interface Props {
  city: City;
}

const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }: Props) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (id !== undefined) {
      deleteCity(id);
    } else {
      console.error("City ID is undefined");
    }
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity && id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
