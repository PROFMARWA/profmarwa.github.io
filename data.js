/* =====================================================
   Science with Prof Marwa — data.js
   بيانات الموقع. تُعدَّل نادرًا (فقط عند إضافة درس/قسم جديد).
   رفع الملفات لا يحتاج أي تعديل هنا.

   أسماء الملفات (كلها داخل مجلد files):
   درس:        {الشعبة}-{الدرس}-{النوع}.pdf
               مثال: science-protein-summary.pdf
               ملف ثانٍ: science-protein-summary-2.pdf
   مواضيع:     {الشعبة}-{القسم}-{الرقم أو السنة}.pdf
               مثال: science-bac-2024.pdf  و  science-bac-2024-solution.pdf
   نصوص علمية: {الشعبة}-texts-{الدرس}.pdf
               مثال: science-texts-protein.pdf
   ===================================================== */

const SITE = {

    filesRoot: "files",

    /* أنواع محتوى كل درس */
    types: [
        { id: "summary",   title: "الملخصات", desc: "ملخصات تساعد على فهم الدرس ومراجعته", icon: "fa-book-open" },
        { id: "exercises", title: "التمارين", desc: "تمارين وتطبيقات للتدرب",             icon: "fa-pen-to-square" },
        { id: "diagrams",  title: "المخططات", desc: "مخططات توضيحية تساعد على فهم الدرس", icon: "fa-diagram-project" }
    ],

    /* الدروس */
    lessons: {
        prerequisites:  { title: "مكتسبات قبلية",                      desc: "الأساسيات الضرورية قبل بدء البرنامج",                       icon: "fa-book-open" },
        protein:        { title: "تركيب البروتين",                     desc: "آليات تركيب البروتين: الاستنساخ والترجمة",                  icon: "fa-dna" },
        structure:      { title: "العلاقة بين بنية ووظيفة البروتين",   desc: "البنية الفراغية تحدد التخصص الوظيفي للبروتين",              icon: "fa-circle-nodes" },
        enzymes:        { title: "الإنزيمات",                          desc: "دور البروتينات في التحفيز الإنزيمي",                        icon: "fa-flask" },
        immunity:       { title: "المناعة",                            desc: "دور البروتينات في الدفاع عن العضوية والاستجابة المناعية",   icon: "fa-shield-halved" },
        nervous:        { title: "الاتصال العصبي",                     desc: "دور البروتينات في الاتصال العصبي",                          icon: "fa-brain" },
        photosynthesis: { title: "التركيب الضوئي",                     desc: "تحويل الطاقة الضوئية إلى طاقة كيميائية كامنة",              icon: "fa-seedling" },
        respiration:    { title: "التنفس",                             desc: "تحويل الطاقة الكيميائية الكامنة إلى طاقة قابلة للاستعمال", icon: "fa-bolt" },
        geology:        { title: "الجيولوجيا",                         desc: "التكتونية العامة للأرض",                                    icon: "fa-earth-americas" }
    },

    /* أقسام المواضيع
       mode: "years"    ← ملفات بالسنة (2024.pdf)
       mode: "numbered" ← ملفات بالرقم (1.pdf, 2.pdf ...) */
    collections: {
        "bac":        { title: "مواضيع الباك",        desc: "مواضيع البكالوريا السابقة",             icon: "fa-file-lines", mode: "years",    from: 2010, label: "بكالوريا" },
        "bac-blanc":  { title: "بكالوريا تجريبية",    desc: "اختبارات تجريبية للتحضير للباك",         icon: "fa-calendar-check", mode: "numbered", max: 30, label: "اختبار" },
        "excellence": { title: "مواضيع التميز",       desc: "تحديات للطلاب الطموحين",                icon: "fa-trophy", mode: "numbered", max: 30, label: "موضوع" },
        "achbal":     { title: "مواضيع أشبال الأمة",  desc: "مواضيع للتدرب والتحدي",                 icon: "fa-star", mode: "numbered", max: 30, label: "موضوع" },
        "mizan":      { title: "سلاسل الميزان",       desc: "سلاسل تدريبية متدرجة",                  icon: "fa-scale-balanced", mode: "numbered", max: 30, label: "سلسلة" }
    },

    /* بطاقة النصوص العلمية */
    textsCard: {
        title: "جميع النصوص العلمية",
        desc: "النصوص العلمية المقررة لحل تمارين استرجاع المعارف",
        icon: "fa-file-pen"
    },

    /* الشعب */
    branches: {

        science: {
            short: "علوم الطبيعة والحياة",
            title: "علوم الطبيعة والحياة",
            lessons: ["prerequisites", "protein", "structure", "enzymes", "immunity", "nervous", "photosynthesis", "respiration", "geology"],
            collections: ["bac", "bac-blanc", "excellence", "achbal", "mizan"],
            texts: [
                {
                    title: "المجال الأول: التخصص الوظيفي للبروتينات",
                    desc: "نصوص علمية خاصة بالتخصص الوظيفي للبروتينات",
                    items: [
                        { lesson: "protein",   num: "1.1", title: "آليات تركيب البروتين",             desc: "نصوص علمية حول الاستنساخ والترجمة" },
                        { lesson: "structure", num: "2.1", title: "العلاقة بين بنية ووظيفة البروتين", desc: "نصوص علمية حول العلاقة بين البنية والوظيفة" },
                        { lesson: "enzymes",   num: "3.1", title: "الإنزيمات",                        desc: "نصوص علمية حول النشاط الإنزيمي" },
                        { lesson: "immunity",  num: "4.1", title: "المناعة",                          desc: "نصوص علمية حول الاستجابة المناعية" },
                        { lesson: "nervous",   num: "5.1", title: "الاتصال العصبي",                   desc: "نصوص علمية حول الاتصال العصبي" }
                    ]
                },
                {
                    title: "المجال الثاني: تحويل الطاقة الضوئية على مستوى ما فوق البنية الخلوية",
                    desc: "نصوص علمية خاصة بتحويل الطاقة",
                    items: [
                        { lesson: "photosynthesis", num: "6.2", title: "التركيب الضوئي",     desc: "نصوص علمية حول تحويل الطاقة الضوئية" },
                        { lesson: "respiration",    num: "7.2", title: "التنفس والتخمر",     desc: "نصوص علمية حول تحويل الطاقة الكيميائية الكامنة" }
                    ]
                },
                {
                    title: "المجال الثالث: التكتونية العامة للأرض",
                    desc: "نصوص علمية خاصة ببنية الكرة الأرضية",
                    items: [
                        { lesson: "geology", num: "8.3", title: "بنية الكرة الأرضية", desc: "نصوص علمية حول بنية الكرة الأرضية والتكتونية العامة" }
                    ]
                }
            ]
        },

        math: {
            short: "الرياضيات",
            title: "شعبة الرياضيات",
            lessons: ["prerequisites", "protein", "structure", "immunity"],
            collections: ["bac", "bac-blanc", "excellence", "achbal", "mizan"],
            texts: [
                {
                    title: "النصوص العلمية الخاصة بشعبة الرياضيات",
                    desc: "نصوص علمية مقررة لشعبة الرياضيات",
                    items: [
                        { lesson: "protein",   num: "1", title: "تركيب البروتين",                   desc: "النص العلمي الخاص بتركيب البروتين" },
                        { lesson: "structure", num: "2", title: "العلاقة بين بنية ووظيفة البروتين", desc: "النص العلمي الخاص بالعلاقة بين البنية والوظيفة" },
                        { lesson: "immunity",  num: "3", title: "المناعة",                          desc: "النص العلمي الخاص بالمناعة" }
                    ]
                }
            ]
        }
    }
};