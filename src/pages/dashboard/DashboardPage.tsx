import { useAuth } from "../../context/AuthContext";

import SuperAdminDashboard from "../superadmin/SuperAdminDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import EmployeeDashboard from "../user/EmployeeDashboard";

const DashboardPage = () => {
  const { role } = useAuth();

  switch (role) {
    case "SUPERADMIN":
      return <SuperAdminDashboard />;

    case "HR_ADMIN":
      return <AdminDashboard />;

    case "TECH_LEAD":
    case "SOFTWARE_ENGINEER":
    case "INTERN":
      return <EmployeeDashboard />;

    default:
      return <div>Unauthorized</div>;
  }
};

export default DashboardPage;
