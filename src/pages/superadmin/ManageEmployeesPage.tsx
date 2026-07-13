import DashboardLayout from "../../components/layout/DashboardLayout";
import ManageEmployeesView from "../../components/employees/ManageEmployeesView";

const ManageEmployeesPage = () => (
  <DashboardLayout title="Employees">
    <ManageEmployeesView availableRoles={["ADMIN", "SUPERADMIN", "EMPLOYEE"]} availableGenders={["MALE","FEMALE"]} />
  </DashboardLayout>
);

export default ManageEmployeesPage;
