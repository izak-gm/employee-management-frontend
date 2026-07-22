import type { ReactNode } from "react";
import { Card, CardContent, Box, Stack, Typography } from "@mui/material";

const NAVY = "#132A46";

type PayrollStatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
};

export default function PayrollStatCard({
  title,
  value,
  icon,
  color = NAVY,
}: PayrollStatCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 700,
                color,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: "#EEF4FB",
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
