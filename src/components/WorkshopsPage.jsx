import PageHeader from './ui/PageHeader';
import WorkshopCard from './ui/WorkshopCard';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function WorkshopsPage() {
  const { content } = useApp();
  const { workshops } = content;
  return (
    <div>
      <PageHeader
        eyebrow="الورش"
        title="ورش الكتابة والسرد"
        description="مساحات عملية لمن يريد تطوير صوته في القصة القصيرة والرواية والنقد السردي."
        image={images.writingDesk}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {workshops.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
      </section>
    </div>
  );
}