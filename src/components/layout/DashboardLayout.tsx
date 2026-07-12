import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const roleLabel = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
};

const roleColor = {
  SUPERADMIN: "#C9A227",
  ADMIN: "#2C4A6E",
  EMPLOYEE: "#5B6B7A",
};

const DashboardLayout = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const { role, email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: `/${role?.toLowerCase()}`,
      icon: <DashboardIcon />,
    },
    ...(role === "ADMIN" || role === "SUPERADMIN"
      ? [
          {
            label: "Employees",
            path: `/${role.toLowerCase()}/employees`,
            icon: <PeopleIcon />,
          },
        ]
      : []),
    ...(role === "EMPLOYEE"
      ? [
          {
            label: "My Leaves",
            path: "/employee/leaves",
            icon: <PeopleIcon />,
          },
        ]
      : []),
    { label: "My Profile", path: "/profile", icon: <PersonIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "primary.dark",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        <Box sx={{ px: 3, py: 3.5 }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", letterSpacing: "0.03em" }}
          >
            RIVERBANK
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            Employee Management
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <List sx={{ px: 1.5, mt: 1 }}>
          {navItems.map((item) => {
            const isRootItem = item.path === `/${role?.toLowerCase()}`;
            const active = isRootItem
              ? location.pathname === item.path
              : location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);
            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: active ? "#fff" : "rgba(255,255,255,0.7)",
                  bgcolor: active ? "rgba(201,162,39,0.18)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "secondary.main" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{ mt: "auto", p: 2 }}>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2,
              color: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" color="inherit" sx={{ bgcolor: "#fff" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" color="text.primary">
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {role && (
                <Chip
                  label={roleLabel[role]}
                  size="small"
                  sx={{
                    bgcolor: `${roleColor[role]}1A`,
                    color: roleColor[role],
                    fontWeight: 600,
                  }}
                />
              )}
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "primary.main",
                    fontSize: 14,
                  }}
                >
                  {email?.[0]?.toUpperCase()}
                </Avatar>
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem disabled sx={{ opacity: "1 !important" }}>
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
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
