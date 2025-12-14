export enum CardType {
  COVER = 'COVER',
  CONTENT = 'CONTENT'
}

export interface CardConfig {
  id: string;
  type: CardType;
  title?: string;
  // Content can be plain string (cover/legacy) or object with fontSize (smart typography)
  content?: string | { content: string, fontSize: number };
  pageNumber?: number;
  totalPages?: number;
}

export interface Theme {
  id: string;
  label: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  // Custom theme properties
  customConfig?: {
    c1: string; // Hex without #
    c2: string; // Hex without #
    angle: number;
  };
}

export const THEMES = [
  {
    id: 'red',
    label: 'Red',
    gradient: 'linear-gradient(135deg, #D92027 0%, #B51B22 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    id: 'blue',
    label: 'Blue',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    id: 'green',
    label: 'Green',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    id: 'dark',
    label: 'Dark',
    gradient: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    id: 'beige',
    label: 'Beige',
    gradient: 'linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%)',
    textColor: '#1C1917', // Dark Stone
    accentColor: '#44403C', // Warm Grey
  },
] as const;

export const DEFAULT_THEME_ID = 'red';

export interface AppState {
  title: string;
  text: string;
  themeId: string;
}