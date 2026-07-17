import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface Props {
  text?: string;
}

export default function PageLoader({ text = "Loading..." }: Props) {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={45} />
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
