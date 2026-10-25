import { Routes, Route } from "react-router-dom";

import AppShell from "./components/AppShell";

import DashboardPage from "./pages/DashboardPage";
import GameTrendsPage from "./pages/GameTrendsPage";
import ProfileExplorerPage from "./pages/ProfileExplorerPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";

import RequireAdmin from "./auth/RequireAdmin";

//import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

//const queryClient = new QueryClient();

export default function App() {
  return (
    
    <Routes>
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
        />

      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="/games"
          element={<GameTrendsPage />}
        />

        <Route
          path="/profiles"
          element={<ProfileExplorerPage />}
        />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
      </Route>

      

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
    
  );
}