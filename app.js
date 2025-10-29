const STORAGE_KEY = "cropcarbon-portal-state-v2";

const emissionFactors = {
  electricity: 0.000417, // metric tons CO2e per kWh
  carMile: 0.000404, // average passenger vehicle
  transitMile: 0.000136,
  flightHour: 0.09,
  diet: {
    omnivore: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  },
};

const statusConfig = {
  active: { label: "Raising Now", badge: "status--active" },
  upcoming: { label: "Coming Soon", badge: "status--upcoming" },
  complete: { label: "Funded", badge: "status--complete" },
};

const seededProjects = [
  {
    id: "project-1",
    title: "Biochar Kiln Cooperative",
    region: "Embu, Kenya",
    focus: "Soil carbon & biochar",
    summary:
      "Community kilns transform crop waste into biochar, locking carbon in the ground while boosting yields.",
    hectares: 160,
    farmers: 48,
    carbon: 920,
    raised: 18750,
    goal: 32000,
    status: "active",
    timeline: "Construction crews on-site",
    image:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "project-2",
    title: "Agroforestry Farmer Grants",
    region: "Atlántico, Colombia",
    focus: "Shade-grown agroforestry",
    summary:
      "Microgrants and field schools help farmers interplant cacao, timber, and nitrogen-fixing trees for living carbon banks.",
    hectares: 300,
    farmers: 72,
    carbon: 1460,
    raised: 9200,
    goal: 28000,
    status: "upcoming",
    timeline: "Training cohort forming",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "project-3",
    title: "Soil Carbon Verification Lab",
    region: "Kisumu, Kenya",
    focus: "MRV & soil labs",
    summary:
      "A mobile lab validates farmer soil samples so cooperatives can access premium carbon markets and regenerative premiums.",
    hectares: 210,
    farmers: 96,
    carbon: 1250,
    raised: 7200,
    goal: 12000,
    status: "complete",
    timeline: "Equipment installed and calibrated",
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
  },
];

const seededUpdates = [
  {
    id: "update-1",
    title: "Sabana River Wetland Revival",
    location: "Tolima, Colombia",
    hectares: 185,
    farmers: 62,
    carbon: 940,
    raised: 18750,
    goal: 26000,
    status: "active",
    summary:
      "Rehydrating drained paddies so native reeds can return, creating wildlife nurseries and income from regenerative rice.",
    updatedAt: "2024-05-18T00:00:00.000Z",
  },
  {
    id: "update-2",
    title: "Great Plains Windbreak Network",
    location: "Nebraska, USA",
    hectares: 320,
    farmers: 41,
    carbon: 1120,
    raised: 7600,
    goal: 20000,
    status: "upcoming",
    summary:
      "Designing tree corridors to shield soil from erosion while co-locating pollinator strips for prairie restoration.",
    updatedAt: "2024-04-30T00:00:00.000Z",
  },
  {
    id: "update-3",
    title: "Kilifi Coast Mangrove Guardians",
    location: "Kilifi, Kenya",
    hectares: 74,
    farmers: 88,
    carbon: 1460,
    raised: 23500,
    goal: 23500,
    status: "complete",
    summary:
      "Local youth collect propagules at dawn and have already replanted 48,000 mangroves to buffer villages from storms.",
    updatedAt: "2024-03-22T00:00:00.000Z",
  },
];

const seededDonations = [
  {
    name: "Ava R.",
    amount: 250,
    frequency: "monthly",
    message: "Excited to support the soil lab rollout!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    name: "GreenSeed Ventures",
    amount: 5000,
    frequency: "once",
    message: "Matching gifts all week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

function toValidDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function cloneProjects(projects = seededProjects) {
  return projects.map((project, index) => ({
    id: project.id || `project-${index + 1}`,
    title: project.title,
    region: project.region,
    focus: project.focus,
    summary: project.summary,
    hectares: Number(project.hectares) || 0,
    farmers: Number(project.farmers) || 0,
    carbon: Number(project.carbon) || 0,
    raised: Number(project.raised) || 0,
    goal: Number(project.goal) || 0,
    status: project.status || "active",
    timeline: project.timeline || "",
    image: project.image || "",
  }));
}

function cloneUpdates(updates = seededUpdates) {
  return updates.map((update, index) => ({
    id: update.id || `update-${index + 1}`,
    title: update.title,
    location: update.location,
    hectares: Number(update.hectares) || 0,
    farmers: Number(update.farmers) || 0,
    carbon: Number(update.carbon) || 0,
    raised: Number(update.raised) || 0,
    goal: Number(update.goal) || 0,
    status: update.status || "active",
    summary: update.summary,
    updatedAt: toValidDate(update.updatedAt),
  }));
}

function cloneDonations(donations = seededDonations) {
  return donations.map((donation) => ({
    name: donation.name,
    amount: Number(donation.amount) || 0,
    frequency: donation.frequency || "once",
    message: donation.message || "",
    timestamp: toValidDate(donation.timestamp),
  }));
}

function createDefaultState() {
  return {
    campaign: {
      goal: 72000,
      raised: 28650,
      projects: cloneProjects(),
    },
    updates: cloneUpdates(),
    donations: cloneDonations(),
    meta: {
      updateCounter: seededUpdates.length + 1,
    },
  };
}

function getStorage() {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }
  try {
    const testKey = "__cropcarbon_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    console.warn("Local storage unavailable", error);
    return null;
  }
}

const storage = getStorage();

function hydrateState(stored) {
  const base = createDefaultState();
  if (!stored || typeof stored !== "object") {
    return base;
  }

  const campaign = stored.campaign || {};
  const updates = Array.isArray(stored.updates) ? stored.updates : [];
  const donations = Array.isArray(stored.donations) ? stored.donations : [];
  const meta = stored.meta || {};

  return {
    campaign: {
      goal: Number(campaign.goal) || base.campaign.goal,
      raised: Number(campaign.raised) || base.campaign.raised,
      projects: base.campaign.projects,
    },
    updates: updates.length ? cloneUpdates(updates) : base.updates,
    donations: donations.length ? cloneDonations(donations) : base.donations,
    meta: {
      updateCounter: Number(meta.updateCounter) || base.meta.updateCounter,
    },
  };
}

function loadState() {
  const base = createDefaultState();
  if (!storage) {
    return base;
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return base;
  }

  try {
    const parsed = JSON.parse(raw);
    return hydrateState(parsed);
  } catch (error) {
    console.warn("Failed to parse stored state", error);
    return base;
  }
}

let state = loadState();
state.meta.updateCounter = Math.max(state.meta.updateCounter || 1, state.updates.length + 1);

function persistState() {
  if (!storage) {
    return;
  }

  const serialisable = {
    campaign: {
      goal: state.campaign.goal,
      raised: state.campaign.raised,
      projects: state.campaign.projects,
    },
    updates: state.updates.map((update) => ({
      ...update,
      updatedAt: update.updatedAt.toISOString(),
    })),
    donations: state.donations.map((donation) => ({
      ...donation,
      timestamp: donation.timestamp.toISOString(),
    })),
    meta: {
      updateCounter: state.meta.updateCounter,
    },
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
  } catch (error) {
    console.warn("Failed to persist state", error);
  }
}

const footprintForm = document.getElementById("footprint-form");
const resultEl = document.querySelector("#footprint-result [data-field='total']");
const donationForm = document.getElementById("donation-form");
const donationList = document.getElementById("donation-list");
const goalField = document.querySelector("[data-field='goal']");
const raisedField = document.querySelector("[data-field='raised']");
const percentField = document.querySelector("[data-field='percent']");
const progressFill = document.querySelector("[data-field='progress']");
const campaignPanel = document.getElementById("campaign-panel");
const updatesGrid = document.getElementById("updates-grid");
const statHectares = document.querySelector("[data-stat='hectares']");
const statFarmers = document.querySelector("[data-stat='farmers']");
const statCarbon = document.querySelector("[data-stat='carbon']");

const campaignMetrics = {
  active: document.querySelector("[data-campaign-metric='active']"),
  upcoming: document.querySelector("[data-campaign-metric='upcoming']"),
  complete: document.querySelector("[data-campaign-metric='complete']"),
  carbon: document.querySelector("[data-campaign-metric='carbon']"),
  hectares: document.querySelector("[data-campaign-metric='hectares']"),
  farmers: document.querySelector("[data-campaign-metric='farmers']"),
};

const adminToggle = document.getElementById("admin-toggle");
const adminPanel = document.getElementById("admin-panel");
const adminClose = document.getElementById("admin-close");
const adminBackdrop = document.getElementById("admin-backdrop");
const adminCampaignForm = document.getElementById("admin-campaign-form");
const adminGoalInput = document.getElementById("admin-goal");
const adminRaisedInput = document.getElementById("admin-raised");
const adminUpdateForm = document.getElementById("admin-update-form");
const adminUpdatesList = document.getElementById("admin-updates-list");
const adminFeedback = document.getElementById("admin-feedback");

function formatCurrency(value) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value, options = {}) {
  return value.toLocaleString(undefined, options);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toSafeImageUrl(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const base = typeof window !== "undefined" && window.location ? window.location.origin : "https://example.com";
  try {
    const url = new URL(trimmed, base);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function formatRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(Math.round(diff / 60000), 0);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calculateFootprint(formData) {
  const electricity = Number(formData.get("electricity")) || 0;
  const carMiles = Number(formData.get("car-miles")) || 0;
  const transitMiles = Number(formData.get("transit-miles")) || 0;
  const flightHours = Number(formData.get("flight-hours")) || 0;
  const diet = formData.get("diet");
  const household = Math.max(Number(formData.get("household")) || 1, 1);

  const annualElectricity = electricity * 12 * emissionFactors.electricity;
  const annualCar = carMiles * 52 * emissionFactors.carMile;
  const annualTransit = transitMiles * 52 * emissionFactors.transitMile;
  const annualFlights = flightHours * 12 * emissionFactors.flightHour;
  const dietImpact = emissionFactors.diet[diet] ?? emissionFactors.diet.omnivore;

  const totalHousehold = annualElectricity + annualCar + annualTransit + annualFlights + dietImpact;
  const perPerson = totalHousehold / household;

  return {
    totalHousehold,
    perPerson,
    breakdown: {
      electricity: annualElectricity,
      car: annualCar,
      transit: annualTransit,
      flights: annualFlights,
      diet: dietImpact,
    },
  };
}

function updateFootprintDisplay(perPerson) {
  const rounded = perPerson.toFixed(2);
  resultEl.textContent = rounded;
}

function updateImpactStats() {
  const totals = state.updates.reduce(
    (acc, item) => {
      acc.hectares += Number(item.hectares) || 0;
      acc.farmers += Number(item.farmers) || 0;
      acc.carbon += Number(item.carbon) || 0;
      return acc;
    },
    { hectares: 0, farmers: 0, carbon: 0 }
  );

  statHectares.textContent = formatNumber(totals.hectares, { maximumFractionDigits: 0 });
  statFarmers.textContent = formatNumber(totals.farmers);
  statCarbon.textContent = formatNumber(totals.carbon);
}

function updateCampaignOverview() {
  const summary = state.campaign.projects.reduce(
    (acc, project) => {
      const statusKey =
        project.status && Object.prototype.hasOwnProperty.call(acc.counts, project.status) ? project.status : "active";
      acc.counts[statusKey] += 1;
      acc.totals.hectares += Number(project.hectares) || 0;
      acc.totals.farmers += Number(project.farmers) || 0;
      acc.totals.carbon += Number(project.carbon) || 0;
      return acc;
    },
    {
      counts: { active: 0, upcoming: 0, complete: 0 },
      totals: { hectares: 0, farmers: 0, carbon: 0 },
    }
  );

  if (campaignMetrics.active) {
    campaignMetrics.active.textContent = formatNumber(summary.counts.active);
  }
  if (campaignMetrics.upcoming) {
    campaignMetrics.upcoming.textContent = formatNumber(summary.counts.upcoming);
  }
  if (campaignMetrics.complete) {
    campaignMetrics.complete.textContent = formatNumber(summary.counts.complete);
  }
  if (campaignMetrics.hectares) {
    campaignMetrics.hectares.textContent = formatNumber(summary.totals.hectares, { maximumFractionDigits: 0 });
  }
  if (campaignMetrics.farmers) {
    campaignMetrics.farmers.textContent = formatNumber(summary.totals.farmers);
  }
  if (campaignMetrics.carbon) {
    campaignMetrics.carbon.textContent = formatNumber(summary.totals.carbon, { maximumFractionDigits: 0 });
  }
}

function renderCampaignPanel() {
  campaignPanel.innerHTML = "";
  const statusOrder = { active: 0, upcoming: 1, complete: 2 };

  state.campaign.projects
    .slice()
    .sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
      if (statusDiff !== 0) return statusDiff;
      return (b.raised / (b.goal || 1)) - (a.raised / (a.goal || 1));
    })
    .forEach((project) => {
      const percent = project.goal ? Math.min(Math.round((Number(project.raised) / Number(project.goal)) * 100), 999) : null;
      const item = document.createElement("article");
      item.className = `campaign-item ${statusConfig[project.status]?.badge ?? ""}`.trim();
      item.setAttribute("role", "listitem");

      const media = document.createElement("figure");
      media.className = "campaign-item__media";
      const imageUrl = toSafeImageUrl(project.image);
      if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `${project.title} landscape`;
        img.loading = "lazy";
        media.appendChild(img);
      }
      const statusBadge = document.createElement("figcaption");
      statusBadge.className = "pill campaign-item__status";
      statusBadge.textContent = statusConfig[project.status]?.label ?? "Project";
      media.appendChild(statusBadge);
      item.appendChild(media);

      const header = document.createElement("header");
      header.className = "campaign-item__header";
      const headerText = document.createElement("div");

      const eyebrow = document.createElement("p");
      eyebrow.className = "campaign-item__eyebrow";
      eyebrow.textContent = project.region;
      headerText.appendChild(eyebrow);

      const title = document.createElement("h3");
      title.textContent = project.title;
      headerText.appendChild(title);

      const focus = document.createElement("p");
      focus.className = "campaign-item__focus";
      focus.textContent = project.focus;
      headerText.appendChild(focus);

      header.appendChild(headerText);
      item.appendChild(header);

      const summary = document.createElement("p");
      summary.className = "campaign-item__summary";
      summary.textContent = project.summary;
      item.appendChild(summary);

      const metrics = document.createElement("dl");
      metrics.className = "campaign-item__metrics";
      [
        ["Hectares", formatNumber(Number(project.hectares) || 0)],
        ["Farmers", formatNumber(Number(project.farmers) || 0)],
        ["Carbon", `${formatNumber(Number(project.carbon) || 0)} t`],
      ].forEach(([label, value]) => {
        const block = document.createElement("div");
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        block.append(dt, dd);
        metrics.appendChild(block);
      });
      item.appendChild(metrics);

      const footer = document.createElement("div");
      footer.className = "campaign-item__footer";

      const progress = document.createElement("div");
      progress.className = "progress progress--inline";
      const progressLabel = document.createElement("div");
      progressLabel.className = "progress__label";
      progressLabel.textContent = `Raised ${formatCurrency(Number(project.raised) || 0)} of ${formatCurrency(Number(project.goal) || 0)}`;
      progress.appendChild(progressLabel);

      const progressBar = document.createElement("div");
      progressBar.className = "progress__bar";
      const progressFill = document.createElement("div");
      progressFill.className = "progress__fill";
      progressFill.style.width = `${percent !== null ? Math.min(percent, 100) : 0}%`;
      progressBar.appendChild(progressFill);
      progress.appendChild(progressBar);

      const progressPercent = document.createElement("span");
      progressPercent.className = "progress__percent";
      progressPercent.textContent = percent !== null ? `${percent}% funded` : "";
      progress.appendChild(progressPercent);

      footer.appendChild(progress);

      const timeline = document.createElement("p");
      timeline.className = "campaign-item__timeline";
      timeline.textContent = project.timeline;
      footer.appendChild(timeline);

      item.appendChild(footer);

      campaignPanel.appendChild(item);
    });

  updateCampaignOverview();
}

function renderUpdates() {
  updatesGrid.innerHTML = "";
  const statusOrder = { active: 0, upcoming: 1, complete: 2 };
  state.updates
    .slice()
    .sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
      if (statusDiff !== 0) return statusDiff;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    })
    .forEach((update) => {
      const percent = update.goal
        ? Math.min(Math.round((Number(update.raised) / Number(update.goal)) * 100), 999)
        : null;
      const card = document.createElement("article");
      card.className = `update-card ${statusConfig[update.status]?.badge ?? ""}`.trim();
      card.setAttribute("role", "listitem");
      card.innerHTML = `
        <header class="update-card__header">
          <div>
            <p class="update-card__eyebrow">${escapeHtml(update.location)}</p>
            <h3>${escapeHtml(update.title)}</h3>
          </div>
          <span class="pill">${escapeHtml(statusConfig[update.status]?.label ?? "Update")}</span>
        </header>
        <p class="update-card__summary">${escapeHtml(update.summary)}</p>
        <dl class="update-card__metrics">
          <div>
            <dt>Hectares</dt>
            <dd>${formatNumber(Number(update.hectares) || 0)}</dd>
          </div>
          <div>
            <dt>Farmers</dt>
            <dd>${formatNumber(Number(update.farmers) || 0)}</dd>
          </div>
          <div>
            <dt>Carbon</dt>
            <dd>${formatNumber(Number(update.carbon) || 0)} t</dd>
          </div>
        </dl>
        <div class="update-card__footer">
          <time datetime="${update.updatedAt.toISOString()}">Updated ${formatDate(update.updatedAt)}</time>
          ${
            percent !== null
              ? `<div class="update-progress"><span>${formatCurrency(Number(update.raised) || 0)} raised</span><div class="progress__bar"><div class="progress__fill" style="width: ${Math.min(percent, 100)}%"></div></div><span>${percent}% of ${formatCurrency(Number(update.goal) || 0)}</span></div>`
              : ""
          }
        </div>
      `;
      updatesGrid.appendChild(card);
    });

  updateImpactStats();
}

function renderAdminUpdates() {
  adminUpdatesList.innerHTML = "";
  state.updates.forEach((update) => {
    const li = document.createElement("li");
    li.className = `admin-updates__item ${statusConfig[update.status]?.badge ?? ""}`.trim();
    li.dataset.id = update.id;
    li.innerHTML = `
      <div class="admin-updates__header">
        <h4>${escapeHtml(update.title)}</h4>
        <span class="pill">${escapeHtml(statusConfig[update.status]?.label ?? "Update")}</span>
      </div>
      <label>
        Location
        <input type="text" class="admin-update-location" value="${escapeHtml(update.location)}" />
      </label>
      <label>
        Status
        <select class="admin-status-select">
          ${Object.entries(statusConfig)
            .map(
              ([key, value]) =>
                `<option value="${key}" ${key === update.status ? "selected" : ""}>${value.label}</option>`
            )
            .join("")}
        </select>
      </label>
      <div class="admin-form__grid admin-form__grid--metrics">
        <label>
          Hectares
          <input type="number" class="admin-update-hectares" min="0" step="0.1" value="${Number(update.hectares) || 0}" />
        </label>
        <label>
          Farmers
          <input type="number" class="admin-update-farmers" min="0" step="1" value="${Number(update.farmers) || 0}" />
        </label>
        <label>
          Carbon (t)
          <input type="number" class="admin-update-carbon" min="0" step="1" value="${Number(update.carbon) || 0}" />
        </label>
      </div>
      <div class="admin-form__grid">
        <label>
          Raised ($)
          <input type="number" class="admin-update-raised" min="0" step="100" value="${Number(update.raised) || 0}" />
        </label>
        <label>
          Goal ($)
          <input type="number" class="admin-update-goal" min="0" step="100" value="${Number(update.goal) || 0}" />
        </label>
      </div>
      <label>
        Summary
        <textarea class="admin-update-summary" rows="2">${escapeHtml(update.summary)}</textarea>
      </label>
      <div class="admin-updates__actions">
        <button type="button" class="button button--small admin-save">Save</button>
        <button type="button" class="button button--ghost button--small admin-delete">Remove</button>
      </div>
    `;
    adminUpdatesList.appendChild(li);
  });
}

function showAdminMessage(message, tone = "info") {
  adminFeedback.textContent = message;
  adminFeedback.dataset.tone = tone;
  if (message) {
    setTimeout(() => {
      adminFeedback.textContent = "";
      adminFeedback.dataset.tone = "";
    }, 4000);
  }
}

function openAdminPanel() {
  adminPanel.setAttribute("aria-hidden", "false");
  adminPanel.classList.add("admin-panel--open");
  adminBackdrop.hidden = false;
  adminPanel.focus();
}

function closeAdminPanel() {
  adminPanel.setAttribute("aria-hidden", "true");
  adminPanel.classList.remove("admin-panel--open");
  adminBackdrop.hidden = true;
  adminToggle.focus();
}

function handleGlobalKeyDown(event) {
  if (event.key === "Escape" && adminPanel.classList.contains("admin-panel--open")) {
    closeAdminPanel();
  }
}

function renderDonations() {
  donationList.innerHTML = "";
  state.donations
    .slice()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 6)
    .forEach((donation) => {
      const li = document.createElement("li");
      li.className = "donation-item";
      const messageHtml = donation.message
        ? `<div class="donation-item__message">“${escapeHtml(donation.message)}”</div>`
        : "";
      li.innerHTML = `
        <strong>${escapeHtml(donation.name)}</strong>
        <div>${formatCurrency(donation.amount)} • ${escapeHtml(donation.frequency)}</div>
        <div class="donation-item__meta">${escapeHtml(formatRelativeTime(donation.timestamp))}</div>
        ${messageHtml}
      `;
      donationList.appendChild(li);
    });

  goalField.textContent = state.campaign.goal.toLocaleString();
  raisedField.textContent = state.campaign.raised.toLocaleString();
  const percentRaw = state.campaign.goal > 0 ? (state.campaign.raised / state.campaign.goal) * 100 : 100;
  const percent = Math.min(Math.round(percentRaw), 999);
  percentField.textContent = percent.toString();
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  adminGoalInput.value = state.campaign.goal.toString();
  adminRaisedInput.value = state.campaign.raised.toString();
}

function handleFootprintSubmit(event) {
  event.preventDefault();
  const formData = new FormData(footprintForm);
  const { perPerson } = calculateFootprint(formData);
  updateFootprintDisplay(perPerson);
}

function handleDonationSubmit(event) {
  event.preventDefault();
  const formData = new FormData(donationForm);
  const amount = Math.max(Number(formData.get("donation-amount")) || 0, 1);
  const frequency = formData.get("frequency") || "once";
  const message = formData.get("donor-message")?.trim();

  state.donations.unshift({
    name: "You",
    amount,
    frequency,
    message,
    timestamp: new Date(),
  });

  const multiplier = frequency === "monthly" ? 12 : 1;
  state.campaign.raised += amount * multiplier;

  donationForm.reset();
  donationForm.querySelector("input[name='frequency'][value='once']").checked = true;

  persistState();
  renderDonations();
}

function handleCampaignFormSubmit(event) {
  event.preventDefault();
  const goal = Math.max(Number(adminGoalInput.value) || 0, 0);
  const raised = Math.max(Number(adminRaisedInput.value) || 0, 0);

  state.campaign.goal = goal;
  state.campaign.raised = raised;
  persistState();
  renderDonations();
  showAdminMessage("Campaign totals updated.");
}

function handleUpdateFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(adminUpdateForm);
  const title = formData.get("title")?.trim();
  const location = formData.get("location")?.trim();
  const status = formData.get("status") || "active";
  const hectares = Number(formData.get("hectares")) || 0;
  const farmers = Number(formData.get("farmers")) || 0;
  const carbon = Number(formData.get("carbon")) || 0;
  const raised = Number(formData.get("raised")) || 0;
  const goal = Number(formData.get("goal")) || 0;
  const summary = formData.get("summary")?.trim() || "";

  if (!title || !location || !summary) {
    showAdminMessage("Please complete all fields before publishing.", "error");
    return;
  }

  const id = `update-${state.meta.updateCounter++}`;
  state.updates.unshift({
    id,
    title,
    location,
    status,
    hectares,
    farmers,
    carbon,
    raised,
    goal,
    summary,
    updatedAt: new Date(),
  });

  adminUpdateForm.reset();
  persistState();
  renderUpdates();
  renderAdminUpdates();
  showAdminMessage("New field update published.");
}

function handleAdminUpdatesInteraction(event) {
  const item = event.target.closest(".admin-updates__item");
  if (!item) return;
  const id = item.dataset.id;
  const update = state.updates.find((entry) => entry.id === id);
  if (!update) return;

  if (event.target.classList.contains("admin-save")) {
    const statusSelect = item.querySelector(".admin-status-select");
    const raisedInput = item.querySelector(".admin-update-raised");
    const goalInput = item.querySelector(".admin-update-goal");
    const summaryInput = item.querySelector(".admin-update-summary");
    const locationInput = item.querySelector(".admin-update-location");
    const hectaresInput = item.querySelector(".admin-update-hectares");
    const farmersInput = item.querySelector(".admin-update-farmers");
    const carbonInput = item.querySelector(".admin-update-carbon");

    update.status = statusSelect?.value ?? update.status;
    update.raised = Number(raisedInput?.value) || 0;
    update.goal = Number(goalInput?.value) || 0;
    update.summary = summaryInput?.value?.trim() || update.summary;
    update.location = locationInput?.value?.trim() || update.location;
    update.hectares = Number(hectaresInput?.value) || 0;
    update.farmers = Number(farmersInput?.value) || 0;
    update.carbon = Number(carbonInput?.value) || 0;
    update.updatedAt = new Date();

    persistState();
    renderUpdates();
    renderAdminUpdates();
    showAdminMessage("Update saved.");
  }

  if (event.target.classList.contains("admin-delete")) {
    state.updates = state.updates.filter((entry) => entry.id !== id);
    persistState();
    renderUpdates();
    renderAdminUpdates();
    showAdminMessage("Update removed.", "warning");
  }
}

function initializeAdminForms() {
  adminGoalInput.value = state.campaign.goal.toString();
  adminRaisedInput.value = state.campaign.raised.toString();
  renderAdminUpdates();
}

document.getElementById("year").textContent = new Date().getFullYear();
renderCampaignPanel();
renderDonations();
renderUpdates();
initializeAdminForms();

const initialData = new FormData(footprintForm);
const { perPerson: initialPerPerson } = calculateFootprint(initialData);
updateFootprintDisplay(initialPerPerson);

footprintForm.addEventListener("submit", handleFootprintSubmit);
donationForm.addEventListener("submit", handleDonationSubmit);
adminToggle.addEventListener("click", openAdminPanel);
adminClose.addEventListener("click", closeAdminPanel);
adminBackdrop.addEventListener("click", closeAdminPanel);
adminCampaignForm.addEventListener("submit", handleCampaignFormSubmit);
adminUpdateForm.addEventListener("submit", handleUpdateFormSubmit);
adminUpdatesList.addEventListener("click", handleAdminUpdatesInteraction);
document.addEventListener("keydown", handleGlobalKeyDown);
