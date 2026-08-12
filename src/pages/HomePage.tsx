import { Body } from "../components/HomePage/Body";
import { Header } from "../components/HomePage/Header";

export function HomePage() {
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <Header />
        <Body />
      </div>
    </div>
  );
}