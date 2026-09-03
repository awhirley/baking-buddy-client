import type { ReactNode } from "react";
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner";

interface LoadingButtonSpecificProps {
  children: ReactNode;
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  isLoading: boolean;
}

type LoadingButtonProps = LoadingButtonSpecificProps & React.ComponentPropsWithoutRef<typeof Button>;


export function LoadingButton({ children, onClick, isLoading, ...rest }: LoadingButtonProps) {
  const childrenClassName = "col-start-1 row-start-1" + (isLoading ? " invisible" : "");
  const spinnerClassName = "col-start-1 row-start-1 flex items-center gap-2" + (!isLoading ? " invisible" : "");
  const buttonClassName = "grid place-items-center" + (isLoading ? " cursor-not-allowed" : "");

  return (
    <Button 
      onClick={onClick}
      disabled={rest.disabled || isLoading}
      className={buttonClassName}
      {...rest}
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