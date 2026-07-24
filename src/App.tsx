import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SetupPasswordPage from "./pages/auth/SetupPasswordPage";
import ResetPasswordTokenPage from "./pages/auth/ResetPasswordPage";

import DashboardPage from "./pages/dashboard/DashboardPage";

import ViewProfilePage from "./pages/profile/ViewProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ResetPasswordPage from "./pages/profile/ResetPasswordPage";

import AllLeavesPage from "./pages/leaves/AllLeavesPage";
import MyLeavePage from "./pages/leaves/MyLeavePage";
import LeaveApplicationForm from "./components/leaves/LeaveApplicationForm";
import AddEmployeePage from "./pages/employee/AddEmployeePage";
import ManageEmployeesPage from "./pages/employee/ManageEmployeesPage";
import AddPayrollProfilePage from "./pages/payroll/AddPayrollProfilePage";
import EditPayrollProfilePage from "./pages/payroll/EditPayrollProfilePage";
import PayrollListPage from "./pages/payroll/PayrollListPage";
import MyPayrollPage from "./pages/payroll/MyPayrollPage";
import PayrollProfileDetailsPage from "./pages/payroll/PayrollProfileDetailsPage";
import PayrollProfilesPage from "./pages/payroll/PayrollProfilesPage";
import PayrollDashboardPage from "./pages/payroll/dashboard/PayrollDashboardPage";
import DepartmentsPage from "./pages/departments/DepartmentPage";
import PositionsPage from "./pages/departments/PositionPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup-password" element={<SetupPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordTokenPage />} />
          <Route path="/unauthorized" element={<div>Not authorized</div>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ViewProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/reset-password" element={<ResetPasswordPage />} />

            {/* Employee Management */}
            <Route element={<RoleRoute allowedRoles={["SUPERADMIN", "HR_ADMIN"]} />}>
              <Route path="/employees" element={<ManageEmployeesPage />} />
              <Route path="/employees/create" element={<AddEmployeePage />} />
              <Route path="/employees/:id/edit" element={<div>Edit Employee</div>} />
            </Route>

            {/* HR Leave Management */}
            <Route element={<RoleRoute allowedRoles={["SUPERADMIN", "HR_ADMIN"]} />}>
              <Route path="/leaves/all" element={<AllLeavesPage />} />
            </Route>

            {/* My Leaves */}
            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "SUPERADMIN",
                    "HR_ADMIN",
                    "TECH_LEAD",
                    "SOFTWARE_ENGINEER",
                    "INTERN",
                  ]}
                />
              }
            >
              <Route path="/leaves" element={<MyLeavePage />} />
              <Route path="/leaves/apply" element={<LeaveApplicationForm />} />
            </Route>
            {/* Payrolls */}
            {/* Payroll Profile */}
            <Route
              element={
                <RoleRoute
                  allowedRoles={["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"]}
                />
              }
            >
              <Route path="/payroll" element={<PayrollDashboardPage />} />
              <Route path="/payroll/profiles" element={<PayrollProfilesPage />} />
              <Route path="/payroll/profiles/new" element={<AddPayrollProfilePage />} />
              <Route path="/payroll/profiles/:id" element={<PayrollProfileDetailsPage />} />
              <Route
                path="/payroll/profiles/:profileId/edit"
                element={<EditPayrollProfilePage />}
              />
            </Route>
            <Route
              element={
                <RoleRoute
                  allowedRoles={["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"]}
                />
              }
            >
              <Route path="/payroll/payslips" element={<PayrollListPage />} />
            </Route>
            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "SUPERADMIN",
                    "HR_ADMIN",
                    "HR_OFFICER",
                    "PAYROLL_MANAGER",
                    "FINANCE_MANAGER",
                    "TECH_LEAD",
                    "SOFTWARE_ENGINEER",
                    "INTERN",
                  ]}
                />
              }
            >
              <Route path="/payroll/me" element={<MyPayrollPage />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={["SUPERADMIN", "HR_ADMIN"]} />}>
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/positions" element={<PositionsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
