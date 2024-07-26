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
        <div className='info-wrapper'>
        <div className='genre-platform-wrapper'>
          <div className="game-card-genre">
            <p>{game.genre}</p>
          </div>
          <div className="game-card-genre">
            <p>-</p>
          </div>
          <div className="game-card-genre">
            <p>{game.platform}</p>
          </div>
        </div>
        <div className="game-card-genre">
          <p>Release: {game.release_date}</p>
        </div>
      </div>
    </div>
</div>

  );
};

export default GameCard;
