import { useState } from "react";
import "../styles/Card.css";

export default function Card({
  name,
  imageUrl,
  handleFail,
  handleSuccess,
  showClickStatus,
}) {
  const [wasClicked, setWasClicked] = useState(false);

  function handleClick() {
    if (wasClicked === false) {
      setWasClicked(true);
      handleSuccess();
    } else {
      handleFail();
    }
  }

  return (
    <button
      className={`card ${
        showClickStatus === true && wasClicked === true ? "clicked" : ""
      }`}
      onClick={handleClick}
    >
      <div className="image-container">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="name">{name}</div>
    </button>
  );
}
