import { useState, useEffect } from "react";

/** Custom hooks that keeps state synced with localStorage
 *
 * creates state using useState and looks in local storage for current value
 * if no value for key found, defaults to defaultVal
 *
 * when 'state' changes, effect re-runs:
 *  if new state is null, removes key from localStorage
 *  else, updates key in localStorage
 *
 */

function useLocalStorage(key, defaultVal = null) {
  const initVal = localStorage.getItem(key) || defaultVal;

  const [state, setState] = useState(initVal);

  /** sets or unsets key in localStorage */
  useEffect(() => {

    if (state === null) localStorage.removeItem(key);
    else localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorage;
