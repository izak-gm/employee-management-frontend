import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const NAVY = "#132A46";

export default function PayrollHeader() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: NAVY,
              mb: 1,
            }}
          >
            Payroll
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
            Manage payroll operations, salary processing, employee compensation, payroll profiles
            and statutory deductions from a single location.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/payroll/payslips")}
          sx={{
            bgcolor: NAVY,
            px: 3,
            py: 1.25,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#0F2138",
              boxShadow: "none",
            },
          }}
        >
          Generate Payroll
        </Button>
      </Stack>
    </Box>
  );
}
