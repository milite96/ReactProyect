import { useState, useEffect } from "react";
import GameCard from "../gameCard/GameCard"
import useFetchFree from "../../Fetch-freeToGame/useFetchFree";
import "./GameSearch.css";
import BasicDropdown from "../../../components-victor/dropdown/BasicDropdown";

function GameSearch() {
  const { data = [], error, isLoading } = useFetchFree(); // Ensure data is always an array
  const [randomGames, setRandomGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  function handleSearchQuery(e) {
    setSearchQuery(e.target.value);
  }

  function handleDropdown(e) {
    setSelectedGenre(e.target.innerText);
    console.log(selectedGenre);
  }

  function handleReset() {
    setSelectedGenre("");
    setSearchQuery("");
  }

  function handlePage(event) {
    setPage(Number(event.target.innerText) - 1);
  }

  function generateRandomGames() {
    const randomGames = data.sort(() => Math.random() - 0.5).slice(0, 12);
    setRandomGames(randomGames);
  }

  function populateDropdown() {
    if (data.length > 0) {
      const differentGenres = [...new Set(data.map((game) => game.genre))]; // Extraer géneros únicos
      const OrderedGenres = differentGenres.sort().slice(1, 19);
      const filterDifferentGenres = OrderedGenres.map((genre) => ({
        item: genre,
        value: genre.toLowerCase(),
      })); // Formatear géneros

      setGenres(filterDifferentGenres);
    }
  }
  useEffect(() => {
    if (data.length > 0) {
      console.log("Fetched Data:", data); // Log the fetched data

      generateRandomGames();
      populateDropdown();
    }
  }, [data]);


  // useEffect(() => {
  //   if (selectedGenre) {
  //     const gamesFilteredByGenre = data.filter(
  //       (game) => game.genre === selectedGenre
  //     );
  //     setFilteredGamesByGenre(gamesFilteredByGenre);
  //   }
  //   console.log("Filtered Games:", filteredGamesByGenre);
  // }, [selectedGenre, data]);

  function divideArrayInParts(array, partSize) {
    let result = [];
    for (let i = 0; i < array.length; i += partSize) {
      let part = array.slice(i, i + partSize);
      result.push(part);
    }
    return result;
  }

  useEffect(() => {
    let filteredGames = [];
    if (searchQuery) {
      console.log("Search Query:", searchQuery); // Log the search query
      filteredGames = data.filter((game) =>
        game.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Filtered Games:", filteredGames); // Log the filtered results
    } else if (selectedGenre) {
      filteredGames = data.filter((game) => game.genre === selectedGenre);
    }
    const pagination = divideArrayInParts(filteredGames, 12);
    setSearchResults(pagination);

    const arrayOfPages = Array.from({ length: pagination.length }, (_, i) => i + 1);
    setNumOfPages(arrayOfPages);
    setPage(0); // Reset to the first page on new search
  }, [searchQuery, selectedGenre, data]); // Depende de searchQuery y data

  useEffect(() => {
    console.log(genres);
  }, [genres]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <div>
      <div className="search-wrapper">
        <label htmlFor="game-search">
          <h1 className="search-title">Search your games!</h1>
        </label>

        <div className="funtionalities-wrapper">
          <input
            id="game-search"
            type="text"
            value={searchQuery}
            onChange={handleSearchQuery}
            placeholder="Search for a game..."
            className="search-input"
          />

          <div className="btn-wrapper">
            {genres.length ? (
              <BasicDropdown
                btnName={"Genres"}
                objectsArray={genres}
                handleOnClick={handleDropdown}
              />
            ) : null}
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="game-card-wrapper">
        {searchQuery || selectedGenre ? (
          searchResults.length ? (
            searchResults[page].map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="no-found">No results found</div>
          )
        ) : (
          randomGames.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </div>
      <div className="page-btn-wrapper">
        {numOfPages.map((page, index) => {
          return (
            <button className="page-btn" onClick={handlePage} key={index} >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameSearch;
