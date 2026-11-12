/* =========================================
   Science with Prof Marwa
   SCRIPT.JS (نسخة محسّنة)
   ========================================= */

(function () {
    "use strict";

    /* =========================================
       1. مواقع التواصل
       ========================================= */

    const socialButton = document.getElementById("socialButton");
    const socialIcon = document.getElementById("socialIcon");
    const socialText = document.getElementById("socialText");
    const socialDots = document.querySelectorAll(".social-dot");

    const socialPlatforms = [
        {
            name: "Telegram",
            icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M21.9 3.2 2.8 10.6c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.9c.2.6.4.6.8.3l2.8-2.7 5.8 4.3c1.1.6 1.9.3 2.2-1l3.1-14.7c.4-1.4-.5-2-2-1.6z"/></svg>`,
            url: "https://t.me/sciencesmarwa"
        },
        {
            name: "Instagram",
            icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
            url: "https://www.instagram.com/marwa_prof_sciences?igsh=MjF1ODc3YWRwMmc5"
        },
        {
            name: "Facebook",
            icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.7.3-1 1-1z"/></svg>`,
            url: "https://www.facebook.com/share/1EsTEQ35dC/"
        }
    ];

    const ROTATE_DELAY = 4000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let currentPlatform = 0;
    let socialTimer = null;

    function showPlatform(index) {
        if (!socialButton || !socialIcon || !socialText) return;

        currentPlatform = index;
        const platform = socialPlatforms[index];

        socialIcon.innerHTML = platform.icon;
        socialText.textContent = "زورونا على " + platform.name;
        socialButton.href = platform.url;

        socialDots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }

    function startRotation() {
        stopRotation();
        if (reduceMotion || document.hidden) return;

        socialTimer = setInterval(function () {
            showPlatform((currentPlatform + 1) % socialPlatforms.length);
        }, ROTATE_DELAY);
    }

    function stopRotation() {
        if (socialTimer) {
            clearInterval(socialTimer);
            socialTimer = null;
        }
    }

    if (socialButton) {
        showPlatform(0);
        startRotation();

        const box = socialButton.parentElement;
        let resumeTimeout = null;

        /* إيقاف التبديل عند المرور أو التركيز */
        box.addEventListener("mouseenter", stopRotation);
        box.addEventListener("mouseleave", startRotation);
        box.addEventListener("focusin", stopRotation);
        box.addEventListener("focusout", startRotation);

        /* الهاتف: إيقاف عند اللمس ثم الاستئناف بعد 6 ثوانٍ */
        box.addEventListener("touchstart", function () {
            stopRotation();
            clearTimeout(resumeTimeout);
        }, { passive: true });

        box.addEventListener("touchend", function () {
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(startRotation, 6000);
        }, { passive: true });

        /* النقاط قابلة للضغط */
        socialDots.forEach(function (dot, i) {
            dot.style.cursor = "pointer";
            dot.addEventListener("click", function () {
                showPlatform(i);
                startRotation();
            });
        });

        /* إيقاف التبديل عندما تكون التبويبة مخفية */
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) stopRotation();
            else startRotation();
        });
    }


    /* =========================================
       2. واجهة اختيار الشعبة
       ========================================= */

    const startButton = document.getElementById("startButton");
    const branchScene = document.getElementById("branchScene");

    function openScene() {
        if (!branchScene || branchScene.classList.contains("show-branches")) return;

        branchScene.classList.add("show-branches");
        document.body.style.overflow = "hidden";
        branchScene.scrollTop = 0;

        /* حتى يغلق زر الرجوع في الهاتف الواجهة بدل مغادرة الموقع */
        history.pushState({ scene: true }, "", "#branchScene");
    }

    function closeScene() {
        if (!branchScene) return;

        branchScene.classList.remove("show-branches");
        document.body.style.overflow = "";
    }

    if (startButton && branchScene) {

        startButton.addEventListener("click", function (event) {
            event.preventDefault();
            openScene();
        });

        /* زر الرجوع في المتصفح/الهاتف */
        window.addEventListener("popstate", closeScene);

        /* مفتاح Escape */
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && branchScene.classList.contains("show-branches")) {
                history.back();
            }
        });

        /* زر "العودة إلى الرئيسية" داخل الواجهة: يغلقها دون إعادة تحميل */
        const homeReturn = branchScene.querySelector(".home-return");
        if (homeReturn) {
            homeReturn.addEventListener("click", function (event) {
                event.preventDefault();
                history.back();
            });
        }

        /* إذا فُتح الموقع برابط ينتهي بـ #branchScene بعد تحديث الصفحة */
        if (location.hash === "#branchScene") {
            history.replaceState(null, "", location.pathname);
        }
    }

})();