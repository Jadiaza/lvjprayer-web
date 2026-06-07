import { Navbar } from "@/components/lvdj/Navbar";
import { Hero } from "@/components/lvdj/Hero";
import { RadioPlayer } from "@/components/lvdj/RadioPlayer";
import { FeatureCards } from "@/components/lvdj/FeatureCards";
import { Schedule } from "@/components/lvdj/Schedule";
import { QuickAccess } from "@/components/lvdj/QuickAccess";
import { Footer } from "@/components/lvdj/Footer";
import { MobileNav } from "@/components/lvdj/MobileNav";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Navbar />
    <main className="pb-24 lg:pb-0">
      <Hero />
      <section className="container -mt-8">
        <RadioPlayer />
      </section>
      <FeatureCards />
      <Schedule />
      <QuickAccess />
    </main>
    <Footer />
    <MobileNav />
  </div>
);

export default Index;
