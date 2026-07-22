import { Card, CardContent, Stack, Box, Typography, Divider } from "@mui/material";

export const maskAccount = (account?: string | null) => {
  if (!account) return "-";

  if (account.length <= 4) return account;

  return `${"*".repeat(account.length - 4)}${account.slice(-4)}`;
};

export function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            mb: 3,
          }}
        >
          {" "}
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              bgcolor: "#EEF4FB",
              color: "#132A46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {" "}
              {title}
            </Typography>

            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {children}
      </CardContent>
    </Card>
  );
}

export function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.8,
        }}
      >
        {" "}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          sx={{
            fontWeight: highlight ? 700 : 600,
            color: highlight ? "#132A46" : "text.primary",
          }}
        >
          {value || "-"}
        </Typography>
      </Stack>

      <Divider />
    </>
  );
}
