export type Category = 'boots' | 'balls' | 'gk' | 'wear' | 'accessories' | 'training';
export type Surface = 'FG' | 'AG' | 'TF' | 'IN';
export type Bi = { ar: string; en: string };

export type Product = {
  id: string;
  name: Bi;
  category: Category;
  desc: Bi;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  tag?: 'new' | 'best';
  surfaces: Surface[];
  sizes: string[];
  image: string;
};

export const img = (f: string) => `/images/${f}`;

const BOOT = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];
const WEAR = ['S', 'M', 'L', 'XL'];
const ALL: Surface[] = ['FG', 'AG', 'TF', 'IN'];

export const PRODUCTS: Product[] = [
  { id: 'strike-fg', name: { ar: 'ركلة سترايك FG', en: 'RAKLA Strike FG' }, category: 'boots', surfaces: ['FG'], sizes: BOOT, price: 24.5, oldPrice: 29, rating: 4.8, reviews: 127, tag: 'best', image: img('p-strike-fg.jpg'),
    desc: { ar: 'حذاء خفيف بجزء علوي محبوك ومسامير مخروطية للانطلاق السريع على العشب الطبيعي.', en: 'Lightweight knit upper with conical studs for explosive starts on natural grass.' } },
  { id: 'velocity-ag', name: { ar: 'ركلة فيلوسيتي AG', en: 'RAKLA Velocity AG' }, category: 'boots', surfaces: ['AG'], sizes: BOOT, price: 22.75, rating: 4.7, reviews: 89, tag: 'new', image: img('p-velocity-ag.jpg'),
    desc: { ar: 'مسامير قصيرة متعددة تخفف الضغط على المفاصل في ملاعب العشب الصناعي.', en: 'Multi short studs that ease joint load on artificial grass pitches.' } },
  { id: 'grid-tf', name: { ar: 'ركلة قريد TF', en: 'RAKLA Grid TF' }, category: 'boots', surfaces: ['TF'], sizes: BOOT, price: 18.9, oldPrice: 21.5, rating: 4.6, reviews: 64, image: img('p-grid-tf.jpg'),
    desc: { ar: 'نعل مطاطي بنتوءات للملاعب الخماسية والأسطح القاسية، مريح لساعات.', en: 'Rubber nub outsole for 5-a-side cages and hard surfaces, comfy for hours.' } },
  { id: 'hall-in', name: { ar: 'ركلة هول IN', en: 'RAKLA Hall IN' }, category: 'boots', surfaces: ['IN'], sizes: BOOT, price: 17.25, rating: 4.5, reviews: 41, tag: 'new', image: img('p-hall-in.jpg'),
    desc: { ar: 'جلد سويدي ونعل صمغي مسطح لا يترك أثر، لمسة دقيقة في الفوتسال.', en: 'Suede upper and flat non-marking gum sole for precise futsal touch.' } },
  { id: 'pro-ball', name: { ar: 'كرة ركلة برو ماتش', en: 'RAKLA Pro Match Ball' }, category: 'balls', surfaces: ['FG', 'AG'], sizes: ['4', '5'], price: 12.5, rating: 4.9, reviews: 203, tag: 'best', image: img('p-match-ball.jpg'),
    desc: { ar: 'كرة مباريات ملحومة حرارياً بطيران ثابت، مثالية للعشب الطبيعي والصناعي.', en: 'Thermo-bonded match ball with stable flight for grass and artificial pitches.' } },
  { id: 'futsal-ball', name: { ar: 'كرة ركلة فوتسال لو-باونس', en: 'RAKLA Futsal Low-Bounce' }, category: 'balls', surfaces: ['IN', 'TF'], sizes: ['4'], price: 9.75, rating: 4.7, reviews: 76, image: img('p-futsal-ball.jpg'),
    desc: { ar: 'ارتداد منخفض وتحكم أقرب للقدم في الصالات والملاعب الصغيرة.', en: 'Low bounce for close control in halls and small-sided games.' } },
  { id: 'wall-pro', name: { ar: 'قفازات وول برو للحراس', en: 'Wall Pro GK Gloves' }, category: 'gk', surfaces: ALL, sizes: ['7', '8', '9', '10', '11'], price: 11.9, oldPrice: 14.25, rating: 4.8, reviews: 58, tag: 'new', image: img('p-gk-gloves.jpg'),
    desc: { ar: 'لاتكس ٤ مم بقبضة قوية وحماية أصابع، تثبت حتى في رطوبة الليل.', en: '4mm latex palm with finger protection, holds grip in humid nights.' } },
  { id: 'jersey', name: { ar: 'تيشيرت تدريب ركلة دراي', en: 'RAKLA Dry Training Jersey' }, category: 'wear', surfaces: ALL, sizes: WEAR, price: 7.5, rating: 4.6, reviews: 92, image: img('p-jersey.jpg'),
    desc: { ar: 'قماش يطرد العرق وخفيف للحر الكويتي، بخط سرعة ليموني.', en: 'Sweat-wicking light fabric for Kuwaiti heat, with a lime speed stripe.' } },
  { id: 'shorts', name: { ar: 'شورت ركلة ماتش', en: 'RAKLA Match Shorts' }, category: 'wear', surfaces: ALL, sizes: WEAR, price: 5.25, rating: 4.5, reviews: 47, image: img('p-shorts.jpg'),
    desc: { ar: 'شورت مرن بخصر مطاطي وجوانب ليمونية لحرية حركة كاملة.', en: 'Stretch shorts with elastic waist and lime piping for full freedom.' } },
  { id: 'shin', name: { ar: 'واقي ساق ركلة شيلد', en: 'RAKLA Shield Shin Guards' }, category: 'accessories', surfaces: ALL, sizes: ['S', 'M', 'L'], price: 5.25, rating: 4.7, reviews: 110, tag: 'best', image: img('p-shin.jpg'),
    desc: { ar: 'غلاف صلب خفيف وبطانة إسفنجية تمتص الضربات.', en: 'Light hard shell with foam backing that absorbs knocks.' } },
  { id: 'grip-socks', name: { ar: 'جوارب ركلة قريب', en: 'RAKLA Grip Socks' }, category: 'accessories', surfaces: ALL, sizes: ['38-40', '41-43', '44-46'], price: 3.75, rating: 4.8, reviews: 156, image: img('p-socks.jpg'),
    desc: { ar: 'نقاط مطاطية تمنع انزلاق القدم داخل الحذاء.', en: 'Rubber grip dots stop your foot sliding inside the boot.' } },
  { id: 'kit-bag', name: { ar: 'شنطة ركلة كيت', en: 'RAKLA Kit Bag' }, category: 'accessories', surfaces: ALL, sizes: [], price: 13.5, rating: 4.6, reviews: 38, image: img('p-bag.jpg'),
    desc: { ar: 'شنطة رياضية بجيب منفصل للحذاء وجيب معزول للماي.', en: 'Duffel with separate boot pocket and insulated bottle sleeve.' } },
  { id: 'cones', name: { ar: 'أقماع تدريب ركلة (٢٠ قطعة)', en: 'RAKLA Training Cones (20 pc)' }, category: 'training', surfaces: ALL, sizes: [], price: 4.9, rating: 4.7, reviews: 84, tag: 'best', image: img('p-cones.jpg'),
    desc: { ar: 'أقماع وأقراص مرنة لتمارين المراوغة والتمرير.', en: 'Flexible cones and discs for dribbling and passing drills.' } },
  { id: 'ladder', name: { ar: 'سلم رشاقة ركلة ٦ م', en: 'RAKLA Agility Ladder 6m' }, category: 'training', surfaces: ALL, sizes: [], price: 6.25, rating: 4.5, reviews: 29, image: img('p-ladder.jpg'),
    desc: { ar: 'درجات قابلة للتعديل لتمارين سرعة القدمين.', en: 'Adjustable rungs for fast-feet footwork drills.' } },
  { id: 'mini-goal', name: { ar: 'مرمى ركلة صغير قابل للطي', en: 'RAKLA Pop-Up Mini Goal' }, category: 'training', surfaces: ALL, sizes: [], price: 15.75, oldPrice: 18, rating: 4.6, reviews: 33, image: img('p-minigoal.jpg'),
    desc: { ar: 'ينفتح في ثواني للحديقة أو تمرين الأكاديمية.', en: 'Pops open in seconds for the yard or academy drills.' } },
];

export const BUNDLE = {
  id: 'bundle-matchday',
  parts: ['strike-fg', 'grip-socks', 'shin'] as const,
  price: 27.9,
  image: img('p-strike-fg.jpg'),
};

export const bundleFull = BUNDLE.parts.reduce((s, id) => s + (PRODUCTS.find((p) => p.id === id)?.price ?? 0), 0);

export const CATEGORIES: { id: Category; image: string }[] = [
  { id: 'boots', image: img('p-strike-fg.jpg') },
  { id: 'balls', image: img('p-match-ball.jpg') },
  { id: 'gk', image: img('c-gk.jpg') },
  { id: 'wear', image: img('p-jersey.jpg') },
  { id: 'accessories', image: img('p-bag.jpg') },
  { id: 'training', image: img('c-training.jpg') },
];

export const SURFACES: Surface[] = ['FG', 'AG', 'TF', 'IN'];

export const AREAS: Bi[] = [
  { ar: 'مدينة الكويت', en: 'Kuwait City' }, { ar: 'حولي', en: 'Hawalli' }, { ar: 'السالمية', en: 'Salmiya' },
  { ar: 'الجابرية', en: 'Jabriya' }, { ar: 'مشرف', en: 'Mishref' }, { ar: 'الرميثية', en: 'Rumaithiya' },
  { ar: 'الفروانية', en: 'Farwaniya' }, { ar: 'خيطان', en: 'Khaitan' }, { ar: 'الجهراء', en: 'Jahra' },
  { ar: 'الأحمدي', en: 'Ahmadi' }, { ar: 'الفنطاس', en: 'Fintas' }, { ar: 'مبارك الكبير', en: 'Mubarak Al-Kabeer' },
];

export const FREE_OVER = 15;
export const DELIVERY_FEE = 1.5;
