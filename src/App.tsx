import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Fleet from "./pages/Fleet";
import Pricing from "./pages/Pricing";
import Customers from "./pages/Customers";
import Drivers from "./pages/Drivers";
import History from "./pages/History";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const SidebarLayout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
  {!isAuthenticated ? (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  ) : (
    <Route element={<SidebarLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fleet" element={<Fleet />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/history" element={<History />} />
      {/* Redirect /login to / if authenticated */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      {/* <Route path="/search" element={<Search />} /> */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )}
</Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;