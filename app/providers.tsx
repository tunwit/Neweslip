"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/th";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialThemeProvider,
  THEME_ID,
} from "@mui/material/styles";
import {
  extendTheme as joyExtendTheme,
  CssVarsProvider as JoyCssVarsProvider,
} from "@mui/joy/styles";

const queryClient = new QueryClient();

const muiTheme = materialExtendTheme();
const joyTheme = joyExtendTheme({
  fontFamily: {
    body: "var(--font-propmt)",
    display: "var(--font-propmt)",
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          minHeight: 40,
        },
      },
    },
    JoySelect: {
      styleOverrides: {
        root: {
          minHeight: 40,
        },
      },
    },
    JoyAutocomplete: {
      styleOverrides: {
        root: {
          minHeight: 40,
        },
      },
    },
  },
});

export default function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <JoyCssVarsProvider theme={joyTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
            {children}
          </LocalizationProvider>
        </JoyCssVarsProvider>
      </MaterialThemeProvider>
    </QueryClientProvider>
  );
}
