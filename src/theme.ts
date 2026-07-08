import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F2A4A", // deep navy — corporate anchor color
      light: "#2C4A6E",
      dark: "#08182E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#C9A227", // muted gold accent
      contrastText: "#0F2A4A",
    },
    background: {
      default: "#F4F6F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2733",
      secondary: "#5B6B7A",
    },
    divider: "#E3E8EE",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "0 1px 2px rgba(15,42,74,0.06)" },
      },
    },
  },
});

export default theme;
