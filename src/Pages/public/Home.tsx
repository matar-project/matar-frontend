import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, CheckCircle, Library, type LucideIcon } from 'lucide-react';
import { requestsApi } from '../../api/requests';
import { useAuth } from '../../Hooks/auth/UseAuth';

function StatCard({ icon: Icon, value, label }: { icon: LucideIcon; value: number | string; label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <Icon className="mx-auto mb-3 text-secondary-500" size={32} aria-hidden="true" />
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

const stories = [
  { name: 'أحمد م.', text: 'بفضل مشروع مطر حصلت على كتبي الدراسية بصيغة صوتية وتمكنت من النجاح في امتحاناتي.' },
  { name: 'سارة خ.', text: 'انضممت كمتطوعة وشعرت بالفرق الحقيقي الذي يصنعه التطوع في حياة شخص آخر.' },
  { name: 'محمد ع.', text: 'وجدت في مكتبة مطر مواد تعليمية لم أجدها في أي مكان آخر بصيغة يسهل عليّ قراءتها.' },
];

export default function Home() {
  const { user } = useAuth();
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: requestsApi.getStats });
  const canRequestHelp = user?.role === 'visually_impired';
  const canVolunteer = user?.role === 'volunteer';

  return (
    <div>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
      >
        انتقل إلى المحتوى الرئيسي
      </a>

      {/* Hero */}
      <section
        className="bg-primary-600 text-white py-20 px-4 relative overflow-hidden"
        aria-label="قسم الترحيب"
      >
        {/* Decorative multi-color bar strip — echoes the logo mark */}
        <div className="absolute bottom-0 left-0 right-0 flex h-2" aria-hidden="true">
          <div className="flex-1 bg-matar-red" />
          <div className="flex-1 bg-matar-orangeRed" />
          <div className="flex-1 bg-matar-amber" />
          <div className="flex-1 bg-matar-orange" />
          <div className="flex-1 bg-matar-darkGreen" />
          <div className="flex-1 bg-matar-green" />
          <div className="flex-1 bg-matar-teal" />
          <div className="flex-1 bg-matar-tealGreen" />
          <div className="flex-1 bg-matar-blue" />
          <div className="flex-1 bg-matar-purple" />
          <div className="flex-1 bg-matar-lavender" />
          <div className="flex-1 bg-matar-hotPink" />
          <div className="flex-1 bg-matar-pinkRed" />
          <div className="flex-1 bg-matar-darkRed" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            مشروع مطر
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            إعطاء المكفوفين الفرصة التعليمية والثقافية المتكافئة
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {canRequestHelp && (
              <Link
                to="/vi/requests"
                className="px-7 py-4 text-lg font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white bg-white text-primary-600 hover:bg-primary-50 inline-flex items-center justify-center"
                aria-label="اطلب مساعدة من مشروع مطر"
              >
                اطلب مساعدة
              </Link>
            )}
            {canVolunteer && (
              <Link
                to="/volunteer-dashboard/opportunities"
                className="px-7 py-4 text-lg font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white border-2 border-white text-white hover:bg-primary-700 inline-flex items-center justify-center"
                aria-label="انضم كمتطوع في مشروع مطر"
              >
                تطوع معنا
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white" aria-label="رسالتنا">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">رسالتنا</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            نؤمن بأن التعليم حق للجميع. مشروع مطر مبادرة أردنية غير ربحية تعمل على تحويل المواد التعليمية
            إلى صيغ يسهل الوصول إليها للمكفوفين وضعاف البصر، من خلال شبكة متطوعين متفانين.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50" aria-label="كيف يعمل مطر">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">كيف يعمل مطر؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '١', title: 'طلب المساعدة', desc: 'يطلب المستفيد الكتاب أو المادة التعليمية التي يحتاجها عبر نموذج بسيط.' },
              { step: '٢', title: 'تطوع وتحويل', desc: 'يتولى المتطوعون تسجيل الكتب صوتياً أو تحويلها إلى صيغة نصية سهلة القراءة.' },
              { step: '٣', title: 'إتاحة المواد', desc: 'تُضاف المواد المحوّلة إلى المكتبة لتستفيد منها أوسع شريحة ممكنة.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto" aria-hidden="true">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-16 px-4 bg-primary-600 text-white" aria-label="إحصاءات المشروع">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">أثرنا</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={Users} value={stats.totalVolunteers} label="متطوع" />
              <StatCard icon={BookOpen} value={stats.totalRequests} label="طلب مساعدة" />
              <StatCard icon={CheckCircle} value={stats.completedRequests} label="طلب مكتمل" />
              <StatCard icon={Library} value={stats.libraryItems} label="مادة في المكتبة" />
            </div>
          </div>
        </section>
      )}

      {/* Stories */}
      <section className="py-16 px-4 bg-white" aria-label="قصص النجاح">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">قصص نجاح</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s) => (
              <blockquote key={s.name} className="bg-gray-50 rounded-xl p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">"{s.text}"</p>
                <footer className="text-sm font-medium text-primary-600">— {s.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-secondary-500 text-white relative overflow-hidden" aria-label="دعوة للمشاركة">
        {/* Top accent strip */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5" aria-hidden="true">
          <div className="flex-1 bg-matar-red" />
          <div className="flex-1 bg-matar-amber" />
          <div className="flex-1 bg-matar-green" />
          <div className="flex-1 bg-matar-navy" />
          <div className="flex-1 bg-matar-purple" />
          <div className="flex-1 bg-matar-hotPink" />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">انضم إلى مجتمع مطر</h2>
          <p className="text-secondary-100 text-lg">
            سواء كنت تبحث عن مساعدة أو تريد تقديمها — مطر هو مكانك.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {canRequestHelp && (
              <Link
                to="/vi/requests"
                className="px-8 py-4 bg-white text-secondary-700 font-semibold rounded-xl hover:bg-secondary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-center"
              >
                اطلب مساعدة
              </Link>
            )}
            {canVolunteer && (
              <Link
                to="/volunteer-dashboard/opportunities"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-center"
              >
                تطوع معنا
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
