import React, { createContext, useContext, useState } from "react";

const ApiKeyContext = createContext(null);

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState("");

  const value = {
    apiKey,
    setApiKey,
    clearApiKey: () => setApiKey(""),
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => useContext(ApiKeyContext);
