import type { ReactNode } from "react";
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner";

interface LoadingButtonProps {
  children: ReactNode;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  onClick?: ((event: any) => void) | undefined;
  isLoading: boolean;
}

export function LoadingButton({ children, buttonVariant, onClick, isLoading }: LoadingButtonProps) {
  const childrenClassName = "col-start-1 row-start-1" + (isLoading ? " invisible" : "");
  const spinnerClassName = "col-start-1 row-start-1 flex items-center gap-2" + (!isLoading ? " invisible" : "");
  const buttonClassName = "grid place-items-center" + (isLoading ? " cursor-not-allowed" : "");

  return (
    <Button 
      variant={buttonVariant}
      onClick={onClick}
      disabled={isLoading}
      className={buttonClassName}
    >
      <span className={childrenClassName}>
        {children}
      </span>

      <span className={spinnerClassName}>
        <Spinner />
      </span>
    </Button>
  )
}