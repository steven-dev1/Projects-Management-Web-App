"use client";
import { Component, ReactNode } from "react";
import { Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col m-4 items-center justify-center h-full gap-4 text-center px-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full">
            <AlertTriangle size={36} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Algo salió mal
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
            {this.state.message || "Ocurrió un error inesperado."}
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              this.setState({ hasError: false, message: "" });
              window.location.reload();
            }}
          >
            Reintentar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}