import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === key) {
        callback?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [callback, key]);
}
