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
import Message from "./pages/Message";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import SendDriverinfo from "./pages/SendDriverinfo";
import UpdateRide from "./pages/UpdateRide";
import NewPricing from "./pages/NewPricing";
import WebSocketListener from "./WebSocketListener";
import NotificationSocket from "./NotificationSocket";
import WebSocketBookingListener from "./WebsocketBookingListener";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";

import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { WifiOff } from "lucide-react";

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
       <Route path="/send-driverinfo/:bookingId" element={<SendDriverinfo />} />
          <Route path="/update-ride/:bookingid" element={<UpdateRide />} /> 
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
                </>
      ) : (
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/pricing" element={<NewPricing />} />
           {/* <Route path="/pricing" element={<Pricing />} /> */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/drivers" element={<Drivers />} />
          {/* <Route path="/history" element={<History />} /> */}
          <Route path="/message" element={<Message />} />
          
          {/* Redirect / to /login if not authenticated */}
          {/* Redirect /login to / if authenticated */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      )}
    </Routes>
  );
};

const App = () => {

const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);









  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WebSocketBookingListener />
          <NotificationSocket />
           <WebSocketListener/>
        
    <Dialog open={isOffline}>
  <DialogContent className="sm:max-w-[425px] p-6 rounded-lg border-none shadow-xl">
    <DialogHeader>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50">
        <WifiOff className="h-6 w-6 text-red-500" />
      </div>
      <DialogTitle className="text-xl font-semibold text-gray-800 mt-4">
        You're Offline
      </DialogTitle>
    </DialogHeader>

    <div className="mt-2 text-gray-500">
      <p>Your connection was interrupted. Changes may not be saved.</p>
    </div>

    <div className="mt-6 flex flex-col space-y-3">
      <Button
        onClick={() => window.location.reload()}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors"
      >
        Reconnect
      </Button>
    
    </div>

    <div className="mt-4 text-xs text-gray-400">
      Last synced: {new Date().toLocaleTimeString()}
    </div>
  </DialogContent>
</Dialog>
          <BrowserRouter>
          

            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;