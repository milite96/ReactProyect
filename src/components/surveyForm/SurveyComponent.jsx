import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import "./SurveyForm.css";
import { json } from "./json";
import { useEffect, useState } from "react";
import useFetchFree from "../Fetch-freeToGame/useFetchFree"

import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Spinner from 'react-bootstrap/Spinner'
import "bootstrap/dist/css/bootstrap.min.css";
import "../body-Cinthya/mostPopular/MostPopular.css";

function SurveyComponent() {
  const [surveyResult, setSurveyResult] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyModel, setSurveyModel] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, loading, error } = useFetchFree()

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

  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000);
  },[])

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
      if (filteredGamesByReleaseDate.length > 4) {
        const resultGames = filteredGamesByReleaseDate.slice(0, 5)
        setFilteredGames(resultGames);
      } else {
        setFilteredGames(filteredGamesByReleaseDate)
      }
    }
  }, [isCompleted, surveyResult, data])

  useEffect(() => {
    console.log(filteredGames);
  }, [filteredGames])

  return (
    <div>
      <div className={isLoading? "spinner-wrapper" : "hidden"}>
      <Spinner animation="border"/>
      </div>
      <div className={isLoading ? "hidden" : ""}>
        <div className="survey-wrapper">
          {surveyModel && <Survey model={surveyModel} />}
        </div>
      </div>
      {isCompleted && (
        <div className="most-div-wrapper">
          <h1 className="most-title">You should try these games:</h1>
          <div className="most-card-group-wrapper">
            <CardGroup className="most-card-group">
              {filteredGames &&
                filteredGames.map((game) => (
                  <Card className="most-card" key={game.id}>
                    <Card.Img
                      variant="top"
                      src={game.thumbnail}
                    />
                    <Card.Body>
                      <Card.Title className="most-card-title">{game.title}</Card.Title>
                      <Card.Text className="most-card-text">{game.short_description} </Card.Text>
                    </Card.Body>
                    <div className="most-div-flex">
                      <button
                        className="most-see-more-btn"
                        onClick={() => window.open(game.game_url)}
                      >
                        See more
                      </button>
                    </div>
                    <Card.Footer>
                      <small className="most-text-muted">
                        Release date: {game.release_date}
                      </small>
                    </Card.Footer>
                  </Card>
                ))}
            </CardGroup>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyComponent;
