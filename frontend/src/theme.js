import {  useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


// mui theme settings
export const themeSettings = () => {

  return {
    palette: {
      mode: "light",
      background: 
      {
        default: "#fcfcfc",
      },
    },
    typography: {
      fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};


export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
