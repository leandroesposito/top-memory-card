import { useState } from "react";

export default function Card({ name, imageUrl, handleFail, handleSuccess }) {
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
    <div className="card" onClick={handleClick}>
      <div className="imageContainer">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="name">{name}</div>
    </div>
  );
}
