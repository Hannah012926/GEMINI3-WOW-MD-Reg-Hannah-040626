import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'Light' | 'Dark';
export type Language = 'English' | 'Traditional Chinese';

export interface AppState {
  theme: Theme;
  language: Language;
  painterStyle: string;
  defaultModel: string;
  history: any[];
  twAppInfo: any;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  setPainterStyle: (s: string) => void;
  setDefaultModel: (m: string) => void;
  addHistory: (entry: any) => void;
  setTwAppInfo: (info: any) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const PAINTER_STYLES = [
  "Default",
  "Vincent van Gogh",
  "Claude Monet",
  "Pablo Picasso",
  "Leonardo da Vinci",
  "Johannes Vermeer",
  "Rembrandt",
  "Edgar Degas",
  "Gustav Klimt",
  "Edvard Munch",
  "Salvador Dali",
  "Frida Kahlo",
  "Jackson Pollock",
  "Andy Warhol",
  "Henri Matisse",
  "Paul Cezanne",
  "Pierre-Auguste Renoir",
  "Sandro Botticelli",
  "Wassily Kandinsky",
  "Georgia O'Keeffe",
  "Hokusai"
];

export const MODELS = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-pro-preview"
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('Light');
  const [language, setLanguage] = useState<Language>('Traditional Chinese');
  const [painterStyle, setPainterStyle] = useState<string>("Default");
  const [defaultModel, setDefaultModel] = useState<string>("gemini-3-flash-preview");
  const [history, setHistory] = useState<any[]>([]);
  const [twAppInfo, setTwAppInfo] = useState<any>({});

  const addHistory = (entry: any) => {
    setHistory(prev => [{ ...entry, ts: new Date().toISOString() }, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      language, setLanguage,
      painterStyle, setPainterStyle,
      defaultModel, setDefaultModel,
      history, addHistory,
      twAppInfo, setTwAppInfo
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
