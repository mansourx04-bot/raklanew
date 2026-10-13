import type { Product } from "@workspace/api-zod";
import { ProductModel } from "./models";

const bootSizes = ["38", "39", "40", "41", "42", "43", "44", "45", "46"];
const wearSizes = ["S", "M", "L", "XL"];
const allSurfaces: Product["surfaces"] = ["FG", "AG", "TF", "IN"];

export const seedProducts: Product[] = [
  { id: "strike-fg", name: { ar: "ركلة سترايك FG", en: "RAKLA Strike FG" }, category: "boots", desc: { ar: "حذاء خفيف بجزء علوي محبوك ومسامير مخروطية للانطلاق السريع على العشب الطبيعي.", en: "Lightweight knit upper with conical studs for explosive starts on natural grass." }, price: 24.5, oldPrice: 29, rating: 4.8, reviews: 127, tag: "best", surfaces: ["FG"], sizes: bootSizes, image: "images/p-strike-fg.jpg" },
  { id: "velocity-ag", name: { ar: "ركلة فيلوسيتي AG", en: "RAKLA Velocity AG" }, category: "boots", desc: { ar: "مسامير قصيرة متعددة تخفف الضغط على المفاصل في ملاعب العشب الصناعي.", en: "Multi short studs that ease joint load on artificial grass pitches." }, price: 22.75, oldPrice: null, rating: 4.7, reviews: 89, tag: "new", surfaces: ["AG"], sizes: bootSizes, image: "images/p-velocity-ag.jpg" },
  { id: "grid-tf", name: { ar: "ركلة قريد TF", en: "RAKLA Grid TF" }, category: "boots", desc: { ar: "نعل مطاطي بنتوءات للملاعب الخماسية والأسطح القاسية، مريح لساعات.", en: "Rubber nub outsole for 5-a-side cages and hard surfaces, comfy for hours." }, price: 18.9, oldPrice: 21.5, rating: 4.6, reviews: 64, tag: null, surfaces: ["TF"], sizes: bootSizes, image: "images/p-grid-tf.jpg" },
  { id: "hall-in", name: { ar: "ركلة هول IN", en: "RAKLA Hall IN" }, category: "boots", desc: { ar: "جلد سويدي ونعل صمغي مسطح لا يترك أثر، لمسة دقيقة في الفوتسال.", en: "Suede upper and flat non-marking gum sole for precise futsal touch." }, price: 17.25, oldPrice: null, rating: 4.5, reviews: 41, tag: "new", surfaces: ["IN"], sizes: bootSizes, image: "images/p-hall-in.jpg" },
  { id: "pro-ball", name: { ar: "كرة ركلة برو ماتش", en: "RAKLA Pro Match Ball" }, category: "balls", desc: { ar: "كرة مباريات ملحومة حرارياً بطيران ثابت، مثالية للعشب الطبيعي والصناعي.", en: "Thermo-bonded match ball with stable flight for grass and artificial pitches." }, price: 12.5, oldPrice: null, rating: 4.9, reviews: 203, tag: "best", surfaces: ["FG", "AG"], sizes: ["4", "5"], image: "images/p-match-ball.jpg" },
  { id: "futsal-ball", name: { ar: "كرة ركلة فوتسال لو-باونس", en: "RAKLA Futsal Low-Bounce" }, category: "balls", desc: { ar: "ارتداد منخفض وتحكم أقرب للقدم في الصالات والملاعب الصغيرة.", en: "Low bounce for close control in halls and small-sided games." }, price: 9.75, oldPrice: null, rating: 4.7, reviews: 76, tag: null, surfaces: ["IN", "TF"], sizes: ["4"], image: "images/p-futsal-ball.jpg" },
  { id: "wall-pro", name: { ar: "قفازات وول برو للحراس", en: "Wall Pro GK Gloves" }, category: "gk", desc: { ar: "لاتكس ٤ مم بقبضة قوية وحماية أصابع، تثبت حتى في رطوبة الليل.", en: "4mm latex palm with finger protection, holds grip in humid nights." }, price: 11.9, oldPrice: 14.25, rating: 4.8, reviews: 58, tag: "new", surfaces: allSurfaces, sizes: ["7", "8", "9", "10", "11"], image: "images/p-gk-gloves.jpg" },
  { id: "jersey", name: { ar: "تيشيرت تدريب ركلة دراي", en: "RAKLA Dry Training Jersey" }, category: "wear", desc: { ar: "قماش يطرد العرق وخفيف للحر الكويتي، بخط سرعة ليموني.", en: "Sweat-wicking light fabric for Kuwaiti heat, with a lime speed stripe." }, price: 7.5, oldPrice: null, rating: 4.6, reviews: 92, tag: null, surfaces: allSurfaces, sizes: wearSizes, image: "images/p-jersey.jpg" },
  { id: "shorts", name: { ar: "شورت ركلة ماتش", en: "RAKLA Match Shorts" }, category: "wear", desc: { ar: "شورت مرن بخصر مطاطي وجوانب ليمونية لحرية حركة كاملة.", en: "Stretch shorts with elastic waist and lime piping for full freedom." }, price: 5.25, oldPrice: null, rating: 4.5, reviews: 47, tag: null, surfaces: allSurfaces, sizes: wearSizes, image: "images/p-shorts.jpg" },
  { id: "shin", name: { ar: "واقي ساق ركلة شيلد", en: "RAKLA Shield Shin Guards" }, category: "accessories", desc: { ar: "غلاف صلب خفيف وبطانة إسفنجية تمتص الضربات.", en: "Light hard shell with foam backing that absorbs knocks." }, price: 5.25, oldPrice: null, rating: 4.7, reviews: 110, tag: "best", surfaces: allSurfaces, sizes: ["S", "M", "L"], image: "images/p-shin.jpg" },
  { id: "grip-socks", name: { ar: "جوارب ركلة قريب", en: "RAKLA Grip Socks" }, category: "accessories", desc: { ar: "نقاط مطاطية تمنع انزلاق القدم داخل الحذاء.", en: "Rubber grip dots stop your foot sliding inside the boot." }, price: 3.75, oldPrice: null, rating: 4.8, reviews: 156, tag: null, surfaces: allSurfaces, sizes: ["38-40", "41-43", "44-46"], image: "images/p-socks.jpg" },
  { id: "kit-bag", name: { ar: "شنطة ركلة كيت", en: "RAKLA Kit Bag" }, category: "accessories", desc: { ar: "شنطة رياضية بجيب منفصل للحذاء وجيب معزول للماي.", en: "Duffel with separate boot pocket and insulated bottle sleeve." }, price: 13.5, oldPrice: null, rating: 4.6, reviews: 38, tag: null, surfaces: allSurfaces, sizes: [], image: "images/p-bag.jpg" },
  { id: "cones", name: { ar: "أقماع تدريب ركلة (٢٠ قطعة)", en: "RAKLA Training Cones (20 pc)" }, category: "training", desc: { ar: "أقماع وأقراص مرنة لتمارين المراوغة والتمرير.", en: "Flexible cones and discs for dribbling and passing drills." }, price: 4.9, oldPrice: null, rating: 4.7, reviews: 84, tag: "best", surfaces: allSurfaces, sizes: [], image: "images/p-cones.jpg" },
  { id: "ladder", name: { ar: "سلم رشاقة ركلة ٦ م", en: "RAKLA Agility Ladder 6m" }, category: "training", desc: { ar: "درجات قابلة للتعديل لتمارين سرعة القدمين.", en: "Adjustable rungs for fast-feet footwork drills." }, price: 6.25, oldPrice: null, rating: 4.5, reviews: 29, tag: null, surfaces: allSurfaces, sizes: [], image: "images/p-ladder.jpg" },
  { id: "mini-goal", name: { ar: "مرمى ركلة صغير قابل للطي", en: "RAKLA Pop-Up Mini Goal" }, category: "training", desc: { ar: "ينفتح في ثواني للحديقة أو تمرين الأكاديمية.", en: "Pops open in seconds for the yard or academy drills." }, price: 15.75, oldPrice: 18, rating: 4.6, reviews: 33, tag: null, surfaces: allSurfaces, sizes: [], image: "images/p-minigoal.jpg" },
];

export async function seedProductCollection(): Promise<void> {
  const count = await ProductModel.countDocuments();
  if (count !== 0) return;
  await ProductModel.insertMany(
    seedProducts.map((product, sortOrder) => ({ ...product, sortOrder })),
    { ordered: true },
  );
}
