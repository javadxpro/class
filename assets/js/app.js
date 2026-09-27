/* ===== نهمیتو | منطق سایت ===== */
(function () {
  "use strict";

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- تم (روشن/تاریک) ---------- */
  const THEME_KEY = "nahomyar-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  const savedTheme = (() => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } })();
  applyTheme(savedTheme || "light");

  /* ---------- پیشرفت مطالعه (localStorage) ---------- */
  const PROG_KEY = "nahomyar-progress";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROG_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch (e) {}
  }
  window.Nahomyar = {
    progress: loadProgress,
    mark(lessonId, done) {
      const p = loadProgress();
      if (done) p[lessonId] = 1; else delete p[lessonId];
      saveProgress(p);
    },
    bookStats(book) {
      let total = 0, done = 0;
      (book.chapters || []).forEach(ch => (ch.lessons || []).forEach(ls => {
        total++;
        if (loadProgress()[book.id + ":" + ls.id]) done++;
      }));
      return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    }
  };

  /* ---------- داده‌ها ---------- */
  function allBooks() {
    return (window.BOOKS_META || [])
      .map(m => Object.assign({}, m, window.BOOKS_DATA && window.BOOKS_DATA[m.id] ? window.BOOKS_DATA[m.id] : {}))
      .filter(b => b.chapters && b.chapters.length);
  }
  function lessonIter(book) {
    const out = [];
    (book.chapters || []).forEach((ch, ci) => (ch.lessons || []).forEach((ls, li) => {
      out.push({ book, ch, ls, ci, li });
    }));
    return out;
  }
  function stripHtml(s) {
    return String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  /* ---------- هدر: دکمه تم ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const btn = $("#themeToggle");
    if (btn) {
      const sync = () => {
        const t = document.documentElement.getAttribute("data-theme");
        btn.innerHTML = window.ICONS.svg(t === "dark" ? "sun" : "moon");
        btn.title = t === "dark" ? "حالت روشن" : "حالت تاریک";
      };
      sync();
      btn.addEventListener("click", () => {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
        sync();
      });
    }
    const top = $("#backTop");
    if (top) {
      window.addEventListener("scroll", () => {
        top.classList.toggle("show", window.scrollY > 500);
      });
      top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  });

  /* ---------- جستجوی سراسری ---------- */
  function buildIndex() {
    const idx = [];
    allBooks().forEach(book => {
      lessonIter(book).forEach(({ ls, ch }) => {
        const text = stripHtml([ls.title, ch.title, ls.summary, (ls.points || []).join(" "),
          (ls.qa || []).map(q => q.q + " " + q.a).join(" ")].join(" "));
        idx.push({ book, ls, ch, text, title: ls.title, crumb: book.title + " › " + ch.title });
      });
    });
    return idx;
  }

  function makeSnippet(text, q) {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text.slice(0, 120) + "…";
    const s = Math.max(0, i - 40);
    const raw = (s > 0 ? "… " : "") + text.slice(s, i + q.length + 80) + " …";
    const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return raw.replace(re, "<mark>$1</mark>");
  }

  function initSearch(inputSel, resultsSel, limitBook) {
    const input = $(inputSel);
    const box = $(resultsSel);
    if (!input || !box) return;
    const index = buildIndex().filter(r => !limitBook || r.book.id === limitBook);
    let timer = null;
    const run = () => {
      const q = input.value.trim();
      if (q.length < 2) { box.classList.remove("open"); box.innerHTML = ""; return; }
      const hits = index.filter(r => r.text.includes(q)).slice(0, 12);
      if (!hits.length) {
        box.innerHTML = '<div class="sr-empty">' + window.ICONS.svg("search-x", "ico-lg") + "<div>چیزی پیدا نشد</div></div>";
      } else {
        box.innerHTML = hits.map(r => {
          const href = "book.html?b=" + r.book.id + "#les-" + r.ls.id;
          return '<a class="sr-item" href="' + href + '" style="display:block;color:inherit;text-decoration:none">' +
            '<div class="t">' + r.title + ' <span style="color:var(--text-soft);font-weight:500;font-size:.78rem">— ' + r.crumb + "</span></div>" +
            '<div class="s">' + makeSnippet(r.text, q) + "</div></a>";
        }).join("");
      }
      box.classList.add("open");
    };
    input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(run, 180); });
    input.addEventListener("focus", run);
    document.addEventListener("click", e => {
      if (!box.contains(e.target) && e.target !== input) box.classList.remove("open");
    });
  }

  /* ---------- صفحه اصلی ---------- */
  function renderHome() {
    const grid = $("#booksGrid");
    if (!grid) return;
    const books = allBooks();
    const stats = $("#statsRow");
    if (stats) {
      const lessons = books.reduce((n, b) => n + (b.chapters || []).reduce((m, c) => m + (c.lessons || []).length, 0), 0);
      const qas = books.reduce((n, b) => n + lessonIter(b).reduce((m, { ls }) => m + (ls.qa || []).length, 0), 0);
      stats.innerHTML =
        '<div class="stat"><div class="n">' + books.length + '</div><div class="l">کتاب درسی</div></div>' +
        '<div class="stat"><div class="n">' + lessons.toLocaleString("fa-IR") + '</div><div class="l">درس و فصل خلاصه‌شده</div></div>' +
        '<div class="stat"><div class="n">' + qas.toLocaleString("fa-IR") + '+</div><div class="l">سوال احتمالی با پاسخ</div></div>' +
        '<div class="stat"><div class="n">۱۰۰٪</div><div class="l">رایگان و آفلاین‌پسند</div></div>';
    }
    const chips = $("#filterChips");
    if (chips) {
      const cats = [["all", "همه"], ["main", "دروس اصلی"], ["rel", "دینی"], ["skill", "مهارتی"]];
      chips.innerHTML = cats.map((c, i) => '<button class="chip' + (i === 0 ? " active" : "") + '" data-cat="' + c[0] + '">' + c[1] + "</button>").join("");
      chips.addEventListener("click", e => {
        const b = e.target.closest(".chip");
        if (!b) return;
        $$(".chip", chips).forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        const cat = b.dataset.cat;
        $$(".book-card", grid).forEach(card => {
          card.style.display = (cat === "all" || card.dataset.cat === cat) ? "" : "none";
        });
      });
    }
    grid.innerHTML = books.map(b => {
      const st = window.Nahomyar.bookStats(b);
      return '<a class="book-card" href="book.html?b=' + b.id + '" data-cat="' + (b.cat || "main") + '" style="--c:' + (b.color || "#4f46e5") + '">' +
        '<div class="bc-top"><div class="bc-icon">' + window.ICONS.svg(b.icon || "book") + "</div>" +
        '<div><div class="bc-title">' + b.title + '</div><span class="bc-tag">' + (b.tag || "") + "</span></div></div>" +
        '<p class="bc-desc">' + (b.desc || "") + "</p>" +
        '<div class="bc-foot"><div class="progress"><i style="width:' + st.pct + '%"></i></div>' +
        '<span class="progress-label">' + st.pct.toLocaleString("fa-IR") + "٪</span></div></a>";
    }).join("");
    initSearch("#globalSearch", "#globalSearchResults");
  }

  /* ---------- صفحه کتاب ---------- */
  function renderBook() {
    const root = $("#bookRoot");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("b");
    const books = allBooks();
    const book = books.find(b => b.id === id) || books[0];
    if (!book) { root.innerHTML = "<p>کتابی یافت نشد.</p>"; return; }

    document.title = book.title + " نهم | نهمیتو";
    const hero = $("#bookHero");
    if (hero) {
      hero.style.setProperty("--c", book.color || "#4f46e5");
      hero.innerHTML =
        '<div class="book-hero-inner">' +
        '<div class="bc-icon">' + window.ICONS.svg(book.icon || "book") + "</div>" +
        "<div style=\"flex:2;min-width:240px\"><div class=\"breadcrumb\"><a href=\"index.html\">خانه</a> › " + book.title + "</div>" +
        "<h1>" + book.title + " نهم</h1><p class=\"sub\">" + (book.desc || "") + "</p></div>" +
        '<div class="book-progress-wrap"><div class="bc-foot"><div class="progress"><i id="bookProgBar" style="width:0%"></i></div>' +
        '<span class="progress-label" id="bookProgLabel">۰٪</span></div>' +
        '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
        '<button class="btn btn-soft" id="expandAll" type="button">گشودن همه درس‌ها</button>' +
        '<button class="btn btn-ghost" id="printBook" type="button">' + window.ICONS.svg("print") + " چاپ / PDF</button></div></div></div>";
    }

    const toc = $("#bookToc");
    const lessons = $("#lessonsWrap");
    let tocHtml = "<h3>فهرست درس‌ها</h3>";
    let lesHtml = "";
    let n = 0;

    (book.chapters || []).forEach((ch, ci) => {
      const chId = "ch-" + book.id + "-" + ci;
      tocHtml += '<div class="toc-group"><span class="g-title">' + ch.title + "</span>";
      (ch.lessons || []).forEach((ls, li) => {
        n++;
        const lid = ls.id || (book.id + "-" + ci + "-" + li);
        ls.id = lid;
        tocHtml += '<a href="#les-' + lid + '" data-target="les-' + lid + '"><span>' + ls.title + '</span><span class="done" data-done-for="' + lid + '"></span></a>';
        lesHtml += renderLessonCard(book, ch, ls, n);
      });
      tocHtml += "</div>";
    });
    if (toc) toc.innerHTML = tocHtml;
    if (lessons) {
      lessons.innerHTML = lesHtml;
      lessons.style.setProperty("--c", book.color || "#4f46e5");
    }

    /* باز/بسته کردن، نشانه‌گذاری خوانده‌شده */
    function refreshProgress() {
      const st = window.Nahomyar.bookStats(book);
      const bar = $("#bookProgBar"), lab = $("#bookProgLabel");
      if (bar) bar.style.width = st.pct + "%";
      if (lab) lab.textContent = " " + st.done.toLocaleString("fa-IR") + " از " + st.total.toLocaleString("fa-IR") + " درس (" + st.pct.toLocaleString("fa-IR") + "٪)";
      $$("[data-done-for]").forEach(el => {
        el.innerHTML = window.Nahomyar.progress()[book.id + ":" + el.dataset.doneFor] ? window.ICONS.svg("check", "ico-done") : "";
      });
    }
    refreshProgress();

    $$(".mark-read input", lessons).forEach(cb => {
      cb.addEventListener("change", () => {
        window.Nahomyar.mark(cb.dataset.lesson, cb.checked);
        cb.closest(".mark-read").classList.toggle("checked", cb.checked);
        refreshProgress();
      });
    });

    const expandBtn = $("#expandAll");
    if (expandBtn) {
      let open = false;
      expandBtn.addEventListener("click", () => {
        open = !open;
        $$(".lesson-card", lessons).forEach(d => { d.open = open; });
        expandBtn.textContent = open ? "بستن همه درس‌ها" : "گشودن همه درس‌ها";
      });
    }
    const printBtn = $("#printBook");
    if (printBtn) printBtn.addEventListener("click", () => {
      $$(".lesson-card", lessons).forEach(d => { d.open = true; });
      setTimeout(() => window.print(), 60);
    });

    /* هایلایت فهرست هنگام اسکرول */
    const links = $$("#bookToc a[data-target]");
    const map = {};
    links.forEach(a => (map[a.dataset.target] = a));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const a = map[en.target.id];
        if (a && en.isIntersecting) {
          links.forEach(x => x.classList.remove("active"));
          a.classList.add("active");
        }
      });
    }, { rootMargin: "-15% 0px -70% 0px" });
    $$(".lesson-card", lessons).forEach(d => obs.observe(d));

    initSearch("#bookSearch", "#bookSearchResults", book.id);
  }

  function renderLessonCard(book, ch, ls, n) {
    const lid = ls.id;
    const done = !!(window.Nahomyar.progress()[book.id + ":" + lid]);
    const pts = (ls.points && ls.points.length)
      ? '<div class="keypoints"><h4>' + window.ICONS.svg("star") + " نکات کلیدی</h4><ul>" + ls.points.map(p => "<li>" + p + "</li>").join("") + "</ul></div>"
      : "";
    const vocab = (ls.vocab && ls.vocab.length)
      ? '<h4 class="vocab-h4">' + window.ICONS.svg("library", "ico-violet") + ' واژگان و مفاهیم</h4><table class="vocab-table"><thead><tr><th>واژه / مفهوم</th><th>معنی و توضیح</th></tr></thead><tbody>' +
        ls.vocab.map(v => "<tr><td dir='auto'><b>" + v[0] + "</b></td><td>" + v[1] + "</td></tr>").join("") + "</tbody></table>"
      : "";
    const qa = (ls.qa && ls.qa.length)
      ? '<div class="qa-block"><h4>' + window.ICONS.svg("help") + " سوالات احتمالی امتحان</h4>" + ls.qa.map((q, i) =>
          '<details class="qa-item"><summary><span class="q-ico">' + (i + 1) + "</span><span>" + q.q + "</span></summary>" +
          '<div class="answer">' + q.a + "</div></details>").join("") + "</div>"
      : "";
    return '<details class="lesson-card" id="les-' + lid + '">' +
      '<summary><span class="lesson-num">' + n.toLocaleString("fa-IR") + "</span>" +
      '<span class="lesson-title">' + ls.title + "</span>" +
      '<span class="chev">' + window.ICONS.svg("chevron") + "</span></summary>" +
      '<div class="lesson-body">' +
      '<div style="margin:12px 0"><label class="mark-read' + (done ? " checked" : "") + '">' +
      '<input type="checkbox" data-lesson="' + lid + '"' + (done ? " checked" : "") + "> این درس را خوانده‌ام</label></div>" +
      '<div class="lesson-summary">' + (ls.summary || "") + "</div>" + pts + vocab + qa +
      "</div></details>";
  }

  /* ---------- SEO: متادیتای پویا + پشتیبانی از ?q= ---------- */
  function setBookMeta(book) {
    const base = "https://javadxpro.github.io/class/";
    const title = book.title + " — خلاصه درس‌ها و سوالات امتحان | نهمیتو";
    const desc = "خلاصه درس‌به‌درس " + book.title + " با نکات کلیدی، واژگان و سوالات احتمالی امتحان با پاسخ تشریحی — مجموعه آموزشی نهمیتو.";
    const url = base + "book.html?b=" + book.id;
    document.title = title;
    const setMeta = (key, attr, content) => {
      let el = document.querySelector("meta[" + attr + '="' + key + '"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", "name", desc);
    setMeta("og:title", "property", title);
    setMeta("og:description", "property", desc);
    setMeta("og:url", "property", url);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
    const lessons = [];
    (book.chapters || []).forEach(c => (c.lessons || []).forEach(l => lessons.push(l.title)));
    const ld = {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: book.title,
      description: desc,
      url: url,
      inLanguage: "fa",
      isPartOf: { "@type": "WebSite", name: "نهمیتو", url: base },
      educationalLevel: "متوسطه اول — پایه نهم",
      learningResourceType: ["خلاصه درس", "سوال امتحانی"],
      about: lessons.slice(0, 12)
    };
    let ldEl = document.getElementById("ld-book");
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.id = "ld-book";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(ld);
  }

  function initQuerySearch() {
    try {
      const params = new URLSearchParams(location.search);
      const q = (params.get("q") || "").trim();
      if (!q) return;
      const input = document.getElementById("globalSearch");
      if (!input) return;
      input.value = q;
      input.dispatchEvent(new Event("input"));
      const books = document.getElementById("books");
      if (books) books.scrollIntoView({ behavior: "auto", block: "start" });
    } catch (e) { /* ignore */ }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHome();
    renderBook();
    const bid = new URLSearchParams(location.search).get("b");
    const meta = (window.BOOKS_META || []).find(m => m.id === bid);
    const data = (window.BOOKS_DATA || {})[bid];
    if (data) setBookMeta(data);
    else if (meta && bid) {
      setBookMeta({ id: meta.id, title: meta.title, chapters: [] });
    }
    initQuerySearch();
    window.ICONS.hydrate(document);
  });
})();
