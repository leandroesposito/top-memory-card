export default function Card({ name, imageUrl }) {
  return (
    <div className="card">
      <div className="imageContainer">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="name">{name}</div>
    </div>
  );
}
