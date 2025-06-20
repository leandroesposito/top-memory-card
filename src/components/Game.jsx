import Card from "./Card.jsx";
import "../styles/Game.css";
import { useState } from "react";

export default function Game({ initialPokemonsInfo, incrementScore }) {
  const [pokemonsInfo, setPokemonsInfo] = useState(initialPokemonsInfo);

  function handleFail() {}

  function handleSuccess() {
    incrementScore();
    shufflePokemons();
  }

  function shufflePokemons() {
    const newOrder = [...pokemonsInfo];
    const count = newOrder.length;

    for (let i = 0; i < count; i++) {
      const j = Math.floor(Math.random() * count);
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }

    setPokemonsInfo(newOrder);
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
