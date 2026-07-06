import React, { createContext, useState } from 'react';

export const EstrellasContext = createContext();

export function EstrellasProvider({ children }) {

  const [estrellas, setEstrellas] = useState(0);

  function agregarEstrella() {
    setEstrellas(prev => prev + 1);
  }

  return (
    <EstrellasContext.Provider
      value={{
        estrellas,
        agregarEstrella
      }}
    >
      {children}
    </EstrellasContext.Provider>
  );
}