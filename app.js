/* =====================================================
   Science with Prof Marwa — app.js
   يبني كل الصفحات الداخلية تلقائيًا من data.js
   ويبحث عن ملفات PDF في مجلد files حسب أسمائها.
   ===================================================== */

(function () {
    "use strict";

    const ROOT = SITE.filesRoot;
    const NAME = "Science with Prof Marwa";
    const COLORS = ["pink", "purple", "green"];

    const params = new URLSearchParams(location.search);
    const app = document.getElementById("app");
    const page = document.body.dataset.page;

    const FILE_RE = new RegExp("^" + ROOT + "/[A-Za-z0-9_\\-.]+\\.pdf$", "i");
    const BACK_RE = /^[A-Za-z0-9_\-]+\.html(\?[A-Za-z0-9_\-=&%.]*)?$/;


    /* =====================================================
       أدوات عامة
       ===================================================== */

    const own = (obj, key) =>
        typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key);

    function el(tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
    }

    let toastTimer;
    function toast(message) {
        let t = document.querySelector(".toast");
        if (!t) {
            t = el("div", "toast");
            document.body.append(t);
        }
        t.textContent = message;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
    }

    /* هل الملف موجود؟ */
    async function exists(url) {
        try {
            const r = await fetch(url, { method: "HEAD" });
            return r.ok && (r.headers.get("content-type") || "").includes("pdf");
        } catch (e) {
            return false;
        }
    }

    /* يبحث عن: name.pdf ثم name-2.pdf ثم name-3.pdf ... */
    async function findFiles(prefix, max) {
        const out = [];
        for (let i = 1; i <= (max || 10); i++) {
            const url = prefix + (i === 1 ? "" : "-" + i) + ".pdf";
            if (await exists(url)) out.push(url);
            else break;
        }
        return out;
    }

    function viewerHref(files, names, title, back, index) {
        const p = new URLSearchParams();
        files.forEach(function (f) { p.append("f", f); });
        names.forEach(function (n) { p.append("n", n); });
        p.set("title", title);
        p.set("back", back);
        if (index) p.set("i", index);
        return "viewer.html?" + p.toString();
    }


    /* =====================================================
       عناصر الواجهة
       ===================================================== */

    function header(title, sub) {
        return '<div class="page-header"><h1>' + title + "</h1>" +
            (sub ? "<p>" + sub + "</p>" : "") + "</div>";
    }

    function actions(backHref, backText) {
        return '<div class="actions">' +
            (backHref ? '<a class="btn" href="' + backHref + '">← ' + backText + "</a>" : "") +
            '<a class="btn btn-ghost" href="index.html">← العودة إلى الرئيسية</a></div>';
    }

    function card(o) {
        const c = el(o.href ? "a" : "div",
            "card card-" + (o.color || "purple") + (o.href ? "" : " is-disabled"));
        if (o.href) c.href = o.href;

        c.innerHTML =
            (o.badge ? '<span class="badge ' + (o.badgeType || "") + '">' + o.badge + "</span>" : "") +
            '<div class="card-icon"><i class="fa-solid ' + o.icon + '"></i></div>' +
            "<h2>" + o.title + "</h2>" +
            (o.desc ? "<p>" + o.desc + "</p>" : "");

        if (!o.href) {
            c.addEventListener("click", function () { toast("لم يُرفع هذا المحتوى بعد"); });
        }
        return c;
    }

    function notFound() {
        app.innerHTML = header("الصفحة غير موجودة", "تأكد من الرابط ثم حاول مرة أخرى") + actions();
    }


    /* =====================================================
       صفحة الشعبة  (branch.html?b=science)
       ===================================================== */

    function branchPage() {
        const b = params.get("b");
        if (!own(SITE.branches, b)) return notFound();

        const br = SITE.branches[b];
        document.title = br.short + " | " + NAME;

        app.innerHTML =
            header(br.title, "اختر القسم الذي تريد البدء فيه") +
            '<section class="grid" id="grid"></section>' +
            actions();

        const grid = document.getElementById("grid");
        let i = 0;

        br.lessons.forEach(function (id) {
            const L = SITE.lessons[id];
            grid.append(card({
                href: "lesson.html?b=" + b + "&l=" + id,
                title: L.title, desc: L.desc, icon: L.icon, color: COLORS[i++ % 3]
            }));
        });

        br.collections.forEach(function (id) {
            const C = SITE.collections[id];
            grid.append(card({
                href: "collection.html?b=" + b + "&c=" + id,
                title: C.title, desc: C.desc, icon: C.icon, color: COLORS[i++ % 3]
            }));
        });

        grid.append(card({
            href: "texts.html?b=" + b,
            title: SITE.textsCard.title, desc: SITE.textsCard.desc,
            icon: SITE.textsCard.icon, color: COLORS[i++ % 3]
        }));
    }


    /* =====================================================
       صفحة الدرس  (lesson.html?b=science&l=protein)
       ملخصات + تمارين + مخططات
       ===================================================== */

    async function lessonPage() {
        const b = params.get("b");
        const l = params.get("l");

        if (!own(SITE.branches, b) || !own(SITE.lessons, l) ||
            !SITE.branches[b].lessons.includes(l)) return notFound();

        const br = SITE.branches[b];
        const lesson = SITE.lessons[l];
        document.title = lesson.title + " | " + NAME;

        app.innerHTML =
            header(lesson.title, br.title) +
            '<section class="grid" id="grid"></section>' +
            actions("branch.html?b=" + b, "العودة إلى " + br.short);

        const grid = document.getElementById("grid");
        const back = "lesson.html?b=" + b + "&l=" + l;

        const slots = SITE.types.map(function (t, i) {
            const slot = card({
                title: t.title, desc: t.desc, icon: t.icon,
                color: COLORS[i % 3], badge: "…"
            });
            grid.append(slot);
            return slot;
        });

        await Promise.all(SITE.types.map(async function (t, i) {
            const files = await findFiles(ROOT + "/" + b + "-" + l + "-" + t.id);
            const n = files.length;

            slots[i].replaceWith(card({
                title: t.title, desc: t.desc, icon: t.icon, color: COLORS[i % 3],
                href: n ? viewerHref(files, [], lesson.title + " — " + t.title, back) : null,
                badge: n > 1 ? n + " ملفات" : n ? "" : "قريبًا",
                badgeType: n ? "ok" : ""
            }));
        }));
    }


    /* =====================================================
       صفحة قسم المواضيع (collection.html?b=science&c=bac)
       ===================================================== */

    async function collectionPage() {
        const b = params.get("b");
        const c = params.get("c");

        if (!own(SITE.branches, b) || !own(SITE.collections, c) ||
            !SITE.branches[b].collections.includes(c)) return notFound();

        const br = SITE.branches[b];
        const col = SITE.collections[c];
        document.title = col.title + " | " + NAME;

        app.innerHTML =
            header(col.title, br.title) +
            '<div class="list" id="list"><div class="empty">جارٍ البحث عن الملفات...</div></div>' +
            actions("branch.html?b=" + b, "العودة إلى " + br.short);

        const list = document.getElementById("list");
        const back = "collection.html?b=" + b + "&c=" + c;
        const prefix = ROOT + "/" + b + "-" + c + "-";

        let keys = [];
        if (col.mode === "years") {
            for (let y = new Date().getFullYear(); y >= col.from; y--) keys.push(String(y));
        } else {
            for (let n = 1; n <= (col.max || 30); n++) keys.push(String(n));
        }

        const found = await Promise.all(keys.map(async function (k) {
            const f = prefix + k + ".pdf";
            if (!(await exists(f))) return null;
            const s = prefix + k + "-solution.pdf";
            return { k: k, f: f, s: (await exists(s)) ? s : null };
        }));

        const items = found.filter(Boolean);
        list.innerHTML = "";

        if (!items.length) {
            list.innerHTML = '<div class="empty">لم تُرفع ملفات هذا القسم بعد 💜</div>';
            return;
        }

        items.forEach(function (it) {
            const title = col.label + " " + it.k;
            const files = it.s ? [it.f, it.s] : [it.f];
            const names = it.s ? ["الموضوع", "الحل"] : ["الموضوع"];

            const row = el("div", "row");
            row.innerHTML = '<div class="row-title">' + title + '</div><div class="row-actions"></div>';
            const box = row.querySelector(".row-actions");

            const open = el("a", "chip", it.s ? "الموضوع" : "فتح");
            open.href = viewerHref(files, names, title, back, 0);
            box.append(open);

            if (it.s) {
                const sol = el("a", "chip alt", "الحل");
                sol.href = viewerHref(files, names, title, back, 1);
                box.append(sol);
            }
            list.append(row);
        });
    }


    /* =====================================================
       صفحة النصوص العلمية (texts.html?b=science)
       ===================================================== */

    async function textsPage() {
        const b = params.get("b");
        if (!own(SITE.branches, b)) return notFound();

        const br = SITE.branches[b];
        document.title = "النصوص العلمية | " + NAME;

        app.innerHTML =
            header("النصوص العلمية", "اختر النص العلمي الذي تريد البدء فيه") +
            '<div id="domains"></div>' +
            actions("branch.html?b=" + b, "العودة إلى " + br.short);

        const wrap = document.getElementById("domains");
        const back = "texts.html?b=" + b;
        const jobs = [];
        let i = 0;

        br.texts.forEach(function (d) {
            const sec = el("section", "domain");
            sec.innerHTML = '<div class="domain-title"><h2>' + d.title + "</h2><p>" + d.desc + "</p></div>";

            const grid = el("div", "grid" + (d.items.length === 1 ? " single" : ""));
            sec.append(grid);
            wrap.append(sec);

            d.items.forEach(function (it) {
                const color = COLORS[i++ % 3];
                const icon = SITE.lessons[it.lesson].icon;
                const slot = card({ title: it.title, desc: it.desc, icon: icon, color: color, badge: "…" });
                grid.append(slot);

                jobs.push((async function () {
                    const files = await findFiles(ROOT + "/" + b + "-texts-" + it.lesson);
                    const n = files.length;
                    slot.replaceWith(card({
                        title: it.title, desc: it.desc, icon: icon, color: color,
                        href: n ? viewerHref(files, [], it.title, back) : null,
                        badge: it.num + (n ? "" : " · قريبًا"),
                        badgeType: n ? "ok" : ""
                    }));
                })());
            });
        });

        await Promise.all(jobs);
    }


    /* =====================================================
       عارض الملفات (viewer.html)
       ===================================================== */

    function viewerPage() {
        const files = params.getAll("f").filter(function (f) { return FILE_RE.test(f); });
        if (!files.length) return notFound();

        const names = params.getAll("n");
        const title = params.get("title") || "عرض الملف";
        const backParam = params.get("back") || "";
        const back = BACK_RE.test(backParam) ? backParam : "index.html";

        let cur = parseInt(params.get("i") || "0", 10);
        if (!(cur >= 0 && cur < files.length)) cur = 0;

        document.title = title + " | " + NAME;

        app.innerHTML =
            '<div class="viewer-bar">' +
                '<a class="icon-btn" id="vBack" aria-label="رجوع"><i class="fa-solid fa-arrow-right"></i></a>' +
                '<div class="viewer-title" id="vTitle"></div>' +
                '<span class="page-count" id="vCount"></span>' +
                '<button class="icon-btn" id="zOut" aria-label="تصغير"><i class="fa-solid fa-minus"></i></button>' +
                '<button class="icon-btn" id="zIn" aria-label="تكبير"><i class="fa-solid fa-plus"></i></button>' +
                '<a class="icon-btn" id="vDl" aria-label="تحميل"><i class="fa-solid fa-download"></i></a>' +
            "</div>" +
            '<div class="tabs" id="vTabs"></div>' +
            '<div class="pdf-scroll">' +
                '<div class="status" id="vStatus"></div>' +
                '<div class="pdf-pages" id="vPages"></div>' +
            "</div>" +
            actions(back, "رجوع");

        const $ = function (id) { return document.getElementById(id); };
        const titleEl = $("vTitle"), countEl = $("vCount"), statusEl = $("vStatus");
        const pagesEl = $("vPages"), tabsEl = $("vTabs"), dl = $("vDl");

        titleEl.textContent = title;
        $("vBack").href = back;

        let token = 0, zoom = 1, pdfDoc = null, wraps = [], obs = null, countObs = null;

        /* التبويبات */
        function label(i) { return names[i] || "الملف " + (i + 1); }

        function drawTabs() {
            tabsEl.innerHTML = "";
            if (files.length < 2) { tabsEl.hidden = true; return; }
            files.forEach(function (f, i) {
                const t = el("button", "tab" + (i === cur ? " active" : ""));
                t.textContent = label(i);
                t.addEventListener("click", function () {
                    cur = i;
                    const p = new URLSearchParams(location.search);
                    p.set("i", i);
                    history.replaceState(null, "", "?" + p.toString());
                    drawTabs();
                    load();
                });
                tabsEl.append(t);
            });
        }

        function setDownload() {
            dl.href = files[cur];
            dl.setAttribute("download", files[cur].split("/").pop());
        }

        function fail() {
            statusEl.hidden = false;
            statusEl.innerHTML = "تعذّر عرض الملف داخل الصفحة.<br>";
            const a = el("a", "btn", "📥 تحميل الملف");
            a.href = files[cur];
            a.setAttribute("download", "");
            statusEl.append(a);
        }

        /* رسم صفحة واحدة */
        async function renderPage(w) {
            if (w.dataset.state === "loading" || w.dataset.state === "done") return;
            w.dataset.state = "loading";
            w._g = (w._g || 0) + 1;
            const g = w._g, doc = pdfDoc;

            try {
                const pg = await doc.getPage(Number(w.dataset.n));
                const base = pg.getViewport({ scale: 1 });
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                let scale = (w.clientWidth / base.width) * dpr;
                scale = Math.min(scale, 2600 / base.width);
                const vp = pg.getViewport({ scale: scale });

                const cv = document.createElement("canvas");
                cv.width = Math.floor(vp.width);
                cv.height = Math.floor(vp.height);

                await pg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;

                if (w._g !== g || doc !== pdfDoc) return;
                w.replaceChildren(cv);
                w.dataset.state = "done";
            } catch (e) {
                if (w._g === g) w.dataset.state = "";
            }
        }

        /* تحميل الملف الحالي */
        async function load() {
            const my = ++token;
            if (obs) obs.disconnect();
            if (countObs) countObs.disconnect();
            pagesEl.innerHTML = "";
            wraps = [];
            countEl.textContent = "";
            setDownload();

            statusEl.hidden = false;
            statusEl.textContent = "جارٍ تحميل الملف...";

            if (typeof pdfjsLib === "undefined") return fail();

            try {
                pdfDoc = await pdfjsLib.getDocument(files[cur]).promise;
                if (my !== token) return;

                const first = await pdfDoc.getPage(1);
                const vp = first.getViewport({ scale: 1 });
                statusEl.hidden = true;

                obs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (e) { if (e.isIntersecting) renderPage(e.target); });
                }, { rootMargin: "600px 0px" });

                countObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (e) {
                        if (e.isIntersecting) countEl.textContent = e.target.dataset.n + " / " + pdfDoc.numPages;
                    });
                }, { threshold: 0.4 });

                for (let n = 1; n <= pdfDoc.numPages; n++) {
                    const w = el("div", "pdf-wrap");
                    w.dataset.n = n;
                    w.style.aspectRatio = vp.width + " / " + vp.height;
                    pagesEl.append(w);
                    wraps.push(w);
                    obs.observe(w);
                    countObs.observe(w);
                }
            } catch (e) {
                if (my === token) fail();
            }
        }

        /* التكبير */
        function setZoom(z) {
            zoom = Math.max(1, Math.min(3, z));
            pagesEl.style.setProperty("--zoom", zoom);
            wraps.forEach(function (w) {
                w.dataset.state = "";
                w._g = (w._g || 0) + 1;
                w.replaceChildren();
                obs.unobserve(w);
                obs.observe(w);
            });
        }

        $("zIn").addEventListener("click", function () { setZoom(zoom + 0.5); });
        $("zOut").addEventListener("click", function () { setZoom(zoom - 0.5); });

        if (typeof pdfjsLib !== "undefined") {
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        drawTabs();
        load();
    }


    /* =====================================================
       التشغيل
       ===================================================== */

    const pages = {
        branch: branchPage,
        lesson: lessonPage,
        collection: collectionPage,
        texts: textsPage,
        viewer: viewerPage
    };

    if (own(pages, page)) pages[page]();

})();