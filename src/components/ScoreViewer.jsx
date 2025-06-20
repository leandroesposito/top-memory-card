import "../styles/ScoreViewer.css";

export default function ScoreViewer({ currentScore, bestScore }) {
  return (
    <div className="score-viewer">
      <div>
        <span>Score</span>: {currentScore}
      </div>
      <div>
        <span>Best score</span>: {bestScore}
      </div>
    </div>
  );
}
