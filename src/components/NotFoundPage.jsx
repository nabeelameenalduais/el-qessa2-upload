import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';

export default function NotFoundPage() {
  const { go } = useApp();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <p className="text-7xl md:text-8xl font-bold text-burgundy leading-none mb-4">
          ٤٠٤
        </p>
        <p className="text-2xl font-bold text-ink mb-3">الصفحة غير موجودة</p>
        <p className="text-warm-brown text-sm md:text-base leading-relaxed mb-8">
          يبدو أنك وصلت إلى نهاية قصة لم تُكتب بعد. عد إلى حيث تبدأ الحكايات.
        </p>
        <Btn onClick={() => go('home')}>العودة إلى الرئيسية</Btn>
      </div>
    </div>
  );
}