// public/calendar.js
(() => {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("calTitle");
  const prevBtn = document.getElementById("calPrev");
  const nextBtn = document.getElementById("calNext");
  const clearBtn = document.getElementById("calClear");
  const card = document.getElementById("calendarCard");
  const catSticker = card?.querySelector(".cat-sticker");
  const catFace = document.getElementById("catFace");

  if (!grid || !title || !card) return;

  let activeKind = "mentor";
  let cursor = new Date();
  cursor.setDate(1);

  const keyForMonth = (d) =>
    `circulumn_calendar_${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, "0")}`;

  const loadMonthEvents = () => {
    try { return JSON.parse(localStorage.getItem(keyForMonth(cursor)) || "{}"); }
    catch { return {}; }
  };

  const saveMonthEvents = (obj) => {
    localStorage.setItem(keyForMonth(cursor), JSON.stringify(obj));
  };

  const monthName = (d) => d.toLocaleString(undefined, { month: "long", year: "numeric" });

  // 🐱 Blink + Meow + ✨ sparkles (emoji swap so it's obvious)
  let t1 = null, t2 = null, t3 = null;
  const meow = () => {
    if (!catSticker || !catFace) return;

    // restart sparkle + glow
    catSticker.classList.remove("cat-animate", "cat-sparkle");
    void catSticker.offsetWidth;
    catSticker.classList.add("cat-animate", "cat-sparkle");

    // clear old timers
    [t1, t2, t3].forEach(t => t && clearTimeout(t));

    catFace.textContent = "🐱";          // baseline
    t1 = setTimeout(() => { catFace.textContent = "😺"; }, 80);   // blink-ish moment
    t2 = setTimeout(() => { catFace.textContent = "😸"; }, 220);  // mouth open (meow)
    t3 = setTimeout(() => { catFace.textContent = "🐱"; }, 520);  // reset

    setTimeout(() => catSticker.classList.remove("cat-animate", "cat-sparkle"), 700);
  };

  const emojiFor = (kind) => {
    switch (kind) {
      case "mentor": return "🤝";
      case "study": return "🎀";
      case "busy": return "🧸";
      case "matcha": return "🍵";
      case "coffee": return "☕";
      case "kpop": return "🫰";
      case "cat": return "🐾";
      case "reading": return "📚";
      case "art": return "🎨";
      default: return "✨";
    }
  };

  const render = () => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();

    title.textContent = monthName(cursor);
    grid.innerHTML = "";

    const firstDay = new Date(y, m, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const events = loadMonthEvents();

    for (let i = 0; i < startWeekday; i++) {
      const blank = document.createElement("div");
      blank.className = "cal-day";
      blank.style.opacity = "0.22";
      blank.style.pointerEvents = "none";
      grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "cal-day";

      const top = document.createElement("div");
      top.className = "flex items-center justify-between";

      const num = document.createElement("div");
      num.className = "cal-num";
      num.textContent = day;

      const hint = document.createElement("div");
      hint.className = "text-xs";
      hint.style.color = "rgba(31,36,48,0.55)";
      hint.textContent = "＋";

      top.appendChild(num);
      top.appendChild(hint);

      const evWrap = document.createElement("div");
      evWrap.className = "cal-events";

      const dayKey = String(day).padStart(2, "0");
      const dayEvents = events[dayKey] || [];

      dayEvents.forEach((kind) => {
        const pill = document.createElement("span");
        pill.className = "cal-pill";
        if (kind === "mentor") pill.classList.add("mauve");
        if (kind === "study") pill.classList.add("orange");
        if (kind === "busy") pill.classList.add("navy");

        pill.title = "Click to remove";
        pill.textContent = emojiFor(kind);

        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          const next = dayEvents.filter(k => k !== kind);
          events[dayKey] = next;
          saveMonthEvents(events);
          render();
        });

        evWrap.appendChild(pill);
      });

      cell.appendChild(top);
      cell.appendChild(evWrap);

      cell.addEventListener("click", () => {
        const list = events[dayKey] || [];
        if (!list.includes(activeKind)) list.push(activeKind);
        events[dayKey] = list;
        saveMonthEvents(events);
        render();
        meow(); // ✅ blink + meow + sparkles
      });

      grid.appendChild(cell);
    }
  };

  document.querySelectorAll("[data-kind]").forEach(el => {
    el.addEventListener("click", () => {
      activeKind = el.dataset.kind;
      document.querySelectorAll("[data-kind]").forEach(x => x.style.outline = "none");
      el.style.outline = "3px solid rgba(242,140,40,0.20)";
      el.style.outlineOffset = "2px";
    });
  });

  const mentorLegend = document.querySelector('[data-kind="mentor"]');
  if (mentorLegend) {
    mentorLegend.style.outline = "3px solid rgba(242,140,40,0.20)";
    mentorLegend.style.outlineOffset = "2px";
  }

  prevBtn?.addEventListener("click", () => {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    render();
  });

  nextBtn?.addEventListener("click", () => {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    render();
  });

  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(keyForMonth(cursor));
    render();
  });

  render();
})();