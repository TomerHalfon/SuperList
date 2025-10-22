import { createTheme } from '@mui/material/styles';
import { ThemeMode } from '@/types/theme';

const baseTheme = {
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
};

export const themes: Record<ThemeMode, ReturnType<typeof createTheme>> = {
  light: createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: '#ffffff',
        paper: '#fafafa',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
  }),

  dark: createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#fce4ec',
        dark: '#ad1457',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
      },
    },
  }),

  'purple-night': createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      secondary: {
        main: '#e91e63',
        light: '#f06292',
        dark: '#c2185b',
      },
      background: {
        default: '#1a0d1a',
        paper: '#2d1b2d',
      },
      text: {
        primary: '#f3e5f5',
        secondary: '#ce93d8',
      },
    },
  }),

  'ocean-blue': createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#0277bd',
        light: '#58a5f0',
        dark: '#01579b',
      },
      secondary: {
        main: '#00acc1',
        light: '#4dd0e1',
        dark: '#00838f',
      },
      background: {
        default: '#f0f8ff',
        paper: '#e1f5fe',
      },
      text: {
        primary: '#0d47a1',
        secondary: '#0277bd',
      },
    },
  }),

  'sunset-orange': createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#ff6f00',
        light: '#ffb74d',
        dark: '#e65100',
      },
      secondary: {
        main: '#ff5722',
        light: '#ff8a65',
        dark: '#d84315',
      },
      background: {
        default: '#fff8e1',
        paper: '#ffecb3',
      },
      text: {
        primary: '#e65100',
        secondary: '#ff6f00',
      },
    },
  }),

  'forest-green': createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#2e7d32',
        light: '#66bb6a',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#558b2f',
        light: '#8bc34a',
        dark: '#33691e',
      },
      background: {
        default: '#f1f8e9',
        paper: '#e8f5e8',
      },
      text: {
        primary: '#1b5e20',
        secondary: '#2e7d32',
      },
    },
  }),

  'high-contrast': createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
        light: '#424242',
        dark: '#000000',
      },
      secondary: {
        main: '#ffffff',
        light: '#ffffff',
        dark: '#f5f5f5',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#000000',
      },
    },
    components: {
      ...baseTheme.components,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '2px solid #000000',
          },
        },
      },
    },
  }),

  cyberpunk: createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff0080',
        light: '#ff4da6',
        dark: '#cc0066',
      },
      secondary: {
        main: '#00ffff',
        light: '#4ddbff',
        dark: '#00cccc',
      },
      background: {
        default: '#0a0a0a',
        paper: '#1a1a1a',
      },
      text: {
        primary: '#00ffff',
        secondary: '#ff0080',
      },
    },
    components: {
      ...baseTheme.components,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid #ff0080',
            boxShadow: '0 0 10px rgba(255, 0, 128, 0.3)',
          },
        },
      },
    },
  }),

  retro: createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#ff6b9d',
        light: '#ffa8c8',
        dark: '#e91e63',
      },
      secondary: {
        main: '#4fc3f7',
        light: '#81d4fa',
        dark: '#0288d1',
      },
      background: {
        default: '#fce4ec',
        paper: '#f8bbd9',
      },
      text: {
        primary: '#ad1457',
        secondary: '#e91e63',
      },
    },
  }),
};

export const getTheme = (mode: ThemeMode, isRTL: boolean = false) => {
  const theme = themes[mode];
  
  if (isRTL) {
    return createTheme({
      ...theme,
      direction: 'rtl',
    });
  }
  
  return theme;
};
