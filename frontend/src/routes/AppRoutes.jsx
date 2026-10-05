import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { ROLE_HOME, ROLES } from "../utils/constants.js";
import Loader from "../components/common/Loader.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword.jsx"));
const UserDashboard = lazy(() => import("../pages/user/UserDashboard.jsx"));
const Stores = lazy(() => import("../pages/user/Stores.jsx"));
const StoreDetails = lazy(() => import("../pages/user/StoreDetails.jsx"));
const MyRatings = lazy(() => import("../pages/user/MyRatings.jsx"));
const OwnerDashboard = lazy(() => import("../pages/owner/OwnerDashboard.jsx"));
const OwnerRatings = lazy(() => import("../pages/owner/OwnerRatings.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const Users = lazy(() => import("../pages/admin/Users.jsx"));
const UserDetails = lazy(() => import("../pages/admin/UserDetails.jsx"));
const AdminStores = lazy(() => import("../pages/admin/Stores.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullPage label="Loading Campusly…" />;
  return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullPage label="Loading Campusly…" />}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute roles={[ROLES.USER]} />}>
            <Route path="/user" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="stores" element={<Stores />} />
              <Route path="top-rated" element={<Stores mode="top" />} />
              <Route path="ratings" element={<MyRatings />} />
              <Route path="stores/:id" element={<StoreDetails />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
          <Route element={<RoleRoute roles={[ROLES.STORE_OWNER]} />}>
            <Route path="/owner" element={<DashboardLayout />}>
              <Route index element={<OwnerDashboard />} />
              <Route path="ratings" element={<OwnerRatings />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
          <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
