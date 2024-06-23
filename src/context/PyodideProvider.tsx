"use client";
import { createContext, useRef, useState, ReactNode, useEffect } from "react";

interface PyodideContextProps {
  pyodide: any;
  hasLoadPyodideBeenCalled: boolean;
  isPyodideLoading: boolean;
  setIsPyodideLoading: (loading: boolean) => void;
}

export const PyodideContext = createContext<PyodideContextProps>(null!);

type PyodideProviderProps = {
  children: ReactNode;
};

export default function PyodideProvider({ children }: PyodideProviderProps) {
  const pyodide = useRef<any>(null);
  const hasLoadPyodideBeenCalled = useRef<boolean>(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!hasLoadPyodideBeenCalled.current) {
      loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js",
      }).then((loadedPyodide) => {
        pyodide.current = loadedPyodide;
        setIsPyodideLoading(false);
      });
      hasLoadPyodideBeenCalled.current = true;
    }
  }, []);
  return (
    <PyodideContext.Provider
      value={{
        pyodide: pyodide.current,
        hasLoadPyodideBeenCalled: hasLoadPyodideBeenCalled.current,
        isPyodideLoading,
        setIsPyodideLoading,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}
