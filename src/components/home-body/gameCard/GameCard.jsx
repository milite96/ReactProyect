import './GameCard.css'

function GameCard({ game }){
  return (
    <div className="game-card-style">
    <div className="img-container">
      <img
          src={game.thumbnail}
          alt={game.title}
          onClick={() => window.open(game.game_url)}
      />
    </div>
    <div className="game-card-content">
      <div className="card-title">
        <h2 onClick={() => window.open(game.game_url)}>
            {game.title}
        </h2>
      </div>
      <div className="game-card-description">
        <p>{game.short_description}</p>
      </div>
      <div className="game-card-genre">
        <p>Genre: {game.genre}</p>
      </div>
      <div className="game-card-genre">
        <p>Platform: {game.platform}</p>
      </div>
    </div>
</div>

  );
};

export default GameCard;
