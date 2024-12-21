import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Theme constants
const ThemeProps = {
  key: 'theme',
  light: 'light',
  dark: 'dark',
} as const;

type Theme = typeof ThemeProps.light | typeof ThemeProps.dark;

// Define the context type
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(ThemeProps.key) as Theme | null;
    return storedTheme || ThemeProps.light;
  });

  const isDark = useMemo(() => theme === ThemeProps.dark, [theme]);
  const isLight = useMemo(() => theme === ThemeProps.light, [theme]);

  const _setTheme = (theme: Theme) => {
    localStorage.setItem(ThemeProps.key, theme);
    document.documentElement.classList.remove(
      ThemeProps.light,
      ThemeProps.dark
    );
    document.documentElement.classList.add(theme);
    setTheme(theme);
  };

  const setLightTheme = () => _setTheme(ThemeProps.light);
  const setDarkTheme = () => _setTheme(ThemeProps.dark);
  const toggleTheme = () =>
    theme === ThemeProps.dark ? setLightTheme() : setDarkTheme();

  useEffect(() => {
    _setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        isLight,
        setLightTheme,
        setDarkTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
