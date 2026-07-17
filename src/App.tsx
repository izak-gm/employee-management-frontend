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
              <Route path="/employees/create" element={<AddEmployeePage/>} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
