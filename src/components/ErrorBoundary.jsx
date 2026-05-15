import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[Reserva Flow AI] render error boundary', { error, info });
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-8 shadow-premium">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-black">Приложение не смогло отрисоваться</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Ошибка поймана ErrorBoundary, поэтому вместо белого экрана вы видите этот fallback.
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <Button className="mt-6 gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Перезагрузить
          </Button>
        </div>
      </div>
    );
  }
}
