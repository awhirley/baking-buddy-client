import { Body } from "#components/HomePage/Body";
import { Header } from "#components/HomePage/Header";
import { HeroSection1 } from "#components/ui/hero-section-1";

export function HomePage() {
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <Header />
        <HeroSection1 />
        <Body />
      </div>
    </div>
  );
}