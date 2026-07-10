import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import LoginPage from "./pages/auth/LoginPage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ResetPasswordPage from "./pages/profile/ResetPasswordPage";
import ViewProfilePage from "./pages/profile/ViewProfilePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SetupPasswordPage from "./pages/auth/SetupPasswordPage";
import ResetPasswordTokenPage from "./pages/auth/ResetPasswordPage";
import ApplyLeavePage from "./pages/employee/ApllyLeavePage";
import MyLeavesPage from "./pages/employee/MyLeavePage";

const RoleRedirect = () => {
  const { role } = useAuth();
  if (role === "SUPERADMIN") return <Navigate to="/superadmin" replace />;
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "EMPLOYEE") return <Navigate to="/employee" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup-password" element={<SetupPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordTokenPage />} />
          <Route path="/unauthorized" element={<div>Not authorized</div>} />

          {/* Authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/profile" element={<ViewProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route
              path="/profile/reset-password"
              element={<ResetPasswordPage />}
            />

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["SUPERADMIN"]} />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["EMPLOYEE"]} />}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/leaves" element={<MyLeavesPage />} />
              <Route
                path="/employee/apply-leave"
                element={<ApplyLeavePage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
