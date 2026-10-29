import React from "react";

type Props = { children: React.ReactNode };
type State = { failed: boolean };

export class ModuleErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <section role="alert" className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950">
      <h1 className="text-lg font-bold">Não foi possível carregar esta área</h1>
      <p className="mt-2 text-sm">Uma atualização pode ter deixado um recurso antigo em cache. Recarregue a aplicação e tente novamente.</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white">Recarregar aplicação</button>
    </section>;
  }
}

