/* ===== نهمیتو — آیکون‌های SVG اختصاصی (جایگزین ایموجی) =====
   استایل: stroke جاری (currentColor)، ضخامت ۱.۸، گوشه‌های گرد — هماهنگ با سیستم طراحی سایت
   استفاده: ICONS.svg("name", "کلاس-اضافی")  یا  <span data-icon="name"></span> + ICONS.hydrate() */
(function () {
  "use strict";

  var P = {
    /* ---- آیکون کتاب‌های درسی ---- */
    math:
      '<path d="M5 19V5l14 14z"/>' +
      '<path d="M8.2 19v-2.6M11 19v-4.2M13.8 19v-2.6M16.6 19v-4.2"/>',
    science:
      '<path d="M9 2.5h6"/>' +
      '<path d="M10 2.5v6L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3l-4.5-8.5v-6"/>' +
      '<path d="M7.3 14.2h9.4"/>' +
      '<path d="M10 16.8h.01M13.2 18.2h.01"/>',
    farsi:
      '<path d="M12 6.5C10.2 5.2 7.9 4.5 5 4.5v13c2.9 0 5.2.7 7 2 1.8-1.3 4.1-2 7-2v-13c-2.9 0-5.2.7-7 2z"/>' +
      '<path d="M12 6.5v13"/>' +
      '<path d="M17.3 1.9l.55 1.15 1.25.18-.9.88.21 1.25-1.11-.59-1.11.59.21-1.25-.9-.88 1.25-.18z" fill="currentColor"/>',
    arabic:
      '<path d="M4 4h16v11.5H9.5L4 20V4z"/>' +
      '<path d="M8 8.5h8M8 12h5"/>',
    english:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M3 12h18"/>' +
      '<path d="M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3z"/>',
    social:
      '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13l-6 2.5-6-2.5-6 2.5z"/>' +
      '<path d="M9 4v13M15 6.5v13"/>',
    quran:
      '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' +
      '<path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>' +
      '<path d="M10 2h4v6l-2-1.4L10 8V2z"/>',
    payam:
      '<path d="M20.5 14.8A8.6 8.6 0 0 1 9.2 3.5 8.6 8.6 0 1 0 20.5 14.8z"/>' +
      '<path d="M17.6 2.2l.6 1.3 1.4.2-1 1 .24 1.4-1.24-.66-1.24.66.24-1.4-1-1 1.4-.2z" fill="currentColor"/>',
    defa:
      '<path d="M12 2.5l8 3v5.9c0 4.7-3.2 8.5-8 10.1-4.8-1.6-8-5.4-8-10.1V5.5z"/>' +
      '<path d="M8.5 12l2.5 2.5 4.5-5"/>',
    tech:
      '<rect x="6" y="6" width="12" height="12" rx="2.2"/>' +
      '<path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/>' +
      '<rect x="10" y="10" width="4" height="4" rx="1"/>',
    art:
      '<circle cx="12" cy="12" r="9"/>' +
      '<circle cx="8.2" cy="9.6" r="1.15" fill="currentColor" stroke="none"/>' +
      '<circle cx="12" cy="7.3" r="1.15" fill="currentColor" stroke="none"/>' +
      '<circle cx="15.8" cy="9.6" r="1.15" fill="currentColor" stroke="none"/>' +
      '<circle cx="12" cy="12.4" r="1.15" fill="currentColor" stroke="none"/>',
    write:
      '<path d="M4 20l1-4.2L16.3 4.5a2.1 2.1 0 0 1 3 3L8 18.8 4 20z"/>' +
      '<path d="M14.5 6.5l3 3"/>',

    /* ---- آیکون‌های رابط کاربری ---- */
    search:
      '<circle cx="11" cy="11" r="7"/>' +
      '<path d="M20 20l-3.9-3.9"/>',
    "search-x":
      '<circle cx="11" cy="11" r="7"/>' +
      '<path d="M20 20l-3.9-3.9"/>' +
      '<path d="M9.2 9.2l3.6 3.6M12.8 9.2l-3.6 3.6"/>',
    moon:
      '<path d="M20.5 14.8A8.6 8.6 0 0 1 9.2 3.5 8.6 8.6 0 1 0 20.5 14.8z"/>',
    sun:
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    "check-circle":
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M8 12.2l2.7 2.7L16 9.5"/>',
    check:
      '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    book:
      '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' +
      '<path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
    bookopen:
      '<path d="M12 6.5C10.2 5.2 7.9 4.5 5 4.5v13c2.9 0 5.2.7 7 2 1.8-1.3 4.1-2 7-2v-13c-2.9 0-5.2.7-7 2z"/>' +
      '<path d="M12 6.5v13"/>',
    doc:
      '<path d="M7 2.5h7L19 7v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/>' +
      '<path d="M14 2.5V7h5"/>' +
      '<path d="M9 12h6M9 16h4"/>',
    contrast:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
    target:
      '<circle cx="12" cy="12" r="8.5"/>' +
      '<circle cx="12" cy="12" r="4.5"/>' +
      '<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    star:
      '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.85L6.6 20l1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>',
    help:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M9.3 9.2a2.8 2.8 0 1 1 3.4 3.1c-.7.25-1 .8-1 1.5v.4"/>' +
      '<path d="M11.8 17.2h.01"/>',
    bulb:
      '<path d="M9.2 18h5.6M10.2 21h3.6"/>' +
      '<path d="M12 3a6.2 6.2 0 0 0-3.7 11.2c.8.6 1.2 1.5 1.2 2.4h5c0-.9.4-1.8 1.2-2.4A6.2 6.2 0 0 0 12 3z"/>',
    library:
      '<path d="M4 4h5v16H4z"/>' +
      '<path d="M11 5l4.8-1.1 3.5 15-4.8 1.1z"/>',
    arrowup:
      '<path d="M12 20V4M5 11l7-7 7 7"/>',
    chevron:
      '<path d="M6 9.5l6 6 6-6"/>',
    print:
      '<path d="M7 8V3h10v5"/>' +
      '<path d="M7 18H5.5A2.5 2.5 0 0 1 3 15.5v-5A2.5 2.5 0 0 1 5.5 8h13A2.5 2.5 0 0 1 21 10.5v5A2.5 2.5 0 0 1 18.5 18H17"/>' +
      '<path d="M7 14h10v7H7z"/>' +
      '<path d="M17.5 11.5h.01"/>'
  };

  function svg(name, cls) {
    var body = P[name] != null ? P[name] : '<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>';
    return '<svg class="ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  function hydrate(root) {
    root = root || document;
    var list = root.querySelectorAll("[data-icon]");
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      var cls = el.className ? " " + el.className : "";
      el.outerHTML = svg(el.getAttribute("data-icon"), cls.trim());
    }
    var notes = root.querySelectorAll(".lesson-summary .note");
    for (var j = 0; j < notes.length; j++) {
      var note = notes[j];
      if (note.getAttribute("data-note-icon")) continue;
      note.setAttribute("data-note-icon", "1");
      var label = document.createElement("b");
      label.className = "note-label";
      label.innerHTML = svg("bulb") + " نکته: ";
      note.insertBefore(label, note.firstChild);
    }
  }

  window.ICONS = { svg: svg, hydrate: hydrate, names: P };
})();
