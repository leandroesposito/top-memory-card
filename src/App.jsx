import { useEffect, useState, useRef } from "react";
import "./App.css";
import Form from "./components/Form.jsx";
import Header from "./components/Header.jsx";
import ScoreViewer from "./components/ScoreViewer.jsx";
import Game from "./components/Game.jsx";

const gameSizes = [4, 6, 8, 10, 12, 14];
const pageSize = gameSizes[gameSizes.length - 1];

function App() {
  const ignoreFetch = useRef(false);
  const [itemsInfo, setItemsInfo] = useState([]);
  const [gameItems, setGameItems] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [message, setMessage] = useState("");
  const [trainingMode, setTrainingMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const dataApi = `https://dog.ceo/api/breeds/image/random/${pageSize}`;

      let resultList = await fetch(dataApi)
        .then((res) => res.json())
        .then((json) => json.message);

      setItemsInfo(
        resultList.map((item) => {
          const breed = item.match(/(?<=breeds\/).*?(?=\/)/)[0];
          // Replace "-" with " " and capitalize every word
          const name = breed
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return {
            name,
            imageUrl: item,
            id: item.name,
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
    const trainingMode = formData.get("training") !== null;

    if (Number.isNaN(gameSize)) {
      setMessage("You have to select a number of cards to play with!");
    } else {
      setCurrentScore(0);
      initGame(gameSize);
      setMessage("");
      setTrainingMode(trainingMode);
    }
  }

  function initGame(gameSize) {
    const startIndex = Math.floor(
      Math.random() * (itemsInfo.length - gameSize)
    );

    const newGameItems = itemsInfo.slice(startIndex, startIndex + gameSize);

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

  const gameIsReady = itemsInfo.length > 0;

  return (
    <>
      <Header />
      <main>
        <div className="info">
          <div className="message">{message}</div>
          <ScoreViewer currentScore={currentScore} bestScore={bestScore} />
        </div>
        {gameItems.length === 0 ? (
          <Form
            gameSizes={gameSizes}
            gameIsReady={gameIsReady}
            handleSubmit={handleSubmit}
          />
        ) : (
          <Game
            initialItemsInfo={gameItems}
            trainingMode={trainingMode}
            incrementScore={incrementScore}
            reset={reset}
          />
        )}
      </main>
    </>
  );
}

export default App;
