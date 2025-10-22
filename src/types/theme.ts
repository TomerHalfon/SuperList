export type ThemeMode = 
  | 'light' 
  | 'dark' 
  | 'purple-night' 
  | 'ocean-blue' 
  | 'sunset-orange' 
  | 'forest-green' 
  | 'high-contrast' 
  | 'cyberpunk' 
  | 'retro';

export interface ThemeInfo {
  id: ThemeMode;
  name: string;
  description: string;
  category: 'standard' | 'nature' | 'specialty';
}

export interface LocalizedThemeInfo {
  id: ThemeMode;
  name: string;
  description: string;
  category: 'standard' | 'nature' | 'specialty';
}

export const THEME_MODES: ThemeMode[] = [
  'light',
  'dark', 
  'purple-night',
  'ocean-blue',
  'sunset-orange',
  'forest-green',
  'high-contrast',
  'cyberpunk',
  'retro'
] as const;

export const THEME_INFO: Record<ThemeMode, ThemeInfo> = {
  'light': {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright default theme',
    category: 'standard'
  },
  'dark': {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes dark theme',
    category: 'standard'
  },
  'purple-night': {
    id: 'purple-night',
    name: 'Purple Night',
    description: 'Deep purple and violet tones',
    category: 'standard'
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calming blue and teal ocean colors',
    category: 'nature'
  },
  'sunset-orange': {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange and coral sunset hues',
    category: 'nature'
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green and earth tones',
    category: 'nature'
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for accessibility',
    category: 'specialty'
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink and cyan futuristic vibes',
    category: 'specialty'
  },
  'retro': {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage 80s warm pastel colors',
    category: 'specialty'
  }
};

export const STORAGE_KEY = 'superlist-theme';
