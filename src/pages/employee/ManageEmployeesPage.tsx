import DashboardLayout from "../../components/layout/DashboardLayout";
import ManageEmployeesView from "../../components/employees/ManageEmployeesView";

const ManageEmployeesPage = () => (
  <DashboardLayout title="Employees">
    <ManageEmployeesView
      availableRoles={["HR_ADMIN", "SUPERADMIN", "SOFTWARE_ENGINEER"]}
      availableGenders={["MALE", "FEMALE"]}
    />
  </DashboardLayout>
);

export default ManageEmployeesPage;
