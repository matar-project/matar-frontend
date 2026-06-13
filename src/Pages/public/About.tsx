import { Award, Users, Globe, BookOpen, FileText, Truck, PhoneCall } from 'lucide-react';

const TEN_YEAR_STATS = [
  { icon: Award, value: '128,591', label: 'فرصة تطوعية إجمالية' },
  { icon: Users, value: '1,114', label: 'مكفوف مستفيد' },
  { icon: Globe, value: '18', label: 'دولة وصلنا إليها' },
  { icon: BookOpen, value: '10,419', label: 'كتاب مسجّل أو مطبوع' },
  { icon: FileText, value: '2,072,830', label: 'صفحة طُبعت أو سُجّلت' },
  { icon: Truck, value: '45', label: 'موزّع' },
  { icon: PhoneCall, value: '671', label: 'طلب مرافقة' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">عن مشروع مطر</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          إعطاء المكفوفين الفرصة التعليمية والثقافية المتكافئة
        </p>
      </header>

      <section aria-label="قصتنا" className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">قصتنا</h2>
        <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            بدأ مشروع مطر كمبادرة أردنية صغيرة انطلقت من إيمان راسخ بأن التعليم حق لكل إنسان بصرف النظر
            عن قدراته البصرية. أطلقنا تطبيقاً في الفترة ما بين عامَي 2019 و2020 شكّل نواة هذه الرحلة،
            إذ أتاح للمتطوعين حجز أجزاء من الكتب والمساهمة في تحويلها إلى صيغ يسهل على المكفوفين الوصول إليها.
          </p>
          <p>
            اليوم نواصل هذه الرسالة بمنصة أكثر نضجاً وأوسع نطاقاً، تربط من يحتاج إلى المساعدة بمن يريد
            تقديمها، وتبني مكتبة متنامية من المواد التعليمية والثقافية المتاحة مجاناً لكل مستفيد.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'رسالتنا',
            text: 'توفير فرص تعليمية وثقافية متكافئة للمكفوفين وضعاف البصر عبر تحويل المواد إلى صيغ يسهل الوصول إليها.',
          },
          {
            title: 'رؤيتنا',
            text: 'عالم لا يحول فيه ضعف البصر دون الوصول إلى المعرفة والتعليم والثقافة.',
          },
          {
            title: 'قيمنا',
            text: 'المساواة في الفرص، التطوع من القلب، الشفافية، الاستدامة، والعمل الجماعي.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-primary-50 rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-primary-800">{item.title}</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      <section aria-label="أثرنا" className="space-y-10">
        <h2 className="text-2xl font-bold text-gray-900">أثرنا حتى الآن</h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          بدأنا بخمسة متطوعين عام 2013 ووصلنا إلى 33,278 فرصة تطوعية في عام 2022 وحده، لنُحقق إجمالياً خلال العقد:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEN_YEAR_STATS.map((s) => (
            <div key={s.label} className="bg-primary-50 rounded-xl p-5 text-center space-y-2">
              <s.icon className="mx-auto text-primary-600" size={28} aria-hidden="true" />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
