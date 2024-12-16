import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface FontSizeContextType {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

// Create a context with default values
const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({
  children,
}) => {
  // Load the font size from localStorage or default to 18 if not found
  const storedFontSize = localStorage.getItem('fontSize');
  const initialFontSize = storedFontSize ? parseInt(storedFontSize, 10) : 18;

  const [fontSize, setFontSize] = useState(initialFontSize);

  // Update localStorage whenever fontSize changes
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSizeContext = (): FontSizeContextType => {
  const context = React.useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
