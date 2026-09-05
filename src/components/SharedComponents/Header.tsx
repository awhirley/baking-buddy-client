import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="flex flex-row gap-x-4 pb-10 flex flex-col justify-between w-200 items-center">
      <img src={headerImage} alt="Banner" style={{ height: '80px', width: 'auto' }}  />
      <div className="flex flex-row gap-x-4">
        <Button variant="outline" onClick={() => navigate("/aboutus")}>About Us</Button>
        {
          location.pathname === "/" ?
            <Button onClick={() => navigate("/create")}>New Recipe</Button> :
            <Button onClick={() => navigate("/")}>Home</Button>
        }
      </div>
    </div>
  );
}