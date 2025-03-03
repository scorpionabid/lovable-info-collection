
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import Regions from "./pages/Regions";
import RegionDetails from "./pages/RegionDetails";
import Sectors from "./pages/Sectors";
import SectorDetails from "./pages/SectorDetails";
import Schools from "./pages/Schools";
import SchoolDetails from "./pages/SchoolDetails";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/users" element={<Users />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/regions/:id" element={<RegionDetails />} />
          <Route path="/sectors" element={<Sectors />} />
          <Route path="/sectors/:id" element={<SectorDetails />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:id" element={<SchoolDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
