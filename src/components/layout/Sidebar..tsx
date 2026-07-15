import {
  Avatar,
  Box,
  Divider,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import SidebarMenu from "./SidebarMenu";
import { menuItems } from "./menu";

const DRAWER_WIDTH = 280;

const Sidebar = () => {
  const { role, email, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          bgcolor: "primary.dark",
          color: "#fff",
          borderRight: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            letterSpacing: ".08em",
            fontWeight: 700,
          }}
        >
          RIVERBANK
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,.65)",
          }}
        >
          ERP Management System
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.12)",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 2.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            width: 46,
            height: 46,
          }}
        >
          {email?.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
          >
            {role}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,.65)",
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.12)",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 1.5,
          py: 1.5,

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,.15)",
            borderRadius: 20,
          },
        }}
      >
        {role && <SidebarMenu items={menuItems} role={role} />}
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.12)",
        }}
      />

      <Box
        sx={{
          p: 2,
        }}
      >
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,

            color: "rgba(255,255,255,.8)",

            "&:hover": {
              bgcolor: "rgba(255,255,255,.08)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "inherit",
              minWidth: 38,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                }}
              >
                Logout
              </Typography>
            }
          />
        </ListItemButton>

        <Typography
          align="center"
          variant="caption"
          sx={{
            display: "block",
            mt: 2,
            color: "rgba(255,255,255,.45)",
          }}
        >
          ERP v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
