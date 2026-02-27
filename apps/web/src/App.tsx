import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import DesignStudio from "./pages/DesignStudio";
import DBDesign from "./pages/DBDesign";
import LLDGen from "./pages/LLDGen";
import AuditTrails from "./pages/AuditTrails";
import TokenUsage from "./pages/TokenUsage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/db-design"
              element={
                <ProtectedRoute>
                  <DBDesign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lld"
              element={
                <ProtectedRoute>
                  <LLDGen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studio"
              element={
                <ProtectedRoute>
                  <DesignStudio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit-trails"
              element={
                <ProtectedRoute>
                  <AuditTrails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/token-usage"
              element={
                <ProtectedRoute>
                  <TokenUsage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
