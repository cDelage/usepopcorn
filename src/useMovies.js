import { useEffect, useState } from "react";

const key = "ac98a8ff";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //callback?.();

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
      fetchMovies();
      return () => {
        controller.abort();
      };
    },
    [query]
  );

  return [movies, isLoading, error];
}
