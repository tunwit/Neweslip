"use client";

import { CssVarsProvider, extendTheme } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const theme = extendTheme({
  fontFamily: {
    body: "var(--font-propmt)",
    display: "var(--font-propmt)",
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme} />
      {children}
    </QueryClientProvider>
  );
}
