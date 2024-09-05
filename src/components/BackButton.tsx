import { MouseEvent } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <Button
      type="back"
      onClick={handleClick}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
  