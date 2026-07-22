import type { ReactNode } from "react";
import { Card, CardContent, Typography, Box, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NAVY = "#132A46";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  buttonLabel: string;
  onClick: () => void;
};

export default function QuickActionCard({
  title,
  description,
  icon,
  buttonLabel,
  onClick,
}: QuickActionCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        boxShadow: "none",
        transition: "all .2s ease",
        "&:hover": {
          borderColor: "#CBD5E1",
          boxShadow: "0 10px 25px rgba(15,23,42,.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: "#EEF4FB",
            color: NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: NAVY,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>

        <Stack sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={onClick}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#D1D5DB",
              color: NAVY,
              "&:hover": {
                borderColor: NAVY,
                bgcolor: "#F8FAFC",
              },
            }}
          >
            {buttonLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
