import {
  BookOpen,
  Users,
  PenTool,
  CalendarCheck,
  Lightbulb,
  Heart,
} from 'lucide-react';
import PageHeader from './ui/PageHeader';
import SectionHeading from './ui/SectionHeading';
import { images } from '../data/mockData';

const activities = [
  {
    icon: CalendarCheck,
    title: 'أمسيات قصصية شهرية',
    desc: 'ليالٍ تُقدَّم فيها قصص حيّة أمام جمهور مباشر، تليها جلسات حوارية مفتوحة.',
  },
  {
    icon: PenTool,
    title: 'ورش كتابة عملية',
    desc: 'مساحات لتعلّم القصة القصيرة والبناء السردي، بإشراف قاصّين ونقّاد من النادي.',
  },
  {
    icon: Lightbulb,
    title: 'ندوات أدبية',
    desc: 'محادثات أدبية حول مكانة القصة والرواية، بمشاركة نقّاد وروائيين يمنيين.',
  },
  {
    icon: BookOpen,
    title: 'جلسات نقدية تطبيقية',
    desc: 'قراءات نقدية مشتركة لنصوص مختارة، لفهم كيف يتصرف النص في كل تفصيل.',
  },
  {
    icon: Users,
    title: 'لقاءات مع الكتّاب',
    desc: 'حوارات مفتوحة مع روائيين وقاصّين عن تجربتهم في الكتابة والحياة.',
  },
  {
    icon: Heart,
    title: 'برنامج مجتمعي',
    desc: 'ورش قصصية في المدارس والمؤسسات المجتمعية لنشر ثقافة السرد بين الأجيال.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="عن النادي"
        title="نادي القصة"
        description="مساحة ثقافية جمعت الكلمة وكتّابها وقارئيها، وأنبتت من الحكاية جسراً بين الجميع."
        image={images.libraryHall}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="text-gold text-xs font-medium tracking-widest mb-3">
              نبذة عن النادي
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-5 leading-snug">
              بدأنا من سؤال صغير: لماذا لا يُقرأ النص ويُتناقش في صنعاء؟
            </h2>
            <div className="editorial-divider mb-6" />
            <p className="text-warm-brown text-sm md:text-base leading-loose font-serif">
              نادي القصة «إلمقه» مساحة أدبية وثقافية أسّسها عدد من القاصّين
              والروائيين والنقّاد اليمنيين عام 2024، بهدف خلق بيئة حيّة يلتقي
              فيها الكتّاب والقرّاء، ويُسمع فيها الصوت الشاب الذي يبحث عن مكانه
              في المشهد الأدبي.
            </p>
            <p className="text-warm-brown text-sm md:text-base leading-loose font-serif mt-4">
              انطلق النادي حين جمعت مجموعة من الهواة فكرة بسيطة حول الطاولة
              نفسها: أن نصنع مكاناً يُقرأ فيه نص القصة ويُتفق حوله بحب وصرامة.
              من ذلك السؤال نمت فعاليات النادي لتشمل ورشاً وندوات وإصدارات
              وملتقيات وقِطاعاً نقدياً تطبيقياً.
            </p>
          </div>
          <div>
            <p className="text-gold text-xs font-medium tracking-widest mb-3">
              الرؤية
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-5 leading-snug">
              أن نكون مرجعاً لقصة التعبير اليمني.
            </h2>
            <div className="editorial-divider mb-6" />
            <p className="text-warm-brown text-sm md:text-base leading-loose font-serif">
              نسعى لأن نكون المكان الذي يرعى الكتّاب في مراحلهم الأولى، ويصنع
              جسراً بينهم وبين الجمهور المحلي والعربي. نحلم بمشهد أدبي يمني
              غنيّ بالقصص التي تروي عالمنا كما نراه ونشعر به.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory-dark/50 border-y border-ivory-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-medium tracking-widest mb-3">
              الرسالة
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink leading-snug max-w-xl mx-auto">
              نصنع مساحات يفصح فيها النص عن بريقه، وتمنح كتّابها الصوت والثقة.
            </h2>
            <div className="editorial-divider mx-auto mt-5" />
          </div>
          <div className="grid sm:grid-cols-2 gap-8 text-center">
            <div className="bg-white border border-ivory-dark p-8">
              <p className="text-3xl font-bold text-burgundy mb-2">٤٥+</p>
              <p className="text-warm-brown text-sm">فعالية منذ التأسيس</p>
            </div>
            <div className="bg-white border border-ivory-dark p-8">
              <p className="text-3xl font-bold text-burgundy mb-2">٨</p>
              <p className="text-warm-brown text-sm">إصدارات بعلامة النادي</p>
            </div>
            <div className="bg-white border border-ivory-dark p-8">
              <p className="text-3xl font-bold text-burgundy mb-2">٢٠+</p>
              <p className="text-warm-brown text-sm">كاتب وكاتبة أعضاء في النادي</p>
            </div>
            <div className="bg-white border border-ivory-dark p-8">
              <p className="text-3xl font-bold text-burgundy mb-2">٥</p>
              <p className="text-warm-brown text-sm">مدن يمتد إليها النادي</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="ما نفعله"
          title="أنشطة النادي"
          subtitle="نتحدّث عن القصة في كل صيغها — من القراءة إلى الكتابة، ومن النقاش إلى النشر."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {activities.map((a, i) => (
            <div
              key={i}
              className="group bg-white border border-ivory-dark p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy/5"
            >
              <a.icon size={26} className="text-burgundy mb-4" />
              <h3 className="font-bold text-ink text-lg mb-3">{a.title}</h3>
              <p className="text-warm-brown text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-burgundy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-gold-light text-xs tracking-widest mb-4">
            الكتاب والمهتمون بالسرد
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-ivory leading-snug mb-6 max-w-xl mx-auto">
            من قارئ مجنون إلى كاتب محتفي — مساحة للمبتدئ والمحترف على حد سواء.
          </h2>
          <div className="editorial-divider mx-auto mb-6 bg-gold-light/70" />
          <p className="text-ivory/80 text-sm md:text-base leading-loose max-w-2xl mx-auto">
            يفتح نادي القصة أبوابه لعشّاق القصة والرواية: الكتّاب يتركون نصوصهم
            تتنفس أمام جمهور حيّ، والمهتمّون يكتشفون عالم السرد من قربه،
            منصتين إلى الأصوات التي تصنع المشهد الأدبي الجديد.
          </p>
        </div>
      </section>
    </div>
  );
}