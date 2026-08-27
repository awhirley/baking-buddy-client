import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "#components/SharedComponents/ui/button";

import headerImage from "../../assets/header_no_background.png";

export function BakingBuddyPage({ children }: { children: ReactNode }) {
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <Header />
        {children}
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  return (
    <div className="flex flex-row gap-x-4 pb-10 flex flex-col justify-between w-200 items-center">
      <img src={headerImage} alt="Banner" style={{ height: '80px', width: 'auto' }}  />
      {location.pathname === "/" && <Button onClick={() => navigate("/create")}>New Recipe</Button>}
      {location.pathname.includes("view") && <div className="flex gap-x-2">
        <Button variant="outline" onClick={() => navigate(`/bake/${id}`)}>New Bake</Button>
        <Button onClick={() => navigate("/")}>Home</Button>
      </div>}
      {location.pathname.includes("bake") && <Button onClick={() => navigate("/")}>Home</Button>}
    </div>
  );
}