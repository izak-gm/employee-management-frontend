import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";

import type { EmployeeResponse } from "../../api/types";

interface Props {
  open: boolean;
  employee: EmployeeResponse | null;
  onClose: () => void;
}

const Item = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 2,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "grey.200",
      bgcolor: "#fafafa",
      transition: "all .2s ease",

      "&:hover": {
        bgcolor: "#f0f7ff",
        borderColor: "primary.main",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontWeight: 700,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant="body1"
      sx={{
        mt: 0.7,
        fontWeight: 600,
      }}
    >
      {value || "-"}
    </Typography>
  </Paper>
);

export default function EmployeeDetailsDialog({ open, employee, onClose }: Props) {
  if (!employee) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: 1100,
            borderRadius: 4,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box
          sx={{
            p: 3,
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              {" "}
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "white",
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                {employee.firstName?.charAt(0)}
                {employee.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {employee.firstName} {employee.lastName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                  }}
                >
                  {employee.positionName || "No Position"} •{" "}
                  {employee.departmentName || "No Department"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                  }}
                >
                  {employee.email}
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={employee.status}
              color={
                employee.status === "ACTIVE"
                  ? "success"
                  : employee.status === "INACTIVE"
                    ? "default"
                    : "warning"
              }
              sx={{
                fontWeight: 700,
                fontSize: 14,
              }}
            />
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={4}>
          {/* PERSONAL INFORMATION */}

          <Box>
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              {" "}
              <PersonIcon color="primary" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Personal Information
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Item label="First Name" value={employee.firstName} />

                <Item label="Middle Name" value={employee.middleName} />

                <Item label="Last Name" value={employee.lastName} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Item label="Gender" value={employee.gender} />

                <Item label="Date of Birth" value={employee.dateOfBirth} />

                <Item label="National ID" value={employee.nationalId} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Item label="Email Address" value={employee.email} />

                <Item label="Phone Number" value={employee.phoneNumber} />
              </Stack>
            </Stack>
          </Box>

          <Divider />
          <Box>
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              {" "}
              <WorkIcon color="primary" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Employment Information
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Item label="Employee Number" value={employee.employeeNumber} />

                <Item label="Role" value={employee.role} />

                <Item label="Status" value={employee.status} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Item label="Department" value={employee.departmentName} />

                <Item label="Position" value={employee.positionName} />

                <Item label="Supervisor" value={employee.supervisorName} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Item label="Hire Date" value={employee.hireDate} />

                <Item label="Confirmation Date" value={employee.confirmationDate} />

                <Item label="Exit Date" value={employee.exitDate} />
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              {" "}
              <SettingsIcon color="primary" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                System Information
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Item label="Employee ID" value={employee.id} />

                <Item label="Created At" value={employee.createdAt} />

                <Item label="Updated At" value={employee.updatedAt} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fafafa",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="contained" color="primary">
          Edit Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
}
