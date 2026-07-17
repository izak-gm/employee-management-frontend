import { Box, Button, Stack, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import { useNavigate } from "react-router-dom";
import type { Role, Gender } from "../../api";
import EmployeeTable from "./EmployeeTable";

interface Props {
  availableRoles: Role[];
  availableGenders: Gender[];
}

const ManageEmployeesView = ({
  availableRoles: _availableRoles,
  availableGenders: _availableGenders,
}: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">Employees</Typography>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate("/employees/create")}
        >
          Add Employee
        </Button>
      </Stack>

      <EmployeeTable onEdit={(employee) => navigate(`/employees/${employee.id}/edit`)} />
    </Box>
  );
};

export default ManageEmployeesView;
