import { images } from '../data/mockData';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory">
      <div className="relative flex flex-col">
        <div className="relative lg:hidden h-40 overflow-hidden bg-ink flex-shrink-0">
          <img
            src={images.heroLibrary}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 to-ink/85" />
          <div className="relative h-full flex items-center justify-center gap-4 px-6">
            <img
              src="/assets/logo.png"
              alt="شعار نادي القصة «إلمقه»"
              className="w-14 h-14 object-contain flex-shrink-0"
            />
            <div className="text-ivory">
              <p className="font-bold text-lg">نادي القصة</p>
              <p className="text-gold text-[11px] tracking-widest mt-0.5">إلمقه</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 lg:py-16 w-full">
          {children}
        </div>
      </div>

      <aside className="hidden lg:block relative overflow-hidden bg-ink min-h-screen">
        <img
          src={images.heroLibrary}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/40" />
        <div className="relative h-full flex flex-col justify-end p-10 xl:p-14">
          <p className="text-gold-light text-sm tracking-[0.3em] mb-4">نادي القصة «إلمقه»</p>
          <h2 className="text-3xl xl:text-4xl font-bold text-ivory font-serif leading-snug max-w-md">
            كل حكاية تحتاج إلى مكانٍ تُروى فيه
          </h2>
          <div className="editorial-divider mt-6" />
          <p className="text-ivory/75 text-sm leading-relaxed mt-5 max-w-md">
            مساحة تجمع كتّاب القصة والرواية والمهتمين بالسرد، وتحتفي بالكلمة
            والكتاب والفعالية الثقافية.
          </p>
          <p className="mt-8 text-[11px] text-ivory/40">
            نسخة تجريبية للعرض — لا يوجد نظام مصادقة فعلي أو تخزين آمن.
          </p>
        </div>
      </aside>
    </div>
  );
}