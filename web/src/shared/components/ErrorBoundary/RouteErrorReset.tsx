import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import ErrorBoundary from "./ErrorBoundary";

export default function RouteErrorReset({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const boundaryRef = useRef<ErrorBoundary>(null);

  useEffect(() => {
    boundaryRef.current?.reset();
  }, [location.pathname]);

  return (
    <ErrorBoundary ref={boundaryRef}>
      {children}
    </ErrorBoundary>
  );
}
