import Card from "./Card.jsx";
import "../styles/Game.css";

export default function Game({ pokemonsInfo, incrementScore }) {
  function handleFail() {}

  function handleSuccess() {
    incrementScore();
  }

  return (
    <div className="game">
      {pokemonsInfo.map((p) => (
        <Card
          name={p.name}
          imageUrl={p.imageUrl}
          key={p.id}
          handleFail={handleFail}
          handleSuccess={handleSuccess}
        />
      ))}
    </div>
  );
}
