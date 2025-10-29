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
  goal: 50000,
  raised: 18250,
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

function formatCurrency(value) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
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

function renderCampaignPanel() {
  campaignPanel.innerHTML = "";
  campaign.projects.forEach((project) => {
    const item = document.createElement("article");
    item.className = "campaign-item";
    item.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p><strong>Impact:</strong> ${project.impact}</p>
    `;
    campaignPanel.appendChild(item);
  });
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
      li.innerHTML = `
        <strong>${donation.name}</strong>
        <div>${formatCurrency(donation.amount)} • ${donation.frequency}</div>
        <div class="donation-item__meta">${formatRelativeTime(donation.timestamp)}</div>
        ${donation.message ? `<div class="donation-item__message">“${donation.message}”</div>` : ""}
      `;
      donationList.appendChild(li);
    });

  goalField.textContent = campaign.goal.toLocaleString();
  raisedField.textContent = campaign.raised.toLocaleString();
  const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 999);
  percentField.textContent = percent.toString();
  progressFill.style.width = `${Math.min(percent, 100)}%`;
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

document.getElementById("year").textContent = new Date().getFullYear();
renderCampaignPanel();
renderDonations();

const initialData = new FormData(footprintForm);
const { perPerson: initialPerPerson } = calculateFootprint(initialData);
updateFootprintDisplay(initialPerPerson);

footprintForm.addEventListener("submit", handleFootprintSubmit);
donationForm.addEventListener("submit", handleDonationSubmit);
