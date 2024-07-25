import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import "./SurveyForm.css";
import { json } from "./json";
import { useEffect, useState } from "react";
import useFetchFree from "../Fetch-freeToGame/useFetchFree"
import GameCard from "../home-body/gameCard/GameCard";


import Spinner from 'react-bootstrap/Spinner'
import "bootstrap/dist/css/bootstrap.min.css";
import "../body-Cinthya/mostPopular/MostPopular.css";

function SurveyComponent() {
  const [surveyResult, setSurveyResult] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyModel, setSurveyModel] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genresFromSurvey, setGenresFromSurvey] = useState([]);
  const [testArray, setTestArray] = useState([]);
  const [nonRepeatedGamesArray, setNonRepeatedGamesArray] = useState([]);

  const { data, loading, error } = useFetchFree()

  function handleRefreshPage(){
    window.location.reload()
  }

  useEffect(() => {
    const survey = new Model(json);
    survey.applyTheme(themeJson);
    survey.onComplete.add((sender, options) => {
      console.log(sender.data);
      setSurveyResult(sender.data);
      setIsCompleted(true);
    });
    setSurveyModel(survey)
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000);
  }, [])

  useEffect(() => {
    if (isCompleted && data) {
      const genresToFilter = surveyResult.selectedGenres;
      let filteredGamesByGenre = [];
      let filteredGamesByPlatform = [];
      let filteredGamesByReleaseDate = [];
      genresToFilter.forEach(selectedGenre => {
        const filteredData = data.filter(game => game.genre === selectedGenre);
        filteredGamesByGenre = [...filteredGamesByGenre, ...filteredData];
      })
      const platformToFilter = surveyResult.platform
      if (platformToFilter === "Web Browser") {
        filteredGamesByPlatform = filteredGamesByGenre.filter(game => game.platform === platformToFilter);
      } else {
        filteredGamesByPlatform = filteredGamesByGenre.filter(game => game.platform == platformToFilter);
      }
      const releaseDateFilter = surveyResult.preferenceRelease
      if (releaseDateFilter === "Old games") {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      } else if (releaseDateFilter === "New games") {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      } else {
        filteredGamesByReleaseDate = filteredGamesByPlatform.sort(() => Math.random() - 0.5)
      }
      setTestArray(filteredGamesByReleaseDate);
      const differentGenres = [...new Set(filteredGamesByReleaseDate.map((game) => game.genre))]
      let slicedArray = [];
      differentGenres.forEach(uniqueGenre => {
        slicedArray = [...slicedArray, ...(filteredGamesByReleaseDate.filter((game) => game.genre === uniqueGenre)).slice(0, 1)]
      })
      setGenresFromSurvey(differentGenres)

      if (differentGenres.length > 1 && differentGenres.length < 8 && filteredGamesByReleaseDate.length > 8) {
        // displayedArray =  [...slicedArray, ...(filteredGamesByReleaseDate.sort(() => Math.random() - 0.5))]
        // displayedArray.slice(0, (8 - genresFromSurvey.length))
        const idsToRemove = new Set(slicedArray.map(slicedGame => slicedGame.id));
        const filteredArray = filteredGamesByReleaseDate.filter(game => !idsToRemove.has(game.id))
        setNonRepeatedGamesArray(filteredArray);
        setFilteredGames([...slicedArray, ...filteredArray.slice(0, (8 - slicedArray.length))])
      } else if (differentGenres.length === 1) {
        setFilteredGames(filteredGamesByReleaseDate.slice(0, 8))
      } else if (differentGenres.length > 1 && filteredGamesByReleaseDate.length <= 8) {
        setFilteredGames(filteredGamesByReleaseDate)
      } else {
        setFilteredGames(slicedArray)
      }



    }
  }, [isCompleted, surveyResult, data])

  useEffect(() => {
    console.log("selected genres:", genresFromSurvey);
  }, [genresFromSurvey])

  useEffect(() => {
    console.log("all filtered games:", testArray);
  }, [testArray])

  useEffect(() => {
    console.log("array with no repeated games:", nonRepeatedGamesArray);
  }, [nonRepeatedGamesArray])

  useEffect(() => {
    console.log("printed games:", filteredGames);
  }, [filteredGames])


  return (
    <div>
      <div className={isLoading ? "spinner-wrapper" : "hidden"}>
        <Spinner animation="border" />
      </div>
      <div className={isLoading ? "hidden" : ""}>
        <div className="survey-wrapper">
          {surveyModel && <Survey model={surveyModel} />}
        </div>
      </div>
      {isCompleted && (
        <div className="most-div-wrapper">
          <h1 className="most-title">You should try these games:</h1>
          <div className="game-card">
            {filteredGames &&
              filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
      )}

      {isCompleted && filteredGames.length == 0 && (
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
  );
}

export default SurveyComponent;
