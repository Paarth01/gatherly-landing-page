import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle protected routes and dashboard redirects
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to={profile?.role === 'organizer' ? '/organizer-dashboard' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// Component to redirect authenticated users from landing page
const LandingRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user && profile) {
    return <Navigate to={profile.role === 'organizer' ? '/organizer-dashboard' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={
                <LandingRedirect>
                  <Index />
                </LandingRedirect>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="attendee">
                  <AttendeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/organizer-dashboard" 
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/events" element={<Events />} />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEvent />
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
