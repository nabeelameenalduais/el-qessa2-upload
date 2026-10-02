import { useEffect } from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';

export default function AdminGate({ children }) {
  const { go, isAuthenticated, currentUser, logout } = useApp();
  const isAdmin = isAuthenticated && currentUser?.role === 'أدمن';
  const isOrganizer =
    isAuthenticated &&
    currentUser?.role === 'حاضر' &&
    Boolean(currentUser.circleId);
  const canAccess = isAdmin || isOrganizer;

  useEffect(() => {
    if (!isAuthenticated) go('login');
  }, [isAuthenticated, go]);

  if (!isAuthenticated) return null;

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center animate-fade-slide-up py-10">
          <span className="mx-auto w-14 h-14 bg-burgundy/10 text-burgundy flex items-center justify-center rounded-sm mb-5">
            <ShieldAlert size={26} />
          </span>
          <h1 className="text-2xl font-bold text-ink leading-snug">غير مصرح لك بالدخول</h1>
          <p className="text-sm text-warm-brown mt-3 leading-relaxed">
            لوحة الإدارة مخصصة لإدارة النادي ولمنسّقي الدوائر (كل منسق داخل دائرته
            فقط). حسابك الحالي لا يملك صلاحية الوصول إلى هذه اللوحة.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Btn onClick={() => go('my-account')}>حسابي</Btn>
            <Btn variant="outline" onClick={() => go('home')}>
              العودة إلى الرئيسية
            </Btn>
          </div>
          <button
            onClick={logout}
            className="mt-6 mx-auto flex items-center gap-1.5 text-xs text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return children;
}