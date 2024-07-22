import { useNavigate } from "react-router-dom";
import "./BannerSurvey.css"


function Encuesta(){
  const navigate = useNavigate()

  function goToSurvey(){
    navigate('/survey')
  }
  return (
    <div className="banner-survey-wrapper">
      <h2 className="banner-survey-text">Are you tired of playing the same mainstream games?</h2>
      <p className="banner-survey-text">Use our browser to search for your next favourite game!</p>
      <button onClick={goToSurvey} className="btn-link-survey">Let's go!</button>
    </div>
  );
}

export default Encuesta;
