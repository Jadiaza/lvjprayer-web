import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LunaPlayer from "@/components/LunaPlayer";
import Index from "@/pages/Index";
import News from "@/pages/News";
import NewsAdmin from "@/pages/NewsAdmin";
import Schedule from "@/pages/Schedule";
import Videos from "@/pages/Videos";
import Charts from "@/pages/Charts";
import Contacts from "@/pages/Contacts";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const SiteLayout = () => {
  const location = useLocation();
  if (import.meta.env.MODE === "admin") return <NewsAdmin />;
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAdmin && <Header />}
      {!isAdmin && <LunaPlayer />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog-sidebar" element={<Navigate to="/noticias" replace />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/noticias/:slug" element={<News />} />
        {import.meta.env.MODE !== "hosting" && <Route path="/admin" element={<NewsAdmin />} />}
        <Route path="/shows-schedule" element={<Schedule />} />
        <Route path="/videos-elementor" element={<Videos />} />
        <Route path="/charts-elementor" element={<Charts />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter><SiteLayout /></BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;