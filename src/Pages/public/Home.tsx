import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, CheckCircle, Library } from 'lucide-react';
import { requestsApi } from '../../api/requests';
import { Button } from '../../Components/ui/Button';
import { useAuth } from '../../Hooks/auth/UseAuth';

function StatCard({ icon: Icon, value, label }: { icon: any; value: number | string; label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <Icon className="mx-auto mb-3 text-primary-600" size={32} aria-hidden="true" />
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
        className="bg-gradient-to-bl from-primary-700 via-primary-600 to-primary-800 text-white py-20 px-4"
        aria-label="قسم الترحيب"
      >
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
                className="px-7 py-4 text-lg font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white bg-white text-primary-700 hover:bg-primary-50 inline-flex items-center justify-center"
                aria-label="اطلب مساعدة من مشروع مطر"
              >
                اطلب مساعدة
              </Link>
            )}
            {canVolunteer && (
              <Link
                to="/volunteer-dashboard/application"
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
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto" aria-hidden="true">
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
        <section className="py-16 px-4 bg-primary-700 text-white" aria-label="إحصاءات المشروع">
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
                <footer className="text-sm font-medium text-primary-700">— {s.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-secondary-600 text-white" aria-label="دعوة للمشاركة">
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
                to="/volunteer-dashboard/application"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-center"
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
