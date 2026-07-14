import { useEffect, useState } from "react";
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getMyNotifications, coverAction, type LeaveResponse } from "../api/leaveApi";

const NotificationBell = () => {
  const [items, setItems] = useState<LeaveResponse[]>([]);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const load = () => getMyNotifications().then((r) => setItems(r.data));
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const handle = async (id: string, accept: boolean) => {
    await coverAction(id, accept);
    load();
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
        <Badge badgeContent={items.length} color="error">
          <NotificationsIcon sx={{ color: "text.secondary" }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { width: 340 } } }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Cover Requests
        </Typography>
        <Divider />
        {items.length === 0 && <MenuItem disabled>No pending requests</MenuItem>}
        {items.map((i) => (
          <Box
            key={i.id}
            sx={{
              px: 2,
              py: 1.2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {`${i.employeeFullName ?? "Someone"} needs a cover`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {i.leaveType} · {i.startDate} → {i.endDate}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton size="small" color="success" onClick={() => handle(i.id!, true)}>
                <CheckCircleIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handle(i.id!, false)}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Menu>
    </>
  );
};
export default NotificationBell;
