// DashboardLayout.tsx

import { useState } from "react";
import type { ReactNode } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import NotificationBell from "../NotificationBell";
import Sidebar from "./Sidebar.";
import type { Role } from "../../types/auth.type";

const roleLabel: Record<Role, string> = {
  SUPERADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  HR_OFFICER: "HR Officer",
  PAYROLL_MANAGER: "Payroll Manager",
  FINANCE_MANAGER: "Finance Manager",
  TECH_LEAD: "Tech LEAD",
  SOFTWARE_ENGINEER: "Software Engineer",
  INTERN: "Inter",
};

const roleColor = {
  SUPERADMIN: "#C9A227",
  HR_ADMIN: "#6A1B9A",
  HR_OFFICER: "#1976D2",
  PAYROLL_MANAGER: "#2E7D32",
  FINANCE_MANAGER: "#EF6C00",
  TECH_LEAD: "#00897B",
  SOFTWARE_ENGINEER: "#455A64",
  INTERN: "#78909C",
};
interface Props {
  title: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, children }: Props) => {
  const navigate = useNavigate();

  const { role, email, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f6f8fb",
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AppBar
          elevation={0}
          position="sticky"
          color="inherit"
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              minHeight: 72,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Welcome back to Riverbank ERP
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <NotificationBell />

              {role && (
                <Chip
                  label={roleLabel[role]}
                  size="small"
                  sx={{
                    bgcolor: `${roleColor[role]}20`,
                    color: roleColor[role],
                    fontWeight: 700,
                  }}
                />
              )}

              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 38,
                    height: 38,
                  }}
                >
                  {email?.charAt(0).toUpperCase()}
                </Avatar>

                <KeyboardArrowDownIcon
                  sx={{
                    color: "text.secondary",
                    ml: 0.5,
                  }}
                />
              </IconButton>

              <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                <MenuItem
                  disabled
                  sx={{
                    opacity: "1 !important",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    setAnchorEl(null);
                  }}
                >
                  My Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    logout();
                    setAnchorEl(null);
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
