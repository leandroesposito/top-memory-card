import { useEffect, useState, useRef } from "react";
import "./App.css";

const gameSizes = [4, 6, 8, 10, 12, 14];
const pageSize = gameSizes[gameSizes.length - 1];

const namesApi = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const ignoreFetch = useRef(false);
  const [pokemonsInfo, setPokemonsInfo] = useState([]);
  const [numCards, serNumCards] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

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
            image: item.sprites.other["official-artwork"].front_default,
          };
        })
      );
    }

    if (!ignoreFetch.current) {
      ignoreFetch.current = true;
      fetchData();
    }
  }, []);

  useEffect(() => {
    console.log([pokemonsInfo.length]);
  }, [pokemonsInfo.length]);

  function handleSubmit(event) {}

  const gameIsReady = pokemonsInfo.length > 0;

  return (
    <>
      <form>
        <fieldset>
          <legend>Select number of tiles for the game.</legend>
          {gameSizes.map((gs) => (
            <div id="form-row" key={gs}>
              <input
                type="radio"
                value={gs}
                name="game-size"
                id={`game-size-${gs}`}
              />
              <label htmlFor={`game-size-${gs}`}>{gs}</label>
            </div>
          ))}
        </fieldset>
        {gameIsReady ? (
          <button type="button" onClick={handleSubmit}>
            Play!
          </button>
        ) : (
          <button type="button" disabled={true}>
            Loading data...
          </button>
        )}
      </form>
    </>
  );
}

export default App;
