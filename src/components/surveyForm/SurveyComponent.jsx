import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import "./SurveyForm.css";
import { json } from "./json";
import { useEffect, useState } from "react";
import useFetchFree from "../Fetch-freeToGame/useFetchFree";
import GameCard from "../home-body/gameCard/GameCard";
import Spinner from 'react-bootstrap/Spinner';
import "bootstrap/dist/css/bootstrap.min.css";
import "../body-Cinthya/mostPopular/MostPopular.css";

function SurveyComponent() {
  const [surveyResult, setSurveyResult] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyModel, setSurveyModel] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [genresFromSurvey, setGenresFromSurvey] = useState([]);
  const [nonRepeatedGamesArray, setNonRepeatedGamesArray] = useState([]);
  const { data, loading } = useFetchFree();

  const handleRefreshPage = () => window.location.reload();

  useEffect(() => {
    const survey = new Model(json);
    survey.applyTheme(themeJson);
    survey.onComplete.add((sender) => {
      setSurveyResult(sender.data);
      setIsCompleted(true);
    });
    setSurveyModel(survey);
  }, []);

  useEffect(() => {
    if (isCompleted && data) {
      const genresToFilter = surveyResult.selectedGenres;
      const filteredGamesByGenre = data.filter(game => genresToFilter.includes(game.genre));

      const platformToFilter = surveyResult.platform;
      const filteredGamesByPlatform = filteredGamesByGenre.filter(game => game.platform === platformToFilter);

      const releaseDateFilter = surveyResult.preferenceRelease;
      let filteredGamesByReleaseDate;
      if (releaseDateFilter === "Old games") {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      } else if (releaseDateFilter === "New games") {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort(() => Math.random() - 0.5);
      }

      const differentGenres = [...new Set(filteredGamesByReleaseDate.map(game => game.genre))];
      const slicedArray = differentGenres.flatMap(uniqueGenre => filteredGamesByReleaseDate.filter(game => game.genre === uniqueGenre).slice(0, 1));
      setGenresFromSurvey(differentGenres);

      if (differentGenres.length > 1 && differentGenres.length < 8 && filteredGamesByReleaseDate.length > 8) {
        const idsToRemove = new Set(slicedArray.map(game => game.id));
        const filteredArray = filteredGamesByReleaseDate.filter(game => !idsToRemove.has(game.id));
        setNonRepeatedGamesArray(filteredArray);
        setFilteredGames([...slicedArray, ...filteredArray.slice(0, 8 - slicedArray.length)]);
      } else {
        setFilteredGames(filteredGamesByReleaseDate.slice(0, 8));
      }
    }
  }, [isCompleted, surveyResult, data]);

  return (
    <div>
      <div className={loading ? "spinner-wrapper" : "hidden"}>
        <Spinner animation="border" />
      </div>
      <div className={loading ? "hidden" : ""}>
        <div className="survey-wrapper">
          {surveyModel && !isCompleted && <Survey model={surveyModel} />}
        </div>
        {isCompleted && (
          <div className="most-div-wrapper">
            <h1 className="most-title">You should try these games:</h1>
            <div className="game-card">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => <GameCard key={game.id} game={game} />)
              ) : (
                <div className="no-games-found-wrapper">
                  <h2 className="survey-no-found">
                    No games found within your preferences. Please, try the survey again
                  </h2>
                  <h4 className="survey-no-found-explanation">
                    Remember: web browser games are not as popular as PC download games
                  </h4>
                  <button onClick={handleRefreshPage} className="btn-link-survey">
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurveyComponent;
