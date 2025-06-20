import Card from "./Card.jsx";
import "../styles/Game.css";
import { useState } from "react";

export default function Game({
  initialPokemonsInfo,
  trainingMode,
  incrementScore,
  reset,
}) {
  const [pokemonsInfo, setPokemonsInfo] = useState(initialPokemonsInfo);

  function handleFail() {
    reset("Game Over! You've selected the same card twice.");
  }

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
    <>
      <div className="message">
        Click each tile once to win the game. After every click, the tiles will
        shuffle to test your memory.
      </div>
      <div className="game">
        {pokemonsInfo.map((p) => (
          <Card
            name={p.name}
            imageUrl={p.imageUrl}
            key={p.id}
            handleFail={handleFail}
            handleSuccess={handleSuccess}
            showClickStatus={trainingMode}
          />
        ))}
      </div>
    </>
  );
}
