import { useEffect, useState, useRef } from "react";
import "./App.css";
import Form from "./components/Form.jsx";
import Header from "./components/Header.jsx";
import ScoreViewer from "./components/ScoreViewer.jsx";
import Game from "./components/Game.jsx";

const gameSizes = [4, 6, 8, 10, 12, 14];
const pageSize = gameSizes[gameSizes.length - 1];

const namesApi = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const ignoreFetch = useRef(false);
  const [pokemonsInfo, setPokemonsInfo] = useState([]);
  const [gameItems, setGameItems] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      let pokemonCount = await fetch(namesApi)
        .then((res) => res.json())
        .then((json) => json.count);
      let offset = Math.floor(Math.random() * pokemonCount) - pageSize;

      const pokemonsApi = `https://pokeapi.co/api/v2/pokemon/?limit=${pageSize}&offset=${offset}`;

      let pokemonsList = await fetch(pokemonsApi)
        .then((res) => res.json())
        .then((json) => json.results);

      const info = await Promise.all(
        pokemonsList.map((p) => fetch(p.url).then((res) => res.json()))
      );

      setPokemonsInfo(
        info.map((item) => {
          return {
            name: item.name,
            imageUrl: item.sprites.other["official-artwork"].front_default,
            id: item.id,
          };
        })
      );
    }

    if (!ignoreFetch.current) {
      ignoreFetch.current = true;
      fetchData();
    }
  }, []);

  function handleSubmit(event) {
    const form = event.target.closest("form");
    const formData = new FormData(form);
    const gameSize = parseInt(formData.get("game-size"));

    setCurrentScore(0);
    initGame(gameSize);
    setMessage("");
  }

  function initGame(gameSize) {
    const startIndex = Math.floor(
      Math.random() * (pokemonsInfo.length - gameSize)
    );

    const newGameItems = pokemonsInfo.slice(startIndex, startIndex + gameSize);

    setGameItems(newGameItems);
  }

  function incrementScore() {
    const newCurrenScore = currentScore + 1;
    if (newCurrenScore > bestScore) {
      setBestScore(newCurrenScore);
    }

    if (newCurrenScore === gameItems.length) {
      reset("You've won!!", newCurrenScore);
    }

    setCurrentScore(newCurrenScore);
  }

  function reset(message, score = currentScore) {
    setMessage(message + ` Your score was ${score}.`);
    setGameItems([]);
  }

  const gameIsReady = pokemonsInfo.length > 0;

  return (
    <>
      <Header />
      <main>
        <ScoreViewer currentScore={currentScore} bestScore={bestScore} />
        {message !== "" && <div className="message">{message}</div>}
      </main>

      {gameItems.length === 0 ? (
        <Form
          gameSizes={gameSizes}
          gameIsReady={gameIsReady}
          handleSubmit={handleSubmit}
        />
      ) : (
        <Game
          initialPokemonsInfo={gameItems}
          incrementScore={incrementScore}
          reset={reset}
        />
      )}
    </>
  );
}

export default App;
