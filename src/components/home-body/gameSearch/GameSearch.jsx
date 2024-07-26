import { useState, useEffect } from "react";
import GameCard from "../gameCard/GameCard";
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
  const [selectedSort, setSelectedSort] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);

  const sortByFilter = [
    { item: "New releases", value: "New releases" },
    { item: "Legacy games", value: "Legacy games" },
    { item: "Randomize", value: "Randomize" },
  ];

  function handleSearchQuery(e) {
    setSearchQuery(e.target.value);
  }

  function handleDropdownGenre(e) {
    setSelectedGenre(e.target.innerText);
  }

  function handleDropdownSort(e) {
    setSelectedSort(e.target.innerText);
    console.log(selectedSort);
  }

  function handleReset() {
    setSelectedGenre("");
    setSearchQuery("");
    setSelectedSort("");
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

  function divideArrayInParts(array, partSize) {
    let result = [];
    for (let i = 0; i < array.length; i += partSize) {
      let part = array.slice(i, i + partSize);
      result.push(part);
    }
    return result;
  }

  useEffect(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = data.filter((game) =>
        game.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((game) => game.genre === selectedGenre);
    }

    if (selectedSort === "New releases") {
      filtered = filtered.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    } else if (selectedSort === "Legacy games") {
      filtered = filtered.sort(
        (a, b) => new Date(a.release_date) - new Date(b.release_date)
      );
    } else if (selectedSort === "Randomize") {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedGenre, selectedSort, data]);

  useEffect(() => {
    const pagination = divideArrayInParts(filteredGames, 12);
    setSearchResults(pagination);

    const pages = Array.from({ length: pagination.length }, (_, i) => i + 1);
    setNumOfPages(pages);
    setPage(0); // Reset to the first page on new search
  }, [filteredGames]);

  useEffect(() => {
    console.log(filteredGames);
  }, [filteredGames]);

  useEffect(() => {
    console.log(genres);
  }, [genres]);

  useEffect(() => {
    console.log(numOfPages);
  }, [numOfPages]);

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
              <div className="filter-wrapper">
                <BasicDropdown
                  btnName={selectedGenre.length > 0 ? selectedGenre : "Genres"}
                  objectsArray={genres}
                  handleOnClick={handleDropdownGenre}
                />
                <BasicDropdown
                  btnName={selectedSort.length > 0 ? selectedSort : "Sort by"}
                  objectsArray={sortByFilter}
                  handleOnClick={handleDropdownSort}
                />
              </div>
            ) : null}
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="game-card-wrapper">
        {searchQuery || selectedGenre || selectedSort ? (
          searchResults.length  ? (
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
        {numOfPages.length > 0 && (selectedGenre.length > 0 || selectedSort.lenght > 0 || searchQuery.length > 0) && (
            numOfPages.map((page, index) => {
              return (
                <button className="page-btn" onClick={handlePage} key={index}>
                  {page}
                </button>
              );
            }))}
      </div>
    </div>
  );
}

export default GameSearch;
