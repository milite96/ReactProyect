import Banner from "../components/home-body/banner/Banner"
import GameSearch from "../components/home-body/gameSearch/GameSearch";
import Footer from "../components/footer/Footer";
import Navbar from "../components-victor/navbar/Navbar"
import BannerSurvey from "../components/home-body/bannerSurvey/BannerSurvey"
import GamesCarousel from "../components/body-Cinthya/carousel/GamesCarousel";
import MostPopular from "../components/body-Cinthya/mostPopular/MostPopular";


function Home() {

  return (
    <div>
        <Navbar />
        <Banner />
        <MostPopular/>
        <GamesCarousel/>
        <BannerSurvey />
        <GameSearch/>
        <Footer />
    </div>
  )
}



export default Home
