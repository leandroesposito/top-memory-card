export default function Form({ gameSizes, gameIsReady, handleSubmit }) {
  return (
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
      <div className="form-row">
        <input type="checkbox" value="training" name="training" id="training" />
        <label htmlFor="training">Training Mode</label>
      </div>
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
  );
}
