import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, Library, Globe, FileText, Award, ExternalLink } from 'lucide-react';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { usePublicStatsQuery } from '../../Hooks/public/queries/usePublicStatsQuery';
import { PublicStatCard } from '../../Components/public/PublicStatCard';
import { SUCCESS_STORIES } from '../../constants/home.constants';

export default function Home() {
  const { user } = useAuth();
  const { data: stats } = usePublicStatsQuery();
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
              { step: '٢', title: 'تطوع في التسجيل الصوتي أو التحويل لوورد أو المرافقة', desc: 'يتولى المتطوعون تسجيل الكتب صوتياً أو تحويلها إلى ملفات وورد.' },
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
      <section className="py-16 px-4 bg-primary-600 text-white" aria-label="إحصاءات المشروع">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold text-center">المنصة بالأرقام</h2>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <PublicStatCard icon={Users} value={stats.totalVolunteers} label="متطوع" />
              <PublicStatCard icon={BookOpen} value={stats.totalRequests} label="طلب مساعدة" />
              <PublicStatCard icon={CheckCircle} value={stats.completedRequests} label="طلب مكتمل" />
              <PublicStatCard icon={Library} value={stats.libraryItems} label="مادة في المكتبة" />
            </div>
          )}

          <div className="border-t border-white/20 pt-10 space-y-6">
            <p className="text-center text-primary-200 font-semibold text-lg">إنجازات 2025</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <PublicStatCard icon={BookOpen} value="1,348" label="كتاب" />
              <PublicStatCard icon={FileText} value="243,436" label="صفحة" />
              <PublicStatCard icon={Award} value="8,369" label="فرصة تطوعية" />
              <PublicStatCard icon={Users} value="82" label="طالب كفيف جديد" />
              <PublicStatCard icon={Users} value="1,082" label="إجمالي الطلاب المكفوفين" />
              <PublicStatCard icon={Globe} value="25" label="دولة" />
              <PublicStatCard icon={CheckCircle} value="112" label="شهادة تطوع" />
              <PublicStatCard icon={CheckCircle} value="126" label="شهادة شكر" />
            </div>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 px-4 bg-white" aria-label="قصص النجاح">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">قصص نجاح</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUCCESS_STORIES.map((s) => (
              <blockquote key={s.name} className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4">
                <p className="text-gray-700 leading-relaxed flex-1">"{s.text}"</p>
                <footer className="flex items-end justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-primary-600">— {s.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.achievement}</div>
                  </div>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors shrink-0"
                    aria-label={`المنشور الأصلي لـ${s.name}`}
                  >
                    <ExternalLink size={12} />
                    المنشور
                  </a>
                </footer>
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
