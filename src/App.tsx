import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ResetPasswordPage from "./pages/profile/ResetPasswordPage";
import ViewProfilePage from "./pages/profile/ViewProfilePage";

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<div>Not authorized</div>} />

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
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
