import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ActiveVotes from "./pages/ActiveVotes";
import VoteDetail from "./pages/VoteDetail";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateProposal from "./pages/admin/CreateProposal";
import ManageProposals from "./pages/admin/ManageProposals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          
          {/* Voter Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/votes" element={<ActiveVotes />} />
          <Route path="/vote/:id" element={<VoteDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateProposal />} />
          <Route path="/admin/manage" element={<ManageProposals />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
