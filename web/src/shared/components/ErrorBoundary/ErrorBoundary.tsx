import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("💥 App crashed:", error, errorInfo);
  }

  /** 🔑 This is what RouteErrorReset calls */
  reset() {
    this.setState({ hasError: false, error: undefined });
  }

  handleGoHome = () => {
    this.reset();
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "var(--color-bg-main)",
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ opacity: 0.6 }}>
            The page crashed unexpectedly.
          </p>

          <button
            onClick={this.handleGoHome}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go back to dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
