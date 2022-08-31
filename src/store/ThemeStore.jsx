import create from 'zustand'

import { createTheme } from '@mui/material/styles'

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export const useThemeStore = create((set) => ({
	theme: lightTheme,
}));