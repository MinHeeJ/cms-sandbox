import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.message) {
      return (
        <main className="app-main">
          <section className="notice error">
            <strong>화면을 불러오지 못했습니다.</strong>
            <span>{this.state.message}</span>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
