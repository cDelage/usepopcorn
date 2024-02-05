import { useEffect, useState } from "react";

export function useLocalStorageState(initialValue, item) {
  const [value, setValue] = useState(function () {
    const watchList = localStorage.getItem(item);
    return watchList ? JSON.parse(watchList) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(item, JSON.stringify(value));
  }, [value, item]);

  return [value, setValue];
}
