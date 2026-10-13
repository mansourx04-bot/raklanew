import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Compass, DoorOpen, Hand, MessageSquareHeart, MousePointerClick, Target, Zap, Shield, Flame, Sparkles } from 'lucide-react';
import { useLang, useMeta } from '@/lib/i18n';
import { BrandIcon, BrandLogo } from '@/components/rakla/Logo';

const SWATCHES = [
  { hex: '#0B3D2E', ar: 'أخضر الملعب', en: 'Pitch Green', fg: '#F5F5F0', roleAr: 'اللون الأساسي — الهيرو والفوتر', roleEn: 'Primary — hero & footer' },
  { hex: '#C6F432', ar: 'ليموني فولت', en: 'Volt Lime', fg: '#0A0F0D', roleAr: 'لون الأفعال — يُستخدم بحذر', roleEn: 'Action colour — used sparingly' },
  { hex: '#F5F5F0', ar: 'أبيض الطباشير', en: 'Chalk White', fg: '#0A0F0D', roleAr: 'الخلفيات وبطاقات المنتجات', roleEn: 'Backgrounds & product cards' },
  { hex: '#0A0F0D', ar: 'أسود ليلي', en: 'Near Black', fg: '#F5F5F0', roleAr: 'النصوص والأقسام الداكنة', roleEn: 'Text & dark sections' },
  { hex: '#5D6662', ar: 'رمادي الخطوط', en: 'Line Grey', fg: '#F5F5F0', roleAr: 'النصوص الثانوية', roleEn: 'Secondary text' },
];

export default function Brand() {
  const { lang, dir } = useLang();
  const L = (ar: string, en: string) => (lang === 'ar' ? ar : en);
  useMeta(
    L('لوحة هوية ركلة | عن المشروع المدرسي', 'RAKLA Brand Board | About this school project'),
    L('لوحة الهوية البصرية لمتجر ركلة: الشعار، الألوان، الخطوط، الشخصية، الجمهور ورحلة العميل — مشروع مدرسي.', 'RAKLA visual identity board: logo, colours, typography, personality, audience and customer journey — a school project.'),
  );
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const journey = [
    { I: DoorOpen, t: L('يدخل', 'Enters'), d: L('هيرو داكن وشعار واضح يقول له فوراً: هذا متجر كرة جاد.', 'Dark hero and bold slogan instantly say: serious football store.') },
    { I: Compass, t: L('يستكشف', 'Explores'), d: L('فئات بالصور وأزرار الملاعب FG/AG/TF/IN.', 'Image category tiles and FG/AG/TF/IN pitch chips.') },
    { I: Target, t: L('يختار', 'Chooses'), d: L('فلاتر حية، عرض سريع، مقاسات ودليل مقاسات مجاني.', 'Live filters, quick view, sizes and a free size guide.') },
    { I: MousePointerClick, t: L('يتفاعل', 'Interacts'), d: L('يضيف للسلة والمفضلة، يختار طقم يوم المباراة.', 'Adds to cart and favorites, picks the match-day bundle.') },
    { I: MessageSquareHeart, t: L('يحصل على رد', 'Gets feedback'), d: L('علامة صح، اهتزاز السلة، إشعار، وتأكيد طلب تجريبي.', 'Check icon, cart bounce, toast and a demo order confirmation.') },
  ];
  const card = 'rounded-3xl border border-ink/10 bg-[#FBFBF7] p-6 md:p-8';
  const label = 'mb-4 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[.2em] text-pitch';
  const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

  return (
    <div>
      <section className="relative overflow-hidden bg-pitch text-chalk speed-cut">
        <div className="pitch-lines absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-14 md:px-6">
          <p className="font-display text-sm font-bold text-volt">{L('عن هذا المشروع · لوحة الهوية للمعلّم', 'About this project · Teacher brand board')}</p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-6 inline-flex rounded-2xl bg-chalk px-5 py-3"><BrandLogo variant="dark" className="h-14 md:h-16" /></motion.div>
          <p className="mt-6 max-w-2xl text-lg text-chalk/75">{L('ركلة متجر إلكتروني تجريبي لمعدات كرة القدم في الكويت، صُمم كمشروع مدرسي لعرض هوية تجارية متكاملة وتجربة تسوق ثنائية اللغة.', 'RAKLA is a demo football gear store for Kuwait, designed as a school project to present a complete brand identity and a bilingual shopping experience.')}</p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 font-display font-extrabold text-ink" data-testid="link-brand-store">{L('زيارة المتجر', 'Visit the store')}<Arrow className="h-5 w-5" /></Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 md:grid-cols-6 md:px-6">
        <motion.div {...fade} className={`${card} md:col-span-3`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الاسم', 'Name')}</p>
          <p className="font-display text-6xl font-black">ركلة <span className="italic text-pitch">RAKLA</span></p>
          <p className="mt-3 text-ink/75">{L('«ركلة» كلمة عربية قصيرة وقوية تعني الضربة بالقدم — أول حركة في كل مباراة. سهلة النطق بالعربي والإنجليزي.', '“Rakla” is a short, punchy Arabic word for a kick — the first move of every match. Easy to say in Arabic and English.')}</p>
        </motion.div>
        <motion.div {...fade} className={`${card} md:col-span-3`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الشعار', 'Slogan')}</p>
          <p className="font-display text-4xl font-black leading-tight text-pitch">جهّز نفسك قبل الصافرة</p>
          <p className="mt-2 font-display text-2xl font-bold italic">Gear up before the whistle</p>
        </motion.div>

        <motion.div {...fade} className={`${card} md:col-span-6`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('نسخ الشعار', 'Logo variants')}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-pitch p-4"><BrandLogo variant="light" className="h-16 max-w-full" /><span className="text-xs font-semibold text-chalk/70">{L('للخلفيات الداكنة', 'For dark backgrounds')}</span></div>
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-chalk p-4"><BrandLogo variant="dark" className="h-16 max-w-full" /><span className="text-xs font-semibold text-stone">{L('للخلفيات الفاتحة', 'For light backgrounds')}</span></div>
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-pitch p-4"><BrandIcon className="h-20 w-20 rounded-2xl" /><span className="text-xs font-semibold text-chalk/70">{L('أيقونة التطبيق', 'App icon')}</span></div>
          </div>
          <p className="mt-3 text-sm text-stone">{L('شعارات ركلة الرسمية: النسخة البيضاء للخلفيات الداكنة، والنسخة الخضراء للخلفيات الفاتحة، وأيقونة الكرة لواجهات الجوال والفافيكون.', 'Official RAKLA marks: white on dark backgrounds, green on light backgrounds, and the football icon for compact mobile surfaces and the favicon.')}</p>
        </motion.div>

        <motion.div {...fade} className={`${card} md:col-span-6`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الألوان', 'Colour palette')}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SWATCHES.map((s) => (
              <div key={s.hex} className="overflow-hidden rounded-2xl border border-ink/10" data-testid={`swatch-${s.hex.slice(1)}`}>
                <div className="flex h-28 items-end p-3 font-display text-lg font-black" style={{ background: s.hex, color: s.fg }}>{s.hex}</div>
                <div className="p-3"><p className="font-display font-bold">{lang === 'ar' ? s.ar : s.en}</p><p className="text-xs text-stone">{lang === 'ar' ? s.roleAr : s.roleEn}</p></div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade} className={`${card} md:col-span-4`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الخطوط', 'Typography')}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><p className="font-display text-6xl font-black">Aa أب</p><p className="mt-2 font-display font-bold">Alexandria</p><p className="text-sm text-stone">{L('العناوين والأرقام والأسعار', 'Headings, numbers & prices')}</p></div>
            <div><p className="text-6xl font-semibold">Aa أب</p><p className="mt-2 font-bold">IBM Plex Sans Arabic</p><p className="text-sm text-stone">{L('النصوص والوصف', 'Body text & descriptions')}</p></div>
          </div>
        </motion.div>
        <motion.div {...fade} className={`${card} bg-pitch text-chalk md:col-span-2`} style={{ background: '#0B3D2E' }}>
          <p className={`${label} text-volt`}>{L('الشخصية', 'Personality')}</p>
          {[[Flame, 'حماسية', 'Energetic'], [Zap, 'جريئة', 'Bold'], [Shield, 'موثوقة', 'Reliable']].map(([I, a, b]) => {
            const Icon = I as typeof Flame;
            return <p key={a as string} className="flex items-center gap-3 py-2 font-display text-2xl font-black"><Icon className="h-6 w-6 text-volt" />{lang === 'ar' ? (a as string) : (b as string)}</p>;
          })}
        </motion.div>

        <motion.div {...fade} className={`${card} md:col-span-3`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الأسلوب البصري', 'Visual style')}</p>
          <ul className="space-y-2 text-ink/80">
            {[L('هيرو وفوتر أخضر داكن مع خطوط ملعب ودائرة منتصف خفيفة', 'Dark green hero/footer with subtle pitch lines and centre circle'), L('قصّات مائلة توحي بالسرعة', 'Diagonal speed cuts'), L('بطاقات منتجات بلون الطباشير', 'Chalk product cards'), L('خط كبير وجريء، والليموني فقط للأفعال', 'Big bold type, lime reserved for actions'), L('صور منتجات أصلية مولّدة', 'Original generated product photography')].map((x) => (
              <li key={x} className="flex gap-2"><Sparkles className="mt-1 h-4 w-4 shrink-0 text-pitch" />{x}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fade} className={`${card} md:col-span-3`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('الجمهور المستهدف', 'Target audience')}</p>
          <p className="text-ink/80">{L('لاعبين في الكويت من ١٤ إلى ٣٥ سنة: لاعبي الأكاديميات، فرق المدارس، فرق الديوانية في نهاية الأسبوع، ولاعبي الفوتسال.', 'Players in Kuwait aged 14–35: academy players, school teams, weekend diwaniya squads and futsal players.')}</p>
          <p className={`${label} mt-6`}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('ما يميّزنا', 'Differentiators')}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[L('تسوّق حسب نوع الملعب', 'Shop by pitch surface'), L('دليل مقاسات مجاني', 'Free size guide'), L('توصيل نفس اليوم بالكويت', 'Same-day Kuwait delivery'), L('أطقم جاهزة بخصم', 'Ready discounted bundles'), L('عربي أولاً + إنجليزي', 'Arabic-first + English'), L('أسعار واضحة بالدينار', 'Clear KWD pricing')].map((x) => (
              <li key={x} className="rounded-xl bg-pitch/5 px-3 py-2 text-sm font-semibold text-pitch">{x}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade} className={`${card} md:col-span-6`}>
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />{L('رحلة العميل', 'Customer journey')}</p>
          <ol className="grid gap-4 md:grid-cols-5">
            {journey.map((j, i) => (
              <li key={j.t} className="relative rounded-2xl bg-chalk p-5" data-testid={`journey-step-${i + 1}`}>
                <span className="font-display text-5xl font-black text-pitch/10">{String(i + 1).padStart(2, '0')}</span>
                <j.I className="absolute end-5 top-5 h-6 w-6 text-pitch" />
                <p className="font-display text-xl font-black">{j.t}</p>
                <p className="mt-1 text-sm text-stone">{j.d}</p>
                {i < 4 && <Arrow className="absolute -end-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-volt md:block" style={{ filter: 'drop-shadow(0 0 0 #0B3D2E)' }} />}
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-sm text-stone"><Hand className="h-4 w-4" />{L('الدفع تجريبي فقط؛ المنتجات والحسابات والطلبات تُحفظ في MongoDB عبر الخادم، والسلة والمفضلة في المتصفح.', 'Checkout is demo-only; products, accounts and orders are stored in MongoDB through the API, while cart and favorites stay in the browser.')}</p>
        </motion.div>

        <motion.section {...fade} className={`${card} md:col-span-6`} data-testid="section-day4-database">
          <p className={label}><span className="h-1 w-6 -skew-x-12 bg-volt" />Day 4: MongoDB &amp; Security</p>
          <h2 className="font-display text-3xl font-black text-pitch">{L('قاعدة البيانات والأمان', 'Database & security')}</h2>
          <p className="mt-3 text-sm leading-7 text-stone">
            {L('قاعدة البيانات تنظّم المعلومات إلى مجموعات، وكل مجموعة تحتوي مستندات. ركلة تستخدم MongoDB Atlas مع Mongoose، والواجهة تتصل بالخادم فقط عبر API.', 'A database organizes information into collections, and each collection contains documents. RAKLA uses MongoDB Atlas with Mongoose; the storefront reaches it only through the API.')}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              [L('products — المنتجات', 'products — catalogue'), L('مستند لكل منتج في الكتالوج، ويُزرع الكتالوج الحالي إذا كانت المجموعة فارغة.', 'One document per catalogue item; the current catalogue is seeded when the collection is empty.')],
              [L('users — المستخدمون', 'users — accounts'), L('الاسم والبريد الفريد وهاش كلمة المرور وتاريخ الإنشاء؛ لا نخزن كلمة المرور نفسها.', 'Display name, unique email, password hash and creation date; the password itself is never stored.')],
              [L('orders — الطلبات', 'orders — purchases'), L('مستند الطلب يحفظ المستخدم والمنتجات والمقاسات والكميات والأسعار والإجمالي والمنطقة والحالة والتاريخ.', 'Each order document stores its owner, products, sizes, quantities, prices, total, area, status and date.')],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-ink/10 bg-chalk p-4">
                <h3 className="font-display font-extrabold text-pitch">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-pitch p-5 text-chalk">
              <h3 className="font-display text-lg font-black text-volt">{L('رحلة الحساب والجلسة', 'Account and session journey')}</h3>
              <p className="mt-2 text-sm leading-7 text-chalk/80" dir="ltr">Sign up → bcrypt hash → store hash → log in → compare hash → issue 7-day JWT → httpOnly cookie → browser sends cookie → backend checks identity → database checks ownership → response</p>
              <p className="mt-3 text-sm leading-6 text-chalk/70">{L('كلمات المرور تُهشّ بخوارزمية bcrypt مع salt قبل التخزين. الـJWT يثبت الهوية فقط ولا يحتوي كلمة المرور، ويُحفظ في Cookie آمن لا يصل إليه JavaScript.', 'Passwords are hashed with bcrypt and a salt before storage. The JWT proves identity, never contains the password, and is stored in an httpOnly cookie that JavaScript cannot read.')}</p>
            </article>
            <article className="rounded-2xl border border-ink/10 bg-[#f1f2ec] p-5">
              <h3 className="font-display text-lg font-black text-pitch">{L('Authentication vs Authorization', 'Authentication vs authorization')}</h3>
               <p className="mt-2 text-sm leading-7 text-stone"><b>{L('المصادقة:', 'Authentication:')}</b> {L('الخادم يتحقق من JWT داخل Cookie ويعرف صاحب الحساب.', 'the server validates the JWT in the session cookie and identifies the account.')}</p>
              <p className="mt-2 text-sm leading-7 text-stone"><b>{L('التفويض:', 'Authorization:')}</b> {L('الخادم يتأكد أن الطلب يخص المستخدم الحالي قبل إرجاعه؛ وإلا يمنع الوصول بـ403.', 'the server checks that an order belongs to the current user before returning it; otherwise access is denied with 403.')}</p>
              <p className="mt-3 text-xs font-semibold text-stone">{L('الأسرار MONGODB_URI وJWT_SECRET تبقى في Replit Secrets وعلى الخادم فقط.', 'MONGODB_URI and JWT_SECRET stay in Replit Secrets and are read only by the server.')}</p>
            </article>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
