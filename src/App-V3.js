import { useState } from "react";
import Navbar, { FoundResults, Logo, Search } from "./Navbar";
import SelectedMovie from "./SelectedMovie";
import { useMovies } from "./useMovies";
import Main, {
  MovieBox,
  Summary,
  MoviesList,
  Movie,
  WatchedMovie,
} from "./Main";
import { useLocalStorageState } from "./useLocalStorageState";

const key = "ac98a8ff";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const [movies, isLoading, error] = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched")

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

  const handleSelectedId = (id) => {
    id === selectedId ? setSelectedId(null) : setSelectedId(id);
  };

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
