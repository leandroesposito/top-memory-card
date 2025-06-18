import Card from "./Card.jsx";

export default function Game({ pokemonsInfo }) {
  return (
    <div className="game">
      {pokemonsInfo.map((p) => (
        <Card name={p.name} imageUrl={p.imageUrl} key={p.id} />
      ))}
    </div>
  );
}
