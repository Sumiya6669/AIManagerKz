import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-20 flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="text-7xl font-black text-slate-200">404</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Страница не найдена</h1>
        <p className="mt-3 text-sm text-slate-500">
          Маршрут <span className="font-mono text-slate-700">{location.pathname}</span> не существует в приложении Reserva Flow AI.
        </p>
        <Link to="/dashboard" className="mt-6 inline-flex">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться в Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
