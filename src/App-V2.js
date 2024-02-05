import { useEffect, useState } from "react";
import Navbar, { FoundResults, Logo, Search } from "./Navbar";
import SelectedMovie from "./SelectedMovie";
import Main, {
  MovieBox,
  Summary,
  MoviesList,
  Movie,
  WatchedMovie,
} from "./Main";

/*

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];*/

const key = "ac98a8ff";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleRemoveMovie = (imdbID) => {
    setWatched(watched.filter((mov) => mov.imdbID !== imdbID));
  };

  const handleAddWatched = (movie) => {
    setWatched((watchedMovies) => [
      ...watchedMovies.filter((m) => m.imdbID !== movie.imdbID),
      movie,
    ]);
    handleCloseMovie();
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleSelectedId = (id) => {
    id === selectedId ? setSelectedId(null) : setSelectedId(id);
  };

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found");
          }
          setMovies(data.Search);
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();
      return () => {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} onUpdateQuery={setQuery} />
        <FoundResults movies={movies} />
      </Navbar>
      <Main>
        <MovieBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList>
              {movies.map((movie) => (
                <Movie
                  movie={movie}
                  key={movie.imdbID}
                  onUpdateSelectedId={handleSelectedId}
                />
              ))}
            </MoviesList>
          )}
          {error && <ErrorMessage message={error} />}
        </MovieBox>
        <MovieBox>
          {selectedId ? (
            <>
              <SelectedMovie
                imdbId={selectedId}
                apiKey={key}
                onCloseSelectedMovie={handleCloseMovie}
                onAddMovie={handleAddWatched}
                watched={watched}
              />
            </>
          ) : (
            <>
              <Summary watched={watched} />
              <MoviesList>
                {watched.map((movie) => (
                  <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onRemoveMovie={() => {
                      handleRemoveMovie(movie.imdbID);
                    }}
                  />
                ))}
              </MoviesList>
            </>
          )}
        </MovieBox>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

export function Loader() {
  return <p className="loader">Loading</p>;
}
