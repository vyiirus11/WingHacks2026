const $ = (id) => document.getElementById(id);

function setActiveTab(tabName) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".tab").forEach(b => {
    b.classList.remove("bg-black", "text-white");
    b.classList.add("bg-white", "border");
  });

  $(`tab-${tabName}`).classList.remove("hidden");
  const btn = document.querySelector(`.tab[data-tab="${tabName}"]`);
  btn.classList.remove("bg-white", "border");
  btn.classList.add("bg-black", "text-white");
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
});

async function loadSpaces() {
  const tag = $("spaceFilter").value.trim();
  const qs = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const res = await fetch(`/api/spaces${qs}`);
  const spaces = await res.json();

  $("spacesList").innerHTML = spaces.map(s => `
    <div class="p-4 rounded-2xl bg-white border">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="font-bold text-lg">${s.name}</h3>
          <p class="text-sm opacity-80">${s.locationText}</p>
          <p class="text-xs mt-1">Tags: ${(s.tags || []).join(", ")}</p>
        </div>
        <div class="text-right text-sm">
          <div class="font-bold">${s.confidence ?? "—"}</div>
          <div class="text-xs opacity-70">confidence</div>
          <div class="text-xs opacity-70">${s.reviewCount || 0} reviews</div>
        </div>
      </div>
      <div class="mt-2 text-xs opacity-70">Space ID: <span class="font-mono">${s._id}</span></div>
    </div>
  `).join("");
}

$("btnLoadSpaces").addEventListener("click", loadSpaces);

async function loadAnalytics() {
  const res = await fetch("/api/analytics/overview");
  const a = await res.json();

  $("hardestCourses").innerHTML = (a.hardestCourses || []).map(c =>
    `<div class="flex justify-between border-b py-1">
      <div class="font-mono">${c.courseCode}</div>
      <div>Avg stress: <b>${c.avgStress}</b> (${c.reports} reports)</div>
    </div>`
  ).join("") || "<div class='opacity-70'>No data yet.</div>";

  $("topSpaces").innerHTML = (a.topSpaces || []).map(s =>
    `<div class="flex justify-between border-b py-1">
      <div>${s.spaceName}</div>
      <div><b>${s.confidence}</b> (${s.reviews} reviews)</div>
    </div>`
  ).join("") || "<div class='opacity-70'>No data yet.</div>";

  $("safetyFlags").innerHTML = (a.safetyFlags || []).map(s =>
    `<div class="flex justify-between border-b py-1">
      <div>${s.spaceName}</div>
      <div><b>${s.harassmentRiskReports}</b> flagged</div>
    </div>`
  ).join("") || "<div class='opacity-70'>No flags yet.</div>";
}

$("btnLoadAnalytics").addEventListener("click", loadAnalytics);

$("btnMatch").addEventListener("click", async () => {
  $("mentorResults").innerHTML = "Loading...";

  const body = {
    major: $("mMajor").value.trim(),
    year: $("mYear").value.trim(),
    coursesNeedHelp: $("mCourses").value.split(",").map(x => x.trim()).filter(Boolean),
    interests: $("mInterests").value.split(",").map(x => x.trim()).filter(Boolean),
    availability: $("mAvail").value.split(",").map(x => x.trim()).filter(Boolean)
  };

  const res = await fetch("/api/mentors/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const matches = await res.json();

  $("mentorResults").innerHTML = matches.map(m => `
    <div class="p-3 rounded-xl bg-pink-50 border">
      <div class="flex justify-between">
        <div class="font-bold">${m.mentorName}</div>
        <div class="text-sm">Score: <span class="font-bold">${m.matchScore}</span></div>
      </div>
      <div class="text-sm opacity-80">${m.major} • ${m.year}</div>
      <div class="text-xs mt-1">Strong courses: ${(m.coursesStrong || []).join(", ")}</div>
      <div class="text-xs">Interests: ${(m.interests || []).join(", ")}</div>
      <div class="text-xs">Availability: ${(m.availability || []).join(", ")}</div>
      <div class="text-xs italic mt-1">${m.mentorshipStyle || ""}</div>
    </div>
  `).join("");
});

// initial
loadSpaces();
loadAnalytics();