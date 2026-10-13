import { useState, type FormEvent } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useLogIn, useSignUp } from '@workspace/api-client-react';
import type { AuthResponse } from '@workspace/api-client-react';
import { useAuth } from '@/lib/auth';
import { useLang, useMeta } from '@/lib/i18n';
import { BrandIcon, BrandLogo } from '@/components/rakla/Logo';

type AuthMode = 'login' | 'signup';

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  try {
    const parsed = new URL(value, 'https://rakla.local');
    if (parsed.origin !== 'https://rakla.local') return '/';
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
}

function AuthPage({ mode }: { mode: AuthMode }) {
  const { lang, dir } = useLang();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { acceptSession } = useAuth();
  const login = useLogIn();
  const signup = useSignUp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const isAr = lang === 'ar';
  const isSignup = mode === 'signup';
  const pending = login.isPending || signup.isPending;
  const t = (ar: string, en: string) => isAr ? ar : en;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useMeta(
    t(isSignup ? 'إنشاء حساب | ركلة' : 'تسجيل الدخول | ركلة', isSignup ? 'Create account | RAKLA' : 'Sign in | RAKLA'),
    t('ادخل إلى حساب ركلة واستعد للمباراة القادمة.', 'Sign in to RAKLA and get ready for your next match.'),
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (isSignup && cleanName.length < 2) {
      setFormError(t('الاسم لازم يكون حرفين على الأقل.', 'Your name must be at least 2 characters.'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError(t('اكتب بريد إلكتروني صحيح.', 'Enter a valid email address.'));
      return;
    }
    if (password.length < 8) {
      setFormError(t('كلمة المرور لازم تكون ٨ أحرف على الأقل.', 'Password must be at least 8 characters.'));
      return;
    }
    if (isSignup && password !== confirm) {
      setFormError(t('كلمتا المرور غير متطابقتين.', 'Passwords do not match.'));
      return;
    }

    const success = (response: AuthResponse) => {
      acceptSession(response);
      const params = new URLSearchParams(search);
      setLocation(safeRedirect(params.get('redirect')));
    };
    if (isSignup) {
      signup.mutate({ data: { displayName: cleanName, email: cleanEmail, password } }, {
        onSuccess: success,
        onError: () => setFormError(t('تعذر إنشاء الحساب. تحقق من بياناتك وحاول مجدداً.', 'We could not create your account. Check your details and try again.')),
      });
    } else {
      login.mutate({ data: { email: cleanEmail, password } }, {
        onSuccess: success,
        onError: () => setFormError(t('البريد أو كلمة المرور غير صحيحة.', 'Email or password is incorrect.')),
      });
    }
  }

  const inputClass = 'mt-2 h-13 w-full rounded-xl border border-ink/15 bg-[#fffefa] px-4 text-base text-ink outline-none transition focus:border-pitch focus:ring-2 focus:ring-pitch/15 placeholder:text-stone/60';

  return (
    <main dir={dir} className="min-h-[78dvh] bg-[#eeefe8] px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto grid min-h-[650px] max-w-6xl overflow-hidden rounded-[2rem] border border-ink/10 bg-[#fbfbf7] shadow-[0_24px_80px_rgba(10,15,13,.10)] lg:grid-cols-[.92fr_1.08fr]">
        <aside className="relative flex min-h-[230px] flex-col justify-between overflow-hidden bg-pitch p-7 text-chalk md:p-10 lg:min-h-full lg:p-12">
          <div className="pitch-lines absolute inset-0 opacity-70" />
          <div className="absolute -bottom-28 -end-24 h-80 w-80 rounded-full border border-chalk/10" />
          <div className="absolute -bottom-16 -end-12 h-56 w-56 rounded-full border border-chalk/10" />
          <div className="relative flex items-center gap-3">
            <BrandIcon className="h-11 w-11 rounded-xl" />
            <BrandLogo variant="light" className="h-9 max-w-[150px]" />
          </div>
          <div className="relative mt-10 max-w-md">
            <p className="font-display text-xs font-bold uppercase tracking-[.24em] text-volt">{t('من أول تمرين إلى صافرة النهاية', 'From first training to final whistle')}</p>
            <h1 className="mt-4 font-display text-4xl font-black leading-[1.12] md:text-5xl">
              {isSignup
                ? t('مكانك بين لاعبين الملعب.', 'Your place is on the pitch.')
                : t('رجعتك تبدأ من هنا.', 'Your next match starts here.')}
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-chalk/70 md:text-base">
              {t('معدات مختارة للأكاديمية، المدرسة، الديوانية والفوتسال. جهّز نفسك قبل الصافرة.', 'Gear picked for academy, school, weekend squads and futsal. Gear up before the whistle.')}
            </p>
          </div>
          <div className="relative mt-10 flex items-center gap-3 border-t border-chalk/15 pt-5 text-sm text-chalk/70">
            <ShieldCheck className="h-5 w-5 shrink-0 text-volt" />
            <span>{t('تسوق موثوق. أسعار واضحة بالدينار الكويتي.', 'A trusted shop. Clear prices in Kuwaiti dinar.')}</span>
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-9 md:px-12 md:py-12">
          <div className="w-full max-w-[440px]">
            <p className="font-display text-xs font-extrabold uppercase tracking-[.2em] text-pitch">{t('حساب ركلة', 'RAKLA ACCOUNT')}</p>
            <h2 className="mt-3 font-display text-3xl font-black text-ink md:text-4xl">
              {isSignup ? t('ابدأ من هنا', 'Join the squad') : t('ياهلا بعودتك', 'Good to have you back')}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone">
              {isSignup ? t('أنشئ حسابك وخلك جاهز للطلب القادم.', 'Create an account and be ready for your next order.') : t('سجل دخولك لمتابعة طلباتك ومواصلة التسوق.', 'Sign in to follow your orders and keep shopping.')}
            </p>
            <form className="mt-8 space-y-5" onSubmit={submit} noValidate data-testid={`form-${mode}`}>
              {isSignup && (
                <div>
                  <label htmlFor="auth-name" className="font-display text-sm font-bold text-ink">{t('الاسم الكامل', 'Full name')}</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute start-4 top-[26px] h-4 w-4 -translate-y-1/2 text-stone" />
                    <input id="auth-name" autoComplete="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} ps-11`} placeholder={t('مثال: يوسف العتيبي', 'e.g. Yousef Al-Otaibi')} data-testid="input-name" />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className="font-display text-sm font-bold text-ink">{t('البريد الإلكتروني', 'Email address')}</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-4 top-[26px] h-4 w-4 -translate-y-1/2 text-stone" />
                  <input id="auth-email" type="email" dir="ltr" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} ps-11 text-left`} placeholder="name@example.com" data-testid="input-email" />
                </div>
              </div>
              <div>
                <label htmlFor="auth-password" className="font-display text-sm font-bold text-ink">{t('كلمة المرور', 'Password')}</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute start-4 top-[26px] h-4 w-4 -translate-y-1/2 text-stone" />
                  <input id="auth-password" type={showPassword ? 'text' : 'password'} dir="ltr" autoComplete={isSignup ? 'new-password' : 'current-password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} ps-11 pe-12 text-left`} placeholder="••••••••" data-testid="input-password" />
                  <button type="button" aria-label={showPassword ? t('إخفاء كلمة المرور', 'Hide password') : t('إظهار كلمة المرور', 'Show password')} onClick={() => setShowPassword((value) => !value)} className="absolute end-3 top-3 grid h-7 w-8 place-items-center rounded-md text-stone hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pitch" data-testid="button-toggle-password">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-stone">{t('٨ أحرف على الأقل', 'At least 8 characters')}</p>
              </div>
              {isSignup && (
                <div>
                  <label htmlFor="auth-confirm" className="font-display text-sm font-bold text-ink">{t('تأكيد كلمة المرور', 'Confirm password')}</label>
                  <input id="auth-confirm" type="password" dir="ltr" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder={t('أعد كتابة كلمة المرور', 'Enter your password again')} data-testid="input-confirm-password" />
                </div>
              )}
              {formError && <p role="alert" className="rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-900" data-testid="status-auth-error">{formError}</p>}
              <button type="submit" disabled={pending} className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-pitch px-5 font-display font-extrabold text-chalk transition hover:bg-pitch-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch disabled:cursor-not-allowed disabled:opacity-65" data-testid="button-submit-auth">
                {pending ? t('لحظة، نجهّز حسابك...', 'One moment, getting you in...') : isSignup ? t('إنشاء الحساب', 'Create account') : t('تسجيل الدخول', 'Sign in')}
                {!pending && <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
              </button>
              <div className="flex items-center gap-3 text-xs text-stone">
                <span className="h-px flex-1 bg-ink/10" />
                <span>{t('آمن وبسيط', 'Safe and simple')}</span>
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <p className="text-center text-sm text-stone">
                {isSignup ? t('عندك حساب؟', 'Already have an account?') : t('أول مرة مع ركلة؟', 'New to RAKLA?')}{' '}
                <Link href={isSignup ? '/login' : '/signup'} className="font-display font-extrabold text-pitch underline decoration-volt decoration-2 underline-offset-4 hover:text-pitch-2" data-testid="link-switch-auth">
                  {isSignup ? t('سجل دخولك', 'Sign in') : t('أنشئ حساب', 'Create an account')}
                </Link>
              </p>
              {pending && <div className="sr-only" aria-live="polite" data-testid="status-auth-pending">{t('جارٍ الإرسال', 'Submitting')}</div>}
              <div className="flex items-center justify-center gap-2 text-xs text-stone/80"><Check className="h-3.5 w-3.5 text-pitch" />{t('تجربة تسوق ثنائية اللغة', 'A bilingual shopping experience')}</div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export function LoginPage() {
  return <AuthPage mode="login" />;
}

export function SignupPage() {
  return <AuthPage mode="signup" />;
}
