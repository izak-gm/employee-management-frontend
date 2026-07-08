import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EmployeeDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/profile")}
        sx={{ mr: 2 }}
      >
        Edit My Profile
      </Button>
      <Button variant="outlined" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};
export default EmployeeDashboard;
