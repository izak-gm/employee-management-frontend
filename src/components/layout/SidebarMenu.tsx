import { Fragment, useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuItem } from "./menu";

interface Props {
  items: MenuItem[];
  role: string;
}

const SidebarMenu = ({ items, role }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState<Record<string, boolean>>({});

  const isActive = (path?: string) => {
    if (!path) return false;

    return location.pathname === path;
  };

  const hasActiveChild = (children?: MenuItem[]): boolean => {
    if (!children) return false;

    return children.some((child) => {
      if (isActive(child.path)) return true;

      return hasActiveChild(child.children);
    });
  };

  const renderItems = (menu: MenuItem[], depth = 0) =>
    menu
      .filter((item) => item.roles.includes(role))
      .map((item) => {
        const hasChildren = Boolean(item.children?.length);

        const active = isActive(item.path);
        const childActive = hasActiveChild(item.children);

        const expanded = open[item.label] !== undefined ? open[item.label] : childActive;

        return (
          <Fragment key={item.label}>
            <ListItemButton
              onClick={() => {
                if (hasChildren) {
                  setOpen((prev) => ({
                    ...prev,
                    [item.label]: !expanded,
                  }));
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              sx={{
                pl: 2 + depth * 2,
                mb: 0.5,
                borderRadius: 2,
                color: active ? "#fff" : "rgba(255,255,255,0.75)",
                bgcolor: active ? "rgba(201,162,39,0.18)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 38,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: active || childActive ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />

              {hasChildren && (expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>

            {hasChildren && (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List disablePadding>{renderItems(item.children!, depth + 1)}</List>
              </Collapse>
            )}
          </Fragment>
        );
      });

  return <List disablePadding>{renderItems(items)}</List>;
};

export default SidebarMenu;
