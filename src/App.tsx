import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import BibliaHome from "./pages/biblia/BibliaHome";
import BibliaLeer from "./pages/biblia/BibliaLeer";
import BibliaImportar from "./pages/biblia/BibliaImportar";
import BibliaProximamente from "./pages/biblia/BibliaProximamente";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/biblia" element={<BibliaHome />} />
          <Route path="/biblia/leer" element={<BibliaLeer />} />
          <Route path="/biblia/importar" element={<BibliaImportar />} />
          <Route path="/biblia/buscar" element={<BibliaProximamente title="Buscar" />} />
          <Route path="/biblia/comparar" element={<BibliaProximamente title="Comparar versiones" />} />
          <Route path="/biblia/planes" element={<BibliaProximamente title="Planes de lectura" />} />
          <Route path="/biblia/favoritos" element={<BibliaProximamente title="Favoritos" />} />
          <Route path="/biblia/notas" element={<BibliaProximamente title="Notas" />} />
          <Route path="/biblia/marcadores" element={<BibliaProximamente title="Marcadores" />} />
          <Route path="/biblia/concordancia" element={<BibliaProximamente title="Concordancia" />} />
          <Route path="/biblia/personajes" element={<BibliaProximamente title="Personajes" />} />
          <Route path="/biblia/lugares" element={<BibliaProximamente title="Lugares" />} />
          <Route path="/biblia/mapas" element={<BibliaProximamente title="Mapas" />} />
          <Route path="/biblia/cronologias" element={<BibliaProximamente title="Cronologías" />} />
          <Route path="/biblia/audio" element={<BibliaProximamente title="Audio Biblia" />} />
          <Route path="/biblia/configuracion" element={<BibliaProximamente title="Configuración" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
