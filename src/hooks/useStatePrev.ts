import { useState } from "react";

export default function useStatePrev<T>(initialValue: T): [T, T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [prevState, setPrevState] = useState<T>(initialValue);

  const setStateWithPrev = (value: T) => {
    setPrevState(state);
    setState(value);
  };

  return [state, prevState, setStateWithPrev];
}