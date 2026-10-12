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
import CMSAdmin from "@/pages/CMSAdmin";
import Schedule from "@/pages/Schedule";
import Artists from "@/pages/Artists";
import AudioLibrary from "@/pages/AudioLibrary";
import Videos from "@/pages/Videos";
import Charts from "@/pages/Charts";
import Contacts from "@/pages/Contacts";
import NotFound from "@/pages/NotFound";
import SeasonalTheme from "@/components/SeasonalTheme";

const queryClient = new QueryClient();

const SiteLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const adminHome = import.meta.env.MODE === "admin" ? <CMSAdmin /> : <NewsAdmin />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeasonalTheme />
      {!isAdmin && <Header />}
      {!isAdmin && <LunaPlayer />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog-sidebar" element={<Navigate to="/noticias" replace />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/noticias/:slug" element={<News />} />
        {import.meta.env.MODE !== "hosting" && <Route path="/admin" element={adminHome} />}
        {import.meta.env.MODE !== "hosting" && <Route path="/admin/noticias" element={<NewsAdmin />} />}
        <Route path="/shows-schedule" element={<Schedule />} />
        <Route path="/artistas" element={<Artists />} />
        <Route path="/audios" element={<AudioLibrary />} />
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