import { useState, useEffect, useCallback } from "react";

const safeGet = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    const saved = safeGet(key);
    return saved !== null ? saved : initialValue;
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = safeGet(key);
    if (saved !== null) {
      setStored(saved);
    }
    setLoaded(true);
  }, [key]);

  const setValue = useCallback(
    (value) => {
      const next = typeof value === "function" ? value(stored) : value;
      setStored(next);
      safeSet(key, next);
    },
    [key, stored]
  );

  return [stored, setValue, loaded];
}

export { safeGet, safeSet };
