import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FaqAccordion } from '@/components/FaqAccordion';
import { JsonLd } from '@/components/JsonLd';
import { DecoratorTool } from '@/components/tools/DecoratorTool';
import { CardsTool } from '@/components/tools/CardsTool';
import { InvisibleTool, SymbolsTool } from '@/components/tools/StaticTools';
import { SYMBOL_GROUPS } from '@/lib/zakhrafa';
import { footerSitemap, headerDropdowns, site } from '@/lib/site';
import { flatNav } from '@/lib/urls';
import type { Faq, FooterCol } from '@/lib/types';

const HOME_TITLE = 'زخرفة اسماء | مولّد أسماء مزخرفة عربية وإنجليزية مجاناً';
const HOME_DESC =
  'زخرفة اسماء عربية وإنجليزية فورية ومجانية: حوّل اسمك إلى عشرات الأشكال المزخرفة الجاهزة للنسخ لببجي وفري فاير وإنستغرام وتيك توك. بدون تسجيل.';
const HOME_OG_DESC =
  'حوّل اسمك إلى عشرات الأشكال المزخرفة الجاهزة للنسخ: عربي وإنجليزي، للألعاب وحسابات التواصل. مجاناً وبدون تسجيل.';

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  /* canonical + og:url are rendered manually below to preserve the exact
     original form (trailing slash, unencoded). */
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    title: HOME_TITLE,
    description: HOME_OG_DESC,
  },
  twitter: { card: 'summary', title: HOME_TITLE, description: HOME_OG_DESC },
  verification: { google: 'sKKQNX_-59WYf8Yt9_DSysOLEI9rWd0SH7mjYeJz3r0' },
};

/* Visible FAQs (answers match the on-page text exactly). */
const FAQS: Faq[] = [
  {
    q: 'هل الأسماء المزخرفة نص حقيقي أم صور؟',
    a: 'نص حقيقي من أحرف اليونيكود، لذلك يمكنك تحديده ونسخه ولصقه في الألعاب والنبذات والمحادثات. قد تظهر بعض الرموز النادرة كمربعات فارغة على الأجهزة التي لا تملك خطاً يدعمها.',
  },
  {
    q: 'هل تعمل الزخرفة في ببجي وفري فاير؟',
    a: 'نعم في الغالب. اختر الأنماط الحاملة لشارة «للألعاب» فهي قليلة الرموز وأعلى قبولاً، وتذكّر أن كل رمز يُحتسب ضمن الحد المسموح لعدد الأحرف في اللعبة.',
  },
  {
    q: 'هل تدعم الأداة الأسماء العربية؟',
    a: 'نعم. تكتشف الأداة اللغة تلقائياً وتعرض أنماط التطويل والتشكيل الزخرفي والعلامات العلوية والتأطير بالرموز للأسماء العربية.',
  },
  {
    q: 'لماذا يظهر اسمي المزخرف على شكل مربعات فارغة؟',
    a: 'لأن الخط المثبت على جهاز المشاهد لا يحتوي على شكل ذلك الرمز. الحل هو الالتزام بالأنماط الأساسية كالعريض والمائل والدوائر، وتجربة الاسم في محادثة عادية قبل تثبيته.',
  },
  {
    q: 'لماذا ترفض اللعبة أو التطبيق اسمي المزخرف؟',
    a: 'بعض المنصات تنظّف حقل الاسم وتحذف الرموز غير المعتادة، خاصة في اسم المستخدم الذي يقبل الحروف اللاتينية والأرقام فقط. جرّب نمطاً أبسط قليل الرموز.',
  },
  {
    q: 'ما الفرق بين اسم العرض واسم المستخدم؟',
    a: 'اسم العرض والنبذة يقبلان الزخرفة والرموز في معظم المنصات، أما اسم المستخدم (@) فيقتصر غالباً على الحروف اللاتينية والأرقام والشرطة السفلية.',
  },
  {
    q: 'ما هي الأحرف المخفية وفيما تُستخدم؟',
    a: 'أحرف يونيكود موجودة فعلاً لكنها لا تُرى بالعين، تُستخدم لصنع اسم فارغ في الألعاب أو سطر فارغ في النبذة. انسخها من قسم الأحرف المخفية وتحقق من شروط منصتك أولاً.',
  },
  {
    q: 'هل يمكنني زخرفة الأرقام أيضاً؟',
    a: 'نعم. للأرقام أشكال بديلة في اليونيكود كالعريض والدوائر والمتباعد، فتستطيع تنسيق سنة ميلادك أو رقمك المفضل بنفس طابع اسمك المزخرف.',
  },
  {
    q: 'هل أداة زخرفة اسماء مجانية؟ وهل تُحفظ أسمائي؟',
    a: 'نعم، مجانية بالكامل بلا تسجيل ولا حدود لعدد الأسماء. وكل المعالجة تجري داخل متصفحك، فلا يُرسل اسمك إلى أي خادم ولا يُحفظ في أي مكان.',
  },
  {
    q: 'هل تعمل الأسماء المزخرفة على الآيفون والأندرويد؟',
    a: 'نعم على كليهما لأن النتيجة نص يونيكود قياسي لا تطبيق خاص. قد يختلف شكل بعض الرموز قليلاً بين النظامين، لكن الأنماط الأساسية تظهر بشكل موحد.',
  },
];

const HEADER_LINKS = [
  { label: 'المولّد', href: '#tool' },
  { label: 'الرموز', href: '#symbols' },
  { label: 'الأحرف المخفية', href: '#invisible' },
  { label: 'طريقة الاستخدام', href: '#how' },
  { label: 'الأسئلة الشائعة', href: '#faq' },
];

const FOOTER_COLS: FooterCol[] = [
  {
    title: 'أقسام الموقع',
    links: [
      { label: 'مولّد الزخرفة', href: '#tool' },
      { label: 'مكتبة الرموز', href: '#symbols' },
      { label: 'الأحرف المخفية', href: '#invisible' },
      { label: 'الأسئلة الشائعة', href: '#faq' },
    ],
  },
  {
    title: 'أدلة الاستخدام',
    links: [
      { label: 'طريقة الاستخدام', href: '#how' },
      { label: 'حل مشكلة المربعات', href: '#fix' },
      { label: 'نصائح قبل التثبيت', href: '#tips' },
      { label: 'المنصات المدعومة', href: '#where' },
    ],
  },
];

const FOOTER_ABOUT =
  'منصة زخرفة اسماء مجانية تجمع مولّد الزخرفة الفورية ومكتبة الرموز والأحرف المخفية في صفحة واحدة سريعة بالعربية، لكل لاعب ومبدع يريد لاسمه أن يليق به.';

const SECTION_CARDS = [
  {
    href: '/مولد-اسماء-مزخرفة.html',
    h: 'مولد الأسماء المزخرفة',
    p: 'الأداة الرئيسية: عشرات الأنماط لأي اسم.',
  },
  {
    href: '/العاب.html',
    h: 'زخرفة أسماء الألعاب',
    p: 'ببجي، فري فاير، فالورانت وأكثر — 12 صفحة.',
  },
  {
    href: '/تواصل-اجتماعي.html',
    h: 'زخرفة حسابات التواصل',
    p: 'انستقرام، تيك توك، واتساب وأكثر — 10 صفحات.',
  },
  {
    href: '/خطوط.html',
    h: 'الخطوط المزخرفة',
    p: '11 خطاً بمحوّل حي لكل منها.',
  },
  {
    href: '/رموز.html',
    h: 'مكتبة الرموز',
    p: 'مئات الرموز الجاهزة للنسخ.',
  },
  {
    href: '/تصاميم-جاهزة.html',
    h: 'تصاميم الأسماء الجاهزة',
    p: '8 بطاقات فنية باسمك للتحميل.',
  },
  {
    href: '/ادوات.html',
    h: 'كل الأدوات',
    p: 'الأحرف المخفية، مولد أسماء المستخدمين والمزيد.',
  },
  {
    href: '/مدونة.html',
    h: 'المدونة',
    p: 'أدلة ونصائح حول زخرفة الأسماء.',
  },
];

export default function Home() {
  return (
    <>
      {/* Exact canonical / og:url (original form with trailing slash) */}
      <link rel="canonical" href="https://zakhraafatasmasa.com/" />
      <meta property="og:url" content="https://zakhraafatasmasa.com/" />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'زخرفة أسماء',
          url: `${site.baseUrl}/`,
          inLanguage: 'ar',
          description: 'مولّد أسماء مزخرفة عربية وإنجليزية مجاناً للألعاب وحسابات التواصل.',
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: HOME_TITLE,
          url: `${site.baseUrl}/`,
          inLanguage: 'ar',
          description: 'زخرفة اسماء عربية وإنجليزية فورية ومجانية مع عشرات الأنماط الجاهزة للنسخ.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'الرئيسية',
                item: `${site.baseUrl}/`,
              },
            ],
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: 'ar',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      {/* Google tag (gtag.js) — preserved from the deployed homepage */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-E59LD041MQ"
        strategy="afterInteractive"
      />
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E59LD041MQ');
        `}
      </Script>

      <SiteHeader links={[...HEADER_LINKS, ...flatNav(headerDropdowns)]} logoHref="#top" />

      <main id="top">
        <section className="hero">
          <div className="container">
            <h1>
              زخرفة اسماء <span className="hl">عربية وإنجليزية</span> في ثوانٍ
            </h1>
            <p className="lead">
              اكتب اسمك في المربع وستحصل فوراً على عشرات الأشكال المزخرفة الجاهزة للنسخ. أداة
              زخرفة اسماء مجانية بالكامل، تعمل داخل متصفحك دون تسجيل، وتصلح للألعاب وحسابات
              التواصل والنبذات.
            </p>
          </div>
        </section>

        <section className="block" id="tool" style={{ paddingTop: 0 }}>
          <div className="container">
            <DecoratorTool
              placeholder="اكتب اسمك هنا… مثال: محمد أو Ayaan"
              srHeading="مولّد زخرفة الاسماء الفوري"
            />
            <div style={{ marginTop: '1.2rem' }}>
              <div className="chips" aria-label="عمليات بحث شائعة">
                <Link className="chip" href="#where">
                  زخرفة اسماء ببجي
                </Link>
                <Link className="chip" href="#tool">
                  اسم مزخرف
                </Link>
                <Link className="chip" href="#symbols">
                  رموز جمالية
                </Link>
                <Link className="chip" href="#invisible">
                  أحرف مخفية
                </Link>
                <Link className="chip" href="#what">
                  زخرفة حروف
                </Link>
                <Link className="chip" href="#where">
                  زخرفة اسماء فري فاير
                </Link>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="designs">
          <div className="container">
            <div className="section-head">
              <span className="kicker">معرض التصاميم</span>
              <h2>تصاميم جاهزة باسمك</h2>
              <p>
                اكتب اسمك مرة واحدة وشاهده فوراً على تصاميم فنية متنوعة — ثم حمّل التصميم الذي
                يعجبك كصورة PNG لمشاركته.
              </p>
            </div>
            <CardsTool
              mode="featured"
              note={false}
              cta={
                <div className="cards-cta">
                  <Link className="btn-link" href="/تصاميم-جاهزة.html">
                    عرض كل التصاميم الثمانية ←
                  </Link>
                </div>
              }
            />
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="symbols">
          <div className="container">
            <div className="section-head">
              <span className="kicker">مكتبة الرموز</span>
              <h2>رموز جاهزة للنسخ لتزيين اسمك</h2>
              <p>
                اضغط على أي رمز لنسخه فوراً، ثم الصقه قبل اسمك أو بعده. هذه الرموز هي الوسيلة
                الأساسية لتزيين الأسماء العربية لأنها تعمل مع كل اللغات.
              </p>
            </div>
            <div id="symbolsWrap">
              <SymbolsTool groups={SYMBOL_GROUPS} bare />
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="invisible">
          <div className="container">
            <div className="section-head">
              <span className="kicker">حيلة مشهورة</span>
              <h2>الأحرف المخفية: اسم فارغ في الألعاب</h2>
              <p>
                حرف موجود فعلاً لكنه لا يُرى بالعين. يُستخدم لصنع اسم فارغ في الألعاب، أو سطر
                فارغ داخل النبذة، أو رسالة تبدو خالية. اضغط الزر لنسخ الحرف.
              </p>
            </div>
            <div className="invisible-wrap" id="invisibleWrap">
              <InvisibleTool bare />
            </div>
            <div className="tip-box" style={{ maxWidth: 780, marginInline: 'auto' }}>
              <strong>تنبيه:</strong> تقبل بعض الألعاب هذه الأحرف وتمنعها ألعاب أخرى، جرّبها في
              حساب تجريبي أولاً قبل تغيير اسمك الأساسي.
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="what">
          <div className="container">
            <div className="section-head">
              <span className="kicker">تعريف</span>
              <h2>ما هي زخرفة الاسماء؟</h2>
            </div>
            <div className="article">
              <p>
                زخرفة اسماء هي فن تحويل النص العادي إلى أشكال لافتة للنظر باستخدام أحرف يونيكود
                بديلة ورموز تزيينية، فيتحوّل اسمك من حروف عادية إلى توقيع بصري يميّزك في الألعاب
                وحسابات التواصل والنبذات. النتيجة ليست صورة بل نصاً حقيقياً: يمكنك تحديده ونسخه
                ولصقه في أي خانة تقبل الكتابة.
              </p>
              <p>
                الفكرة بسيطة في جوهرها. يضم معيار يونيكود كتلاً كاملة من الحروف البديلة للحروف
                اللاتينية — العريض والمائل والمخطوط والقوطي والمزدوج الخط — فيظهر الاسم نفسه
                بأشكال مختلفة تماماً دون أن يتغيّر معناه. أما الأسماء العربية فلها طريقتها الخاصة:
                حرف التطويل (ـ) الذي يمدّ الوصل بين الحروف، والتشكيل الزخرفي الذي يُلبس الحروف
                حركات متتابعة، والتأطير برموز توضع حول الاسم من الجهتين.
              </p>
              <h3>لماذا تبدو بعض الأنماط مختلفة جذرياً عن الأصل؟</h3>
              <p>
                لأن بعض الأنماط لا تكتفي بتجميل الحرف بل تستبدله برمز بديل من جدول آخر في
                اليونيكود. حرف A العادي وحرف 𝐀 العريض وحرف 𝓐 المخطوط ثلاثة رموز مختلفة تماماً
                للحاسوب، وإن بدت متقاربة للعين. هذا هو سر عمل الزخرفة في أماكن لا تمنحك أي خيار
                لتغيير الخط: أنت لا تغيّر الخط أصلاً، بل تكتب بحروف أخرى.
              </p>
              <h3>هل يؤثر النمط على إمكانية البحث عن اسمك؟</h3>
              <p>
                نعم، وهذه نقطة يغفل عنها كثيرون. الأنماط التي تستبدل الحروف — كالخط القوطي أو
                المزدوج — أو تضيف علامات فوق الحروف العربية، تجعل اسمك نصاً مختلفاً عن الأصل،
                فلا يعثر عليك من يبحث بالاسم العادي. لذلك نضع شارة «يغيّر الحروف» على كل نمط من
                هذا النوع، لتعرف الفرق قبل أن تختار. إن كانت سهولة الوصول إليك مهمة، التزم
                بالتطويل والتأطير بالرموز فهما يُبقيان اسمك نصاً قابلاً للبحث.
              </p>
              <div className="tip-box">
                <strong>معلومة:</strong> تجري كل المعالجة داخل متصفحك عبر جافاسكربت خالص؛ الاسم
                الذي تكتبه لا يُرسل إلى أي خادم ولا يُحفظ في أي قاعدة بيانات، وهذا سبب سرعة
                الأداة وخصوصيتها.
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="how">
          <div className="container">
            <div className="section-head">
              <span className="kicker">خطوة بخطوة</span>
              <h2>كيف تستخدم أداة زخرفة اسماء؟</h2>
              <p>خمس خطوات لا تستغرق أكثر من نصف دقيقة، بلا تسجيل ولا تنزيل أي تطبيق.</p>
            </div>
            <div className="steps">
              {[
                {
                  h: 'اكتب اسمك',
                  p: 'أدخل اسمك بالعربية أو الإنجليزية في الحقل أعلى الصفحة، وستتولّد الأنماط تلقائياً مع كل حرف تكتبه.',
                },
                {
                  h: 'صفِّ الأنماط',
                  p: 'استخدم أزرار التصفية لعرض الأنماط العربية أو الإنجليزية فقط، أو اقتصر على الأنماط المناسبة للألعاب.',
                },
                {
                  h: 'اختر ما يناسب المكان',
                  p: 'الأنماط البسيطة قليلة الرموز أنسب لأسماء الألعاب، والمؤطّرة بالرموز أنسب للنبذات وحسابات التواصل.',
                },
                {
                  h: 'انسخ بضغطة واحدة',
                  p: 'اضغط زر «نسخ» بجانب النمط الذي يعجبك، أو زر «نسخ كل الأنماط» لحفظها جميعاً دفعة واحدة.',
                },
                {
                  h: 'الصقه في مكانه',
                  p: 'افتح اللعبة أو التطبيق والصق الاسم في خانة الاسم أو النبذة. في الجوال اضغط مطوّلاً على الحقل ثم اختر «لصق».',
                },
              ].map((s) => (
                <div className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="why">
          <div className="container">
            <div className="section-head">
              <span className="kicker">الدافع</span>
              <h2>لماذا يزخرف الناس أسماءهم؟</h2>
              <p>
                لماذا يتجه ملايين اللاعبين والمستخدمين إلى زخرفة اسماء؟ الدوافع تختلف، لكن هذه
                الأسباب هي الأكثر تكراراً.
              </p>
            </div>
            <div className="cards">
              {[
                {
                  icon: '✨',
                  h: 'التميّز وسط التشابه',
                  p: 'قد يحمل آلاف الأشخاص الاسم نفسه؛ الشكل المختلف للحروف يجعل حسابك يبرز فوراً من بين الحشود.',
                },
                {
                  icon: '🎮',
                  h: 'حضور أقوى في الألعاب',
                  p: 'اسمك يظهر في شاشة النتائج أمام كل اللاعبين؛ الاسم المؤطّر بالرموز يُلاحَظ ويُتذكَّر أكثر من الاسم العادي.',
                },
                {
                  icon: '💎',
                  h: 'حساب أجمل',
                  p: 'اسم العرض الأنيق يرفع مستوى ملفك الشخصي، ويجعل نبذتك أكثر جاذبية للزائر الجديد من أول نظرة.',
                },
                {
                  icon: '🔓',
                  h: 'تجاوز الاسم المحجوز',
                  p: 'إذا رفضت المنصة اسمك لأنه مستخدم من قبل، فتغيير شكل الحروف بالزخرفة كثيراً ما يحل المشكلة.',
                },
                {
                  icon: '🛡️',
                  h: 'هوية موحّدة للفريق',
                  p: 'رمز مشترك يضعه كل أعضاء القبيلة حول أسمائهم يبني انتماءً واضحاً يراه الخصوم والحلفاء معاً.',
                },
                {
                  icon: '🎨',
                  h: 'المتعة والتجربة',
                  p: 'تجربة عشرات الأشكال حتى تجد ما يشبه شخصيتك أمر ممتع بحد ذاته، ولا يكلّف شيئاً على الإطلاق.',
                },
              ].map((c) => (
                <div className="info-card" key={c.h}>
                  <span className="icon">{c.icon}</span>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="where">
          <div className="container">
            <div className="section-head">
              <span className="kicker">التوافق</span>
              <h2>أين تعمل الأسماء المزخرفة؟</h2>
              <p>
                تعمل الزخرفة في أي حقل يقبل النص. هذه أشهر المنصات التي يستخدمها زوّار الموقع،
                من ألعاب مثل ببجي وفري فاير إلى حسابات التواصل:
              </p>
            </div>
            <div className="chips">
              {[
                'ببجي موبايل',
                'فري فاير',
                'فالورانت',
                'روبلوكس',
                'ماينكرافت',
                'إنستغرام',
                'تيك توك',
                'واتساب',
                'ديسكورد',
                'سناب شات',
                'تيليجرام',
                'فيس بوك',
              ].map((c) => (
                <span className="chip" key={c}>
                  {c}
                </span>
              ))}
            </div>
            <div className="tip-box" style={{ maxWidth: 780, margin: '1.6rem auto 0' }}>
              <strong>ملاحظة مهمة:</strong> الزخرفة تعمل في اسم العرض والنبذة في معظم المنصات،
              أما اسم المستخدم (@) فيقبل الحروف اللاتينية والأرقام فقط غالباً، فأبقه بسيطاً
              ليسهل البحث عنك.
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="fix">
          <div className="container">
            <div className="section-head">
              <span className="kicker">حل المشكلات</span>
              <h2>لماذا يظهر الاسم مربعات أو يُرفض؟</h2>
              <p>
                أكثر سؤالين يصلان إلى أي موقع زخرفة اسماء هما: «لماذا يظهر اسمي مربعات فارغة؟»
                و«لماذا ترفض اللعبة الاسم؟». المشكلتان مختلفتان تماماً في السبب والحل.
              </p>
            </div>
            <div className="article">
              <h3>مشكلة المربعات الفارغة ▯</h3>
              <p>
                المربع الفارغ ليس خطأً في اسمك، بل رسالة من جهاز <em>المشاهد</em>: الخط المثبت
                على هاتفه لا يملك شكلاً مرسوماً لذلك الرمز فيعرض مربعاً بديلاً. قد يظهر اسمك
                سليماً على جهازك ومربعات على جهاز صديقك لأن الخطوط مختلفة بين الأجهزة.
              </p>
              <p>
                الحل: التزم بالأنماط المبنية على العائلات الأساسية المدعومة في كل مكان تقريباً —
                العريض والمائل والدوائر — وتجنّب الأنماط المليئة برموز نادرة إن كان جمهورك واسعاً
                ومتنوع الأجهزة.
              </p>
              <h3>مشكلة رفض الاسم</h3>
              <p>
                الرفض شيء آخر تماماً: بعض المنصات تنظّف حقل الاسم فتحذف الرموز غير المعتادة أو
                ترفض الحفظ من الأساس. اسم المستخدم هو الأصعب دائماً لأنه يقبل الحروف اللاتينية
                والأرقام فقط في معظم المنصات، بينما اسم العرض والنبذة أكثر تسامحاً بكثير.
              </p>
              <p>
                إن رُفض الاسم في لعبة، جرّب نمطاً أقل رموزاً من قسم «مناسب للألعاب»، وتذكّر أن
                كل رمز زخرفي يُحتسب ضمن الحد المسموح لعدد الأحرف.
              </p>
              <h3>القاعدة الذهبية: جرّب قبل أن تثبّت</h3>
              <p>
                قبل تثبيت أي اسم مهم، الصقه في محادثة عادية أو خانة بحث وانظر: إن ظهر سليماً بلا
                مربعات فهو آمن للعرض، وإن ظهرت مربعات فاختر نمطاً أبسط. هذه الخطوة الواحدة تكشف
                أغلب المشكلات قبل حدوثها أمام الآخرين.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="tips">
          <div className="container">
            <div className="section-head">
              <span className="kicker">نصائح عملية</span>
              <h2>ست قواعد قبل تثبيت اسمك المزخرف</h2>
            </div>
            <div className="article">
              <ol>
                <li>
                  <strong>ابدأ بالبسيط:</strong> الأنماط البسيطة قليلة الرموز أعلى قبولاً في
                  الألعاب من المؤطرة بكثافة.
                </li>
                <li>
                  <strong>احسب الرموز:</strong> كل رمز زخرفي يُحتسب حرفاً ضمن الحد المسموح في
                  اللعبة أو التطبيق، فلا تُسرف.
                </li>
                <li>
                  <strong>اختبر أولاً:</strong> جرّب الاسم في محادثة عادية للتأكد من ظهور كل
                  الرموز قبل تثبيته رسمياً.
                </li>
                <li>
                  <strong>أبقِ اسم المستخدم عادياً:</strong> ليسهل على الآخرين البحث عنك ومشاركة
                  حسابك.
                </li>
                <li>
                  <strong>التزم بالتناسق:</strong> رمزان متماثلان على الجانبين أجمل من تكديس خمسة
                  رموز مختلفة.
                </li>
                <li>
                  <strong>احفظ نسخة عادية:</strong> بعض التطبيقات تبحث بالنص العادي فقط، فاحتفظ
                  باسمك الأصلي جانباً.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="features">
          <div className="container">
            <div className="section-head">
              <span className="kicker">المميزات</span>
              <h2>لماذا تختار هذه الأداة؟</h2>
            </div>
            <div className="cards">
              {[
                {
                  icon: '🆓',
                  h: 'مجانية بالكامل',
                  p: 'لا رسوم ولا اشتراكات ولا تسجيل دخول؛ أنشئ عدداً غير محدود من الأسماء المزخرفة.',
                },
                {
                  icon: '⚡',
                  h: 'زخرفة فورية',
                  p: 'تظهر النتائج مع كل حرف تكتبه دون انتظار، حتى على شبكات الهاتف البطيئة.',
                },
                {
                  icon: '🌍',
                  h: 'عربي وإنجليزي',
                  p: 'تكتشف الأداة لغتك تلقائياً وتطبّق أسلوب الزخرفة الصحيح لكل لغة.',
                },
                {
                  icon: '📱',
                  h: 'كل الأجهزة',
                  p: 'الهواتف والأجهزة اللوحية والحواسيب بواجهة واحدة سريعة ومتجاوبة بالكامل.',
                },
                {
                  icon: '🔒',
                  h: 'خصوصية كاملة',
                  p: 'تُعالَج الأسماء داخل متصفحك ولا تُرسَل إلى أي خادم ولا تُحفظ في أي مكان.',
                },
                {
                  icon: '🧩',
                  h: 'أكثر من أداة',
                  p: 'مولّد الزخرفة، ومكتبة الرموز، والأحرف المخفية — كل ما تحتاجه في صفحة واحدة.',
                },
              ].map((c) => (
                <div className="info-card" key={c.h}>
                  <span className="icon">{c.icon}</span>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="sections">
          <div className="container">
            <div className="section-head">
              <span className="kicker">تصفح الموقع</span>
              <h2>كل أقسام زخرفة الأسماء</h2>
              <p>اختر وجهتك: ألعاب، منصات تواصل، خطوط، أدوات والمزيد.</p>
            </div>
            <div className="cards">
              {SECTION_CARDS.map((c) => (
                <Link className="related-card" href={c.href} key={c.href}>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                  <span className="go">استكشف ←</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="block" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="kicker">إجابات</span>
              <h2>الأسئلة الشائعة</h2>
              <p>أكثر ما يُسأل عنه حول زخرفة الأسماء واستخدامها.</p>
            </div>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>
      </main>

      <SiteFooter about={FOOTER_ABOUT} columns={FOOTER_COLS} sitemap={footerSitemap} />
    </>
  );
}
