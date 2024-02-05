import { useRef } from "react";
import { useKey } from "./useKey";

export default function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

export function Search({ query, onUpdateQuery }) {
  const inputEl = useRef(null);

  const focusOnQuery = () => {
    if(document.activeElement !== inputEl.current){
      inputEl.current.focus();
      onUpdateQuery("");
    }
  }

  useKey("Enter", focusOnQuery)

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onUpdateQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export function FoundResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
