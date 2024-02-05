import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./App-V2";
import { useKey } from "./useKey";

const key = "ac98a8ff";

export default function SelectedMovie({
  imdbId,
  onCloseSelectedMovie,
  onAddMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRating = useRef(0);
  useKey("Escape", onCloseSelectedMovie)

  const isWatched = watched.filter((mov) => mov.imdbID === imdbId).length !== 0;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleSetRating = (rating) => {
    setUserRating(rating);
  };

  const addToWatchlist = () => {
    onAddMovie({ ...movie, userRating, countRatingTime : countRating.current });
  };

  useEffect(() => {
    async function fetchDetailFilm() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${key}&i=${imdbId}&plot=full`
      );

      if (!res.ok) {
        throw new Error("Fail to load selected film");
      }

      const data = await res.json();

      if (data.Response === "false") {
        throw new Error("Fail to get data from film");
      }
      setMovie(data);
      setIsLoading(false);
    }

    countRating.current = 0;
    fetchDetailFilm();
  }, [imdbId]);

  useEffect(() => {
    if (title) {
      document.title = `Movie : ${title}`;
    }
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);


  useEffect(() => {
    if (userRating) countRating.current += 1;
  }, [userRating]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseSelectedMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} imdbRating
              </p>
            </div>
          </header>
          <section>
            {!isWatched ? (
              <>
                <StarRating
                  size={24}
                  maxRating={10}
                  onSetRating={handleSetRating}
                />
                {userRating !== 0 && (
                  <button className="btn-add" onClick={addToWatchlist}>
                    Add to watch list
                  </button>
                )}
              </>
            ) : (
              <p>You have rated this movie</p>
            )}
          </section>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
