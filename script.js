const CONTACT_EMAIL = "edgebyrita@gmail.com";

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const form = document.getElementById("pickup-form");
const formError = document.getElementById("form-error");
const formSuccess = document.getElementById("form-success");
const copyButton = document.getElementById("copy-details");

navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

function fieldValue(name) {
  return String(new FormData(form).get(name) || "").trim();
}

function requiredFields() {
  return ["practice", "contact", "phone", "email", "street", "city", "zip", "count", "date"];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildRequestText() {
  const notes = fieldValue("notes") || "(none)";
  return [
    "Pickup request — Edge by Rita",
    "",
    `Practice / office: ${fieldValue("practice")}`,
    `Contact name: ${fieldValue("contact")}`,
    `Phone: ${fieldValue("phone")}`,
    `Email: ${fieldValue("email")}`,
    `Street: ${fieldValue("street")}`,
    `City: ${fieldValue("city")}`,
    `ZIP: ${fieldValue("zip")}`,
    `Approx. instrument count: ${fieldValue("count")}`,
    `Preferred pickup date: ${fieldValue("date")}`,
    `Notes: ${notes}`,
  ].join("\n");
}

function showError(message) {
  formError.hidden = false;
  formError.textContent = message;
  formSuccess.hidden = true;
}

function clearError() {
  formError.hidden = true;
  formError.textContent = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  let missing = false;
  requiredFields().forEach((name) => {
    const input = form.elements.namedItem(name);
    const empty = !fieldValue(name);
    input.classList.toggle("invalid", empty);
    if (empty) missing = true;
  });

  if (!missing) {
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  }

  if (missing) {
    showError("Please fill in every required field.");
    return;
  }

  const email = fieldValue("email");
  if (!isValidEmail(email)) {
    form.elements.namedItem("email").classList.add("invalid");
    showError("Please enter a valid email address.");
    return;
  }

  const count = Number(fieldValue("count"));
  if (!Number.isFinite(count) || count < 1) {
    form.elements.namedItem("count").classList.add("invalid");
    showError("Instrument count must be at least 1.");
    return;
  }

  const body = buildRequestText();
  const subject = `Pickup request from ${fieldValue("practice")}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  formSuccess.hidden = false;
  formSuccess.textContent =
    "If your mail app opened, send the message to edgebyrita@gmail.com. If it did not, copy the details below and send them yourself.\n\n" +
    body;
  copyButton.hidden = false;
});

copyButton.addEventListener("click", async () => {
  const text = buildRequestText();
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy request details";
    }, 1600);
  } catch {
    formSuccess.hidden = false;
    formSuccess.textContent = "Copy this text manually:\n\n" + text;
  }
});
