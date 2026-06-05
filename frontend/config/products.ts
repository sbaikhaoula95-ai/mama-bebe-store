export type ProductSlug = "hnina-mama" | "hnina-lila" | "hnina-calm";

export type Ingredient = {
  nameAr: string;
  nameEn: string;
  origin: string;
  benefit: string;
  safety: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SalesDescription = {
  badge: string;
  title: string;
  body: string;
  bullets: string[];
  finalNote: string;
};

export type Product = {
  id: ProductSlug;
  slug: ProductSlug;
  sku: string;
  arabicName: string;
  latinName: string;
  shortHeading: string;
  subheading: string;
  heroHeadline: string;
  heroSubheadline: string;
  salesDescription: SalesDescription;
  painBlock: string;
  mechanism: string;
  englishDescriptor: string;
  heroImageKey: string;
  secondaryImageKey: string;
  price: 199;
  primaryAudience: string;
  safeClaim: string;
  ingredients: Ingredient[];
  howToUse: string[];
  faq: FaqItem[];
  reviews: Array<{ name: string; city: string; text: string; rating: number }>;
  ctaText: string;
  accentColor: string;
};

export const PRODUCTS: Record<ProductSlug, Product> = {
  "hnina-mama": {
    id: "hnina-mama",
    slug: "hnina-mama",
    sku: "HNINA-MAMA",
    arabicName: "حنينة ماما بزيت الهندية والأرغان — لتشققات الحمل وشد البشرة",
    latinName: "Hnina Mama",
    shortHeading: "حنينة ماما بزيت الهندية والأرغان\nلتشققات الحمل وشد البشرة",
    subheading:
      "بالهندية والأرغان، كيساعد البشرة تبقى مرنة وناعمة مع رتوال يومي بسيط.",
    heroHeadline: "زيت طبيعي يساعد بشرتك تبقى مرنة خلال الحمل وبعد الولادة",
    heroSubheadline:
      "بزيت الهندية والأرغان، حنينة ماما كتخلي العناية بتشققات الحمل رتوال يومي لطيف، طبيعي، ومفهوم.",
    salesDescription: {
      badge: "الأكثر طلبا للماميات",
      title: "زيت العناية اللي كتحتاجيه ملي بشرتك كتبدل مع الحمل",
      body:
        "حنينة ماما ماشي غير زيت عادي. هو رتوال يومي دافئ للماما اللي باغية تعتاني ببشرتها بثقة، خصوصا ففترة الحمل وبعد الولادة. التركيبة ديالو كتجمع زيت الهندية المغربي الغني بزيت الأرغان باش تعاون البشرة تبقى ناعمة، مرنة، ومرتاحة بلا إحساس ثقيل.",
      bullets: [
        "كيعاون البشرة تبقى مرنة ومغذية مع التمدد الطبيعي ديال الحمل.",
        "كيخلي ملمس البشرة ناعم ومريح من أول استعمال.",
        "مناسب لروتين يومي سريع بعد الدوش أو قبل النوم.",
        "ريحة طبيعية هادئة ومكونات مفهومة بلا تعقيد.",
      ],
      finalNote:
        "إلا كنتي باغية تهتمي بجسمك بلا خوف وبلا منتجات قاسية، حنينة ماما هو الاختيار اللي كيبان بسيط ولكن كيدخل بسرعة لروتينك اليومي.",
    },
    painBlock:
      "الحمل كيبقى من أجمل المراحل، ولكن الجسم كيتبدل بسرعة. كثير من الماميات كيبغيو يعتانيو بالبشرة ديالهم بلا ما يستعملو منتجات قاسية أو مجهولة.",
    mechanism:
      "زيت الهندية معروف بغناه بفيتامين E والأحماض الدهنية، والأرغان كيغذي البشرة وكيعاونها تبقى ناعمة ومرنة.",
    englishDescriptor:
      "Prickly Pear & Argan Firming Oil for pregnancy and postpartum skin.",
    heroImageKey: "product-hnina-mama-hero",
    secondaryImageKey: "product-hnina-mama-usage-1",
    price: 199,
    primaryAudience: "Pregnant and postpartum Moroccan women.",
    safeClaim:
      "يساعد يقلل من مظهر تشققات الحمل ويدعم مرونة البشرة.",
    ingredients: [
      {
        nameAr: "زيت الهندية",
        nameEn: "Prickly Pear Seed Oil",
        origin: "من أرض سوس المغربية",
        benefit: "غني بفيتامين E والأحماض الدهنية لدعم مرونة البشرة",
        safety: "لطيف جدا، مناسب للبشرة الحساسة",
      },
      {
        nameAr: "زيت الأرغان",
        nameEn: "Argan Oil",
        origin: "من تعاونيات مغربية معتمدة",
        benefit: "يغذي البشرة ويحافظ على ترطيبها الطبيعي",
        safety: "مختبر جلديا، بدون مواد مسببة للحساسية",
      },
      {
        nameAr: "زيت اللوز الحلو",
        nameEn: "Sweet Almond Oil",
        origin: "مصدر طبيعي موثوق",
        benefit: "ناقل لطيف يسهل امتصاص الزيوت الأخرى",
        safety: "خفيف وغير مسدود للمسام",
      },
    ],
    howToUse: [
      "سخني القليل من الزيت بين يديك",
      "دهني بشرتك برفق بحركات دائرية",
      "كرري هاد الرتوال يوميا للنتيجة الأفضل",
    ],
    faq: [
      {
        question: "واش نقدر نستعملو خلال الحمل؟",
        answer:
          "نعم، كزيت عناية موضعي ولطيف. ديري اختبار صغير على منطقة صغيرة قبل الاستعمال، واستشيري طبيبك إذا عندك حساسية خاصة.",
      },
      {
        question: "واش كيمسح التشققات؟",
        answer:
          "نستعملو لغة صادقة: كيساعد يقلل من مظهر التشققات ويدعم مرونة البشرة، ماشي علاج طبي.",
      },
      {
        question: "كيفاش نستعمل الزيت؟",
        answer:
          "سخني القليل بين يديك ودهني المنطقة برفق مرة أو مرتين في اليوم بعد الاستحمام.",
      },
      {
        question: "واش البوتيل كافي لمدة طويلة؟",
        answer:
          "نعم، القطرة الواحدة كافية لكل تطبيق، لذلك البوتيل كيدوم مدة طويلة مع الاستعمال اليومي.",
      },
    ],
    reviews: [
      {
        name: "سلمى",
        city: "الدار البيضاء",
        text: "جربت حنينة ماما فالحمل، الزيت خفيف وريحته طبيعية بزاف. كنستعملو كل يوم.",
        rating: 5,
      },
      {
        name: "نجوى",
        city: "فاس",
        text: "منتج رائع والتوصيل جاء بسرعة. كنصح به لكل ماما.",
        rating: 5,
      },
      {
        name: "إيمان",
        city: "أكادير",
        text: "بشرتي ولات أكثر مرونة منذ بديت نستعملو. شكرا حنينة.",
        rating: 5,
      },
    ],
    ctaText: "اشتري حنينة ماما الآن",
    accentColor: "blush",
  },

  "hnina-lila": {
    id: "hnina-lila",
    slug: "hnina-lila",
    sku: "HNINA-LILA",
    arabicName: "حنينة ليلى بالخزامى والبابونج — لتدليك البيبي وتهدئة روتين النوم",
    latinName: "Hnina Lila",
    shortHeading: "حنينة ليلى بالخزامى والبابونج\nلتدليك البيبي وتهدئة روتين النوم",
    subheading:
      "زيت خفيف للتدليك بالخزامى والبابونج، باش تكون لحظة النوم دافئة وهادية.",
    heroHeadline: "رتوال هادئ قبل النوم بتدليك لطيف للبيبي",
    heroSubheadline:
      "زيت الخزامى والبابونج مع اللوز الحلو، لحظة دافئة بينك وبين وليدك قبل النعاس.",
    salesDescription: {
      badge: "رتوال النوم الهادئ",
      title: "حولي وقت النوم للحظة قرب وراحة بينك وبين البيبي",
      body:
        "حنينة ليلى صممناه للماما اللي كتقلب على لحظة هادئة قبل النوم: لمسة خفيفة، تدليك لطيف، وريحة طبيعية مريحة بالخزامى والبابونج. الزيت كينزلق بسهولة على بشرة البيبي وكيخلي التدليك ساهل، دافئ، ومطمئن.",
      bullets: [
        "مناسب لتدليك لطيف قبل النوم بلا ما يثقل على البشرة.",
        "الخزامى والبابونج كيعطيو إحساس بالهدوء داخل روتين يومي واضح.",
        "كيعاونك تخلقي عادة جميلة: نفس الوقت، نفس اللمسة، نفس الراحة.",
        "لحظة صغيرة كل ليلة كتقوي القرب والثقة بينك وبين وليدك.",
      ],
      finalNote:
        "إلا كان وقت النوم كيدوز بصعوبة، بدي بروتين بسيط. حنينة ليلى ما كيوعدش بمعجزات، ولكن كيعطيك طقس هادئ كيحبوه الماميات والبيبيات.",
    },
    painBlock:
      "الليالي مع البيبي كتقدر تكون صعيبة. أحيانا كل اللي محتاجينو هو رتوال هادئ، لمسة دافئة، وريحة طبيعية خفيفة باش يدخل وقت النوم براحة.",
    mechanism:
      "الخزامى والبابونج معروفين بروائحهم الهادئة، وزيت اللوز الحلو كيعطي انزلاق لطيف للتدليك بلا ما يثقل على البشرة.",
    englishDescriptor:
      "Lavender, chamomile, and sweet almond baby bedtime massage oil.",
    heroImageKey: "product-hnina-lila-hero",
    secondaryImageKey: "product-hnina-lila-bedtime-ritual",
    price: 199,
    primaryAudience: "Parents of babies from 3 months onward.",
    safeClaim: "يدعم رتوال هادئ قبل النوم بتدليك لطيف للبيبي.",
    ingredients: [
      {
        nameAr: "الخزامى",
        nameEn: "Lavender",
        origin: "مصدر طبيعي موثوق",
        benefit: "ريحة طبيعية هادئة لدعم رتوال الاسترخاء",
        safety: "مخفف ومناسب للبيبي من 3 أشهر",
      },
      {
        nameAr: "البابونج",
        nameEn: "Roman Chamomile",
        origin: "مصدر طبيعي",
        benefit: "معروف بخصائصه الهادئة ولطفه على البشرة",
        safety: "لطيف جدا على بشرة البيبي",
      },
      {
        nameAr: "زيت اللوز الحلو",
        nameEn: "Sweet Almond Oil",
        origin: "مصدر طبيعي موثوق",
        benefit: "يعطي انزلاقا لطيفا للتدليك ويرطب البشرة",
        safety: "خفيف وغير مسدود للمسام",
      },
    ],
    howToUse: [
      "ضعي القليل من الزيت في راحة يدك",
      "دلكي بيبيك برفق بحركات بطيئة ودائرية",
      "استمتعي بلحظة الهدوء والقرب مع وليدك",
    ],
    faq: [
      {
        question: "واش هاد الزيت كيخلي البيبي ينعس؟",
        answer:
          "لا نقدموه كعلاج للنوم. هو زيت لتدليك لطيف كيدعم رتوال هادئ قبل النوم.",
      },
      {
        question: "من أي عمر؟",
        answer:
          "استعمليه حسب تعليمات العبوة والمورد النهائي. إذا كان البيبي أقل من 3 أشهر، استشيري الطبيب قبل أي زيت عطري.",
      },
      {
        question: "واش مامون على بشرة البيبي؟",
        answer:
          "نعم، مصمم خصيصا لبشرة البيبي اللطيفة. ديري اختبار صغير على منطقة صغيرة قبل أول استعمال.",
      },
      {
        question: "كيفاش نستعمله بشكل صحيح؟",
        answer:
          "ضعي كمية صغيرة في راحة يدك، دفئيها قليلا، ثم دلكي بيبيك برفق قبل النوم بـ 20-30 دقيقة.",
      },
    ],
    reviews: [
      {
        name: "مريم",
        city: "الرباط",
        text: "حنينة ليلى ولات جزء من رتوال النعاس ديال ولدي. ريحتو هادية وبيبي كيتهدى.",
        rating: 5,
      },
      {
        name: "فاطمة",
        city: "مراكش",
        text: "كنستعملو كل ليلة. البيبي كيرتاح وأنا كنرتاح معاه.",
        rating: 5,
      },
      {
        name: "زينب",
        city: "طنجة",
        text: "توصل بسرعة ومغلف زوين. المنتج خفيف ومريح على بشرة البيبي.",
        rating: 4,
      },
    ],
    ctaText: "اشتري حنينة ليلى الآن",
    accentColor: "sage",
  },

  "hnina-calm": {
    id: "hnina-calm",
    slug: "hnina-calm",
    sku: "HNINA-CALM",
    arabicName:
      "حنينة كالم بالكاليندولا والأرغان — للبشرة الجافة والحساسة والمتهيجة",
    latinName: "Hnina Calm",
    shortHeading: "حنينة كالم بالكاليندولا والأرغان\nللبشرة الجافة والحساسة والمتهيجة",
    subheading:
      "بالكاليندولا والأرغان، كيرطب البشرة الجافة والحساسة ويخليها مرتاحة.",
    heroHeadline: "بلسم لطيف للبشرة الجافة والحساسة ديال البيبي",
    heroSubheadline:
      "بالكاليندولا والأرغان، كيرطب ويغذي البشرة الحساسة والمتهيجة بلطف.",
    salesDescription: {
      badge: "للبشرة اللي كتحتاج عناية أكثر",
      title: "بلسم غني للمناطق الجافة والحساسة اللي كتقلق كل ماما",
      body:
        "حنينة كالم هو البلسم اللي كتبغي يكون قريب منك ملي كتلاحظي جفاف، خشونة، أو احمرار خفيف فبشرة البيبي أو حتى بشرتك. تركيبة الكاليندولا والأرغان كتخدم كطبقة عناية لطيفة كتغذي البشرة وتعاونها تبقى مرتاحة ومرطبة.",
      bullets: [
        "كيعطي ترطيب مركز للمناطق الجافة بحال الخدين، الركب، الكوعين واليدين.",
        "قوام بلسم غني: كمية صغيرة كتدوم وكتغطي المنطقة مزيان.",
        "بالكاليندولا المعروفة بلطفها على البشرة الحساسة.",
        "مناسب يكون فشنطة البيبي باش تستعمليه وقت الحاجة.",
      ],
      finalNote:
        "إلا كانت البشرة كتحتاج عناية إضافية وما بغيتيش تغامري بمنتجات قاسية، حنينة كالم اختيار مطمئن وبسيط للعائلة كاملة.",
    },
    painBlock:
      "ملي كتكون بشرة البيبي جافة أو حساسة، الماما كتقلق من أي منتج. حنينة كالم جا باش يعطي عناية بسيطة، لطيفة، وبمكونات مفهومة.",
    mechanism:
      "الكاليندولا معروفة فالعناية بالبشرة الحساسة، والأرغان كيغذي، وشمع النحل كيساعد يحافظ على الترطيب.",
    englishDescriptor:
      "Calendula & Argan Soothing Balm for very dry, sensitive, irritated baby skin.",
    heroImageKey: "product-hnina-calm-hero",
    secondaryImageKey: "product-hnina-calm-balm-texture",
    price: 199,
    primaryAudience: "Moms of babies with dry, sensitive, reactive, or irritated skin.",
    safeClaim:
      "يهدئ ويغذي البشرة الجافة والحساسة والمتهيجة بعناية لطيفة.",
    ingredients: [
      {
        nameAr: "الكاليندولا",
        nameEn: "Calendula",
        origin: "مصدر نباتي طبيعي",
        benefit: "معروفة بلطفها على البشرة الحساسة والمتهيجة",
        safety: "لطيف جدا، مناسب للبشرة الأكثر حساسية",
      },
      {
        nameAr: "زيت الأرغان",
        nameEn: "Argan Oil",
        origin: "من تعاونيات مغربية معتمدة",
        benefit: "يغذي البشرة ويحافظ على الترطيب العميق",
        safety: "مختبر جلديا",
      },
      {
        nameAr: "شمع النحل",
        nameEn: "Beeswax",
        origin: "طبيعي ونقي",
        benefit: "يشكل حاجزا طبيعيا يحافظ على الترطيب",
        safety: "لطيف ومناسب للبيبي",
      },
      {
        nameAr: "زيت اللوز الحلو",
        nameEn: "Sweet Almond Oil",
        origin: "مصدر طبيعي موثوق",
        benefit: "يرطب ويغذي البشرة الجافة",
        safety: "خفيف وغير مسدود للمسام",
      },
    ],
    howToUse: [
      "خذي كمية صغيرة من البلسم بين أصابعك",
      "سخني قليلا بين يديك حتى يذوب",
      "ضعيه على المنطقة الجافة أو الحساسة برفق",
    ],
    faq: [
      {
        question: "واش مناسب للبشرة الحساسة؟",
        answer:
          "نعم، مصمم للبشرة الجافة والحساسة. ديري اختبار صغير قبل الاستعمال.",
      },
      {
        question: "واش يمكن استعماله للبيبي والكبير؟",
        answer:
          "نعم، البلسم مناسب للكبار والصغار. مكوناته لطيفة ومناسبة للبشرة الحساسة.",
      },
      {
        question: "كم مرة نستعمله في اليوم؟",
        answer:
          "حسب حاجة البشرة. يمكن استعماله مرة أو مرتين في اليوم على المناطق الجافة.",
      },
      {
        question: "واش مناسب لبشرة الوجه؟",
        answer:
          "يمكن استعماله على البشرة الجافة جدا ولكن ابدأي بكمية صغيرة واختبريه على منطقة صغيرة أولا.",
      },
    ],
    reviews: [
      {
        name: "خديجة",
        city: "مراكش",
        text: "بلسم كالم عجبني حيث ما فيهش ريحة قوية وبشرة بنتي ولات مرتاحة.",
        rating: 5,
      },
      {
        name: "أمينة",
        city: "سلا",
        text: "كنستعملو على بشرة ولدي الحساسة وكيفيد بزاف. ولا عندي ضرورة.",
        rating: 5,
      },
      {
        name: "حنان",
        city: "وجدة",
        text: "الجرة كبيرة وتدوم مدة طويلة. جودة ممتازة بثمن معقول.",
        rating: 5,
      },
    ],
    ctaText: "اشتري حنينة كالم الآن",
    accentColor: "gold",
  },
};

export const PRODUCTS_LIST = Object.values(PRODUCTS);

export function getProduct(slug: ProductSlug): Product {
  return PRODUCTS[slug];
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS[slug as ProductSlug];
}

export function getCrossSellProducts(
  excludeSlug: ProductSlug
): Product[] {
  return PRODUCTS_LIST.filter((p) => p.slug !== excludeSlug);
}
