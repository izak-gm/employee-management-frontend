import DashboardLayout from "../../components/layout/DashboardLayout";
import ManageEmployeesView from "../../components/employees/ManageEmployeesView";

const ManageEmployeesPage = () => (
  <DashboardLayout title="Employees">
    <ManageEmployeesView availableRoles={["EMPLOYEE"]} />
  </DashboardLayout>
);

export default ManageEmployeesPage;
