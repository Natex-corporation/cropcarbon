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

const campaign = {
  goal: 72000,
  raised: 28650,
  projects: [
    {
      title: "Biochar Kiln Cooperative",
      description: "Community-owned kilns turning farm waste into carbon-rich biochar that restores depleted soils.",
      impact: "Reduces 1,200 tons of CO₂e annually while boosting yields by up to 18%.",
    },
    {
      title: "Agroforestry Farmer Grants",
      description: "Microgrants and training that help smallholders plant shade trees and diversify their crops.",
      impact: "Plants 45,000 trees and creates new habitat corridors across 300 hectares.",
    },
    {
      title: "Soil Carbon Verification Lab",
      description: "Mobile lab services validating soil carbon gains so farmers can access premium carbon markets.",
      impact: "Cuts verification costs by 60% and unlocks $1.2M in annual farmer income.",
    },
  ],
};

const statusConfig = {
  active: { label: "Raising Now", badge: "status--active" },
  upcoming: { label: "Coming Soon", badge: "status--upcoming" },
  complete: { label: "Funded", badge: "status--complete" },
};

let updateIdCounter = 4;
let updates = [
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
    updatedAt: new Date("2024-05-18"),
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
    updatedAt: new Date("2024-04-30"),
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
    updatedAt: new Date("2024-03-22"),
  },
];

const donations = [
  {
    name: "Ava R.",
    amount: 250,
    frequency: "monthly",
    message: "Excited to support the soil lab rollout!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    name: "GreenSeed Ventures",
    amount: 5000,
    frequency: "once",
    message: "Matching gifts all week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

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

function formatRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
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
  const totals = updates.reduce(
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

function renderCampaignPanel() {
  campaignPanel.innerHTML = "";
  campaign.projects.forEach((project) => {
    const item = document.createElement("article");
    item.className = "campaign-item";
    item.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <p><strong>Impact:</strong> ${escapeHtml(project.impact)}</p>
    `;
    campaignPanel.appendChild(item);
  });
}

function renderUpdates() {
  updatesGrid.innerHTML = "";
  const statusOrder = { active: 0, upcoming: 1, complete: 2 };
  updates
    .slice()
    .sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    })
    .forEach((update) => {
      const percent = update.goal
        ? Math.min(Math.round((Number(update.raised) / Number(update.goal)) * 100), 999)
        : null;
      const card = document.createElement("article");
      card.className = `update-card ${statusConfig[update.status]?.badge ?? ""}`;
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
  updates.forEach((update) => {
    const li = document.createElement("li");
    li.className = `admin-updates__item ${statusConfig[update.status]?.badge ?? ""}`.trim();
    li.dataset.id = update.id;
    li.innerHTML = `
      <div class="admin-updates__header">
        <h4>${escapeHtml(update.title)}</h4>
        <span class="pill">${escapeHtml(statusConfig[update.status]?.label ?? "Update")}</span>
      </div>
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
  donations
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

  goalField.textContent = campaign.goal.toLocaleString();
  raisedField.textContent = campaign.raised.toLocaleString();
  const percentRaw = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 100;
  const percent = Math.min(Math.round(percentRaw), 999);
  percentField.textContent = percent.toString();
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  adminGoalInput.value = campaign.goal.toString();
  adminRaisedInput.value = campaign.raised.toString();
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

  donations.unshift({
    name: "You",
    amount,
    frequency,
    message,
    timestamp: new Date(),
  });

  // Adjust campaign totals based on frequency to show extended impact
  const multiplier = frequency === "monthly" ? 12 : frequency === "annual" ? 1 : 1;
  campaign.raised += amount * multiplier;

  donationForm.reset();
  donationForm.querySelector("input[name='frequency'][value='once']").checked = true;

  renderDonations();
}

function handleCampaignFormSubmit(event) {
  event.preventDefault();
  const goal = Math.max(Number(adminGoalInput.value) || 0, 0);
  const raised = Math.max(Number(adminRaisedInput.value) || 0, 0);

  campaign.goal = goal;
  campaign.raised = raised;
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

  const id = `update-${updateIdCounter++}`;
  updates.unshift({
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
  renderUpdates();
  renderAdminUpdates();
  showAdminMessage("New field update published.");
}

function handleAdminUpdatesInteraction(event) {
  const item = event.target.closest(".admin-updates__item");
  if (!item) return;
  const id = item.dataset.id;
  const update = updates.find((entry) => entry.id === id);
  if (!update) return;

  if (event.target.classList.contains("admin-save")) {
    const statusSelect = item.querySelector(".admin-status-select");
    const raisedInput = item.querySelector(".admin-update-raised");
    const goalInput = item.querySelector(".admin-update-goal");
    const summaryInput = item.querySelector(".admin-update-summary");

    update.status = statusSelect?.value ?? update.status;
    update.raised = Number(raisedInput?.value) || 0;
    update.goal = Number(goalInput?.value) || 0;
    update.summary = summaryInput?.value?.trim() || update.summary;
    update.updatedAt = new Date();

    renderUpdates();
    renderAdminUpdates();
    showAdminMessage("Update saved.");
  }

  if (event.target.classList.contains("admin-delete")) {
    updates = updates.filter((entry) => entry.id !== id);
    renderUpdates();
    renderAdminUpdates();
    showAdminMessage("Update removed.", "warning");
  }
}

function initializeAdminForms() {
  adminGoalInput.value = campaign.goal.toString();
  adminRaisedInput.value = campaign.raised.toString();
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
