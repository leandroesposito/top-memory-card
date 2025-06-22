import Card from "./Card.jsx";
import "../styles/Game.css";
import { useState } from "react";

export default function Game({
  initialItemsInfo,
  trainingMode,
  incrementScore,
  reset,
}) {
  const [itemsInfo, setItemsInfo] = useState(initialItemsInfo);

  function handleFail() {
    reset("Game Over! You've selected the same card twice.");
  }

  function handleSuccess() {
    incrementScore();
    shufflePokemons();
  }

  function shufflePokemons() {
    const newOrder = [...itemsInfo];
    const count = newOrder.length;

    for (let i = 0; i < count; i++) {
      const j = Math.floor(Math.random() * count);
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }

    setItemsInfo(newOrder);
  }

  return (
    <>
      <div className="message">
        Click each tile once to win the game. After every click, the tiles will
        shuffle to test your memory.
      </div>
      <div className="game">
        {itemsInfo.map((i) => (
          <Card
            name={i.name}
            imageUrl={i.imageUrl}
            key={i.id}
            handleFail={handleFail}
            handleSuccess={handleSuccess}
            showClickStatus={trainingMode}
          />
        ))}
      </div>
    </>
  );
}
