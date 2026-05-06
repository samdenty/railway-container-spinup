"use client";

import { Component, type ReactNode } from "react";

type Props = {
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
  resetKeys?: ReadonlyArray<unknown>;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.state.error) return;
    const prev = prevProps.resetKeys ?? [];
    const next = this.props.resetKeys ?? [];
    if (
      prev.length !== next.length ||
      prev.some((value, index) => value !== next[index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
