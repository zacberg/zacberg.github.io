const STORAGE_KEY = "carerelay-demo";
const app = document.getElementById("app");
const nav = document.getElementById("primary-nav");
const profileArea = document.getElementById("profile-area");
const toast = document.getElementById("toast");
let data;
let toastTimer;
let activeFilter = "all";

const rosterSeed = [
  { id: 1, name: "Elena Vasquez", age: 68, city: "Tampa", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Harbor Pharmacy", caregiver: "Sam Patel", insurance: "Approved", identityVerified: true },
  { id: 2, name: "Marcus Johnson", age: 54, city: "Tampa", state: "FL", doctor: "Dr. Amir Rahman", pharmacy: "Harbor Pharmacy", caregiver: "Taylor Brooks", insurance: "Pending", identityVerified: true },
  { id: 3, name: "Priya Nair", age: 72, city: "Tampa", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Greenway Rx", caregiver: "Unassigned", insurance: "None", identityVerified: false },
  { id: 4, name: "Robert Kim", age: 61, city: "St. Petersburg", state: "FL", doctor: "Dr. Sofia Alvarez", pharmacy: "Northside Pharmacy", caregiver: "Alex Morgan", insurance: "Approved", identityVerified: true },
  { id: 5, name: "Grace Thompson", age: 47, city: "Tampa", state: "FL", doctor: "Dr. Amir Rahman", pharmacy: "Unassigned", caregiver: "Sam Patel", insurance: "Review", identityVerified: true },
  { id: 6, name: "Daniel Okafor", age: 80, city: "Clearwater", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Harbor Pharmacy", caregiver: "Taylor Brooks", insurance: "Approved", identityVerified: true }
];

function seedData() {
  return {
    users: [
      { email: "elena@demo.test", password: "demo123", name: "Elena Vasquez", role: "patient", age: 68, city: "Tampa", state: "FL", patientId: 1, weight: "", notes: "", insurance: "Approved", identityVerified: true },
      { email: "priya@demo.test", password: "demo123", name: "Priya Nair", role: "patient", age: 72, city: "Tampa", state: "FL", patientId: 3, weight: "", notes: "", insurance: "None", identityVerified: false },
      { email: "sam@demo.test", password: "demo123", name: "Sam Patel", role: "caregiver", patientId: 1 },
      { email: "dr.chen@demo.test", password: "demo123", name: "Dr. Maya Chen", role: "provider", patientId: 1 },
      { email: "jordan@demo.test", password: "demo123", name: "Jordan Lee", role: "coordinator" }
    ],
    patients: structuredClone(rosterSeed),
    session: null
  };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Demo data could not be saved in this browser.", error);
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    data = seedData();
    saveData();
    return data;
  } catch (error) {
    console.warn("Demo data could not be read in this browser.", error);
    return seedData();
  }
}

data = loadData();

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function currentUser() {
  return data.users.find(user => user.email === data.session) || null;
}

function roleLabel(role) {
  return ({ patient: "Patient", caregiver: "Caregiver", provider: "Provider", coordinator: "Care coordinator" })[role] || role;
}

const navByRole = {
  patient: [["Home", "#/home"], ["Insurance", "#/insurance"], ["Find a doctor", "#/doctors"], ["Pharmacy", "#/pharmacy"], ["Orders", "#/orders"], ["Payments", "#/payments"], ["Requirements", "#/requirements"]],
  caregiver: [["Home", "#/home"], ["My patient", "#/patient"], ["Insurance", "#/insurance"], ["Pharmacy", "#/pharmacy"], ["Requirements", "#/requirements"]],
  provider: [["Home", "#/home"], ["My patient", "#/patient"], ["Pharmacy", "#/pharmacy"], ["Requirements", "#/requirements"]],
  coordinator: [["Patients", "#/patients"], ["Care team", "#/care-team"], ["Pharmacies", "#/pharmacies"], ["Requirements", "#/requirements"]]
};

function renderShell(route) {
  const user = currentUser();
  const brandLink = user ? "#/home" : "#/login";
  document.querySelector(".brand").href = brandLink;
  nav.innerHTML = user ? (navByRole[user.role] || []).map(([label, href]) => `<a class="nav-link${route === href.slice(1) ? " active" : ""}" href="${href}"${route === href.slice(1) ? ' aria-current="page"' : ""}>${label}</a>`).join("") : `<a class="nav-link${route === "/login" ? " active" : ""}" href="#/login">Sign in</a><a class="nav-link${route === "/register" ? " active" : ""}" href="#/register">Create account</a>`;
  profileArea.innerHTML = user ? `<div class="profile-copy"><strong>${escapeHTML(user.name)}</strong><span>${roleLabel(user.role)}</span></div><span class="avatar" aria-hidden="true">${initialsFor(user.name)}</span><a class="signout-link" href="#/login" data-action="signout">Sign out</a>` : `<span class="workspace-label"><span class="workspace-dot"></span> Webmed demo</span>`;
}

function initialsFor(name) {
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function pageHeading(eyebrow, title, subtitle) {
  return `<header class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div></header>`;
}

function loginView() {
  return `<section class="auth-layout">${pageHeading("Welcome to Webmed", "Care, connected.", "Sign in to manage your care services in one place.")}<form class="glass-panel form-panel" id="login-form" novalidate><h2>Sign in</h2><p class="form-intro">Use a demo account or enter your credentials.</p><label class="field">Email<input name="email" type="email" autocomplete="username" required><span class="field-error" data-error="email"></span></label><label class="field">Password<input name="password" type="password" autocomplete="current-password" required><span class="field-error" data-error="password"></span></label><p class="form-error" id="login-error" role="alert"></p><button class="button button-primary form-submit" type="submit">Sign in</button><p class="form-footnote">New to Webmed? <a href="#/register">Create an account</a></p><div class="quick-fill"><h3>Quick-fill demo accounts</h3><div class="quick-fill-grid">${data.users.filter(user => ["elena@demo.test", "priya@demo.test", "sam@demo.test", "dr.chen@demo.test", "jordan@demo.test"].includes(user.email)).map(user => `<button class="quick-button" type="button" data-email="${user.email}"><strong>${escapeHTML(user.name)}</strong><span>${roleLabel(user.role)}</span></button>`).join("")}</div><small>All demo passwords: demo123</small></div></form></section>`;
}

const registrationFields = [
  ["name", "Full name", "text", "given-name"], ["email", "Email", "email", "email"], ["password", "Password", "password", "new-password"],
  ["age", "Age", "number", "off"], ["weight", "Weight (lb)", "number", "off"], ["city", "City", "text", "address-level2"], ["state", "State", "text", "address-level1"]
];

function registerView() {
  return `<section class="auth-layout register-layout">${pageHeading("Join Webmed", "Create your account", "One account for care, coverage, and prescriptions.")}<form class="glass-panel form-panel registration-form" id="register-form" novalidate><h2>Account details</h2><p class="form-success" id="register-success" role="status"></p><label class="field">Role<select name="role" required><option value="">Choose a role</option><option value="patient">Patient</option><option value="caregiver">Caregiver</option></select><span class="field-error" data-error="role"></span></label>${registrationFields.map(([name, label, type, autocomplete]) => `<label class="field">${label}<input name="${name}" type="${type}"${type === "number" && name === "age" ? ' min="1" max="120"' : type === "number" ? ' min="1" step="0.1"' : ""} autocomplete="${autocomplete}" required><span class="field-error" data-error="${name}"></span></label>`).join("")}<label class="field field-wide">General health notes<textarea name="notes" rows="3" required></textarea><span class="field-error" data-error="notes"></span></label><button class="button button-primary form-submit field-wide" type="submit">Create account</button><p class="form-footnote field-wide">Already registered? <a href="#/login">Sign in</a></p></form></section>`;
}

const services = {
  insurance: { title: "Insurance", eyebrow: "Coverage", subtitle: "Review your fictional coverage details.", icon: "✚" },
  doctors: { title: "Find a doctor", eyebrow: "Care directory", subtitle: "Explore providers connected to your Webmed account.", icon: "＋" },
  pharmacy: { title: "Pharmacy", eyebrow: "Prescription services", subtitle: "Your pharmacy and prescription information in one place.", icon: "Rx" },
  orders: { title: "Orders", eyebrow: "Your services", subtitle: "Track orders and service requests associated with this demo account.", icon: "↗" },
  payments: { title: "Payments", eyebrow: "Account", subtitle: "View fictional payment activity for this prototype.", icon: "$" }
};

function patientHome(user) {
  const cards = [["Insurance", "Coverage status and plan details", "#/insurance", "✓"], ["Find a doctor", "Search connected care providers", "#/doctors", "＋"], ["Pharmacy", "Pharmacy and prescriptions", "#/pharmacy", "Rx"], ["Orders", "Follow your service requests", "#/orders", "↗"], ["Payments", "Review account activity", "#/payments", "$" ]];
  return `${pageHeading("Your Webmed account", `Good day, ${escapeHTML(user.name.split(" ")[0])}`, "Your healthcare services, together in one account.")}<section class="service-grid">${cards.map(([title, detail, href, icon]) => `<a class="service-card glass-panel" href="${href}"><span class="service-icon">${icon}</span><span class="service-copy"><strong>${title}</strong><span>${detail}</span></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join("")}</section><p class="service-note">Class prototype service information is illustrative only.</p>`;
}

function linkedPatient(user) {
  const patient = data.patients.find(item => item.id === user.patientId) || data.patients[0];
  if (!patient) return `<div class="empty-panel glass-panel">No linked patient record is available.</div>`;
  return `${pageHeading(user.role === "caregiver" ? "Caregiver view" : "Provider view", escapeHTML(patient.name), `${patient.city}, ${patient.state} · Age ${patient.age}`)}<section class="detail-grid"><article class="glass-panel detail-panel"><h2>Care overview</h2><dl><div><dt>Doctor</dt><dd>${escapeHTML(patient.doctor)}</dd></div><div><dt>Caregiver</dt><dd>${escapeHTML(patient.caregiver)}</dd></div><div><dt>Insurance</dt><dd>${escapeHTML(patient.insurance)}</dd></div><div><dt>Identity verification</dt><dd>${patient.identityVerified ? "Verified" : "Not verified"}</dd></div></dl></article><a class="glass-panel service-card" href="#/pharmacy"><span class="service-icon">Rx</span><span class="service-copy"><strong>Pharmacy</strong><span>View pharmacy services</span></span><span class="card-arrow">↗</span></a></section>`;
}

function serviceView(key, user) {
  const service = services[key];
  if (!service) return "";
  const patient = data.patients.find(item => item.id === user.patientId);
  let status = "Available in this class prototype";
  if (key === "insurance" && patient) status = `${patient.insurance}${patient.identityVerified ? " · Identity verified" : " · Identity not verified"}`;
  if (key === "pharmacy" && patient) status = patient.pharmacy;
  if (key === "doctors" && patient) status = patient.doctor;
  return `${pageHeading(service.eyebrow, service.title, service.subtitle)}<article class="glass-panel service-detail"><span class="service-icon">${service.icon}</span><div><h2>${key === "insurance" ? "Coverage overview" : key === "doctors" ? "Connected provider" : key === "pharmacy" ? "Preferred pharmacy" : key === "orders" ? "Recent activity" : "Payment summary"}</h2><p>${escapeHTML(status)}</p><span class="placeholder-label">Fictional demo information</span></div></article>`;
}

function coordinatorHome() {
  return `${pageHeading("Care operations", "Patient coordination", "Keep every care team connected around the people they support.")}<section class="summary-grid"><article class="summary-card"><div><p class="summary-label">Active patients</p><p class="summary-value">${String(data.patients.length).padStart(2, "0")}</p><span class="summary-note">Across all care teams</span></div><span class="metric-mark">◉</span></article><article class="summary-card"><div><p class="summary-label">Roster tools</p><p class="summary-value">3</p><span class="summary-note">Assignments, search, export</span></div><span class="metric-mark coral">⌘</span></article><article class="summary-card"><div><p class="summary-label">Needs attention</p><p class="summary-value">${String(data.patients.filter(patient => [patient.doctor, patient.pharmacy, patient.caregiver].includes("Unassigned")).length).padStart(2, "0")}</p><span class="summary-note">At least one open assignment</span></div><span class="metric-mark gold">!</span></article></section><section class="glass-panel welcome-panel"><h2>Coordinator workspace</h2><p>Open the patient roster to search, update assignments, add a fictional record, or export the roster.</p><a class="button button-primary" href="#/patients">Open patient roster</a></section>`;
}

function rosterView() {
  const providers = ["Dr. Maya Chen", "Dr. Amir Rahman", "Dr. Sofia Alvarez", "Unassigned"];
  const pharmacies = ["Harbor Pharmacy", "Greenway Rx", "Northside Pharmacy", "Unassigned"];
  const caregivers = ["Sam Patel", "Taylor Brooks", "Alex Morgan", "Unassigned"];
  const assignments = [["doctor", "Doctor", providers], ["pharmacy", "Pharmacy", pharmacies], ["caregiver", "Caregiver", caregivers]];
  const query = (document.getElementById("roster-search")?.value || "").trim().toLowerCase();
  const patients = data.patients.filter(patient => {
    const matchesSearch = [patient.name, patient.city, patient.state, patient.doctor, patient.pharmacy, patient.caregiver].some(value => String(value).toLowerCase().includes(query));
    const hasGap = [patient.doctor, patient.pharmacy, patient.caregiver].includes("Unassigned");
    return matchesSearch && (activeFilter === "all" || (activeFilter === "review" ? hasGap : !hasGap));
  });
  const records = data.patients;
  const gaps = records.filter(patient => [patient.doctor, patient.pharmacy, patient.caregiver].includes("Unassigned")).length;
  const assigned = records.reduce((total, patient) => total + [patient.doctor, patient.pharmacy, patient.caregiver].filter(value => value !== "Unassigned").length, 0);
  return `${pageHeading("Care operations / Patients", "Patient coordination", "Keep every care team connected around the people they support.")}<section class="summary-grid"><article class="summary-card"><div><p class="summary-label">Active patients</p><p class="summary-value">${String(records.length).padStart(2, "0")}</p><span class="summary-note">Across all care teams</span></div><span class="metric-mark">◉</span></article><article class="summary-card"><div><p class="summary-label">Care teams assigned</p><p class="summary-value">${String(assigned).padStart(2, "0")}</p><span class="summary-note">Doctor, pharmacy &amp; caregiver</span></div><span class="metric-mark coral">⌘</span></article><article class="summary-card"><div><p class="summary-label">Needs attention</p><p class="summary-value">${String(gaps).padStart(2, "0")}</p><span class="summary-note">At least one open assignment</span></div><span class="metric-mark gold">!</span></article><article class="summary-card"><div><p class="summary-label">Team members</p><p class="summary-value">12</p><span class="summary-note">Across 3 care roles</span></div><span class="metric-mark">♧</span></article></section><section class="glass-panel roster-panel"><div class="panel-top"><div class="section-heading"><h2>Patient roster</h2><span class="record-count">${records.length} records</span></div></div><div class="toolbar"><label class="search-box"><span aria-hidden="true">⌕</span><input id="roster-search" type="search" placeholder="Search patients or care team" aria-label="Search patients or care team" value="${escapeHTML(document.getElementById("roster-search")?.value || "")}"></label><div class="filter-tabs" role="group" aria-label="Filter patients by assignment status">${[["all", "All patients"], ["review", "Needs attention"], ["complete", "Complete"]].map(([key, label]) => `<button class="filter-tab${activeFilter === key ? " active" : ""}" type="button" data-filter="${key}" aria-pressed="${activeFilter === key}">${label}</button>`).join("")}</div></div><div class="roster-list"><div class="list-head"><span>Patient</span><span>Doctor</span><span>Pharmacy</span><span>Caregiver</span><span>Status</span></div>${patients.map(patient => {
    const hasGap = [patient.doctor, patient.pharmacy, patient.caregiver].includes("Unassigned");
    return `<article class="patient-row"><div class="patient-name"><span class="avatar patient-photo">${initialsFor(patient.name)}</span><div class="patient-copy"><strong>${escapeHTML(patient.name)}</strong><span>Age ${escapeHTML(patient.age)} · ${escapeHTML(patient.city)}, ${escapeHTML(patient.state)}</span></div></div>${assignments.map(([field, label, choices]) => `<div class="assignment"><span class="assignment-head">${label}</span><div class="person"><select data-patient="${patient.id}" data-field="${field}" aria-label="${label} for ${escapeHTML(patient.name)}">${choices.map(choice => `<option${choice === patient[field] ? " selected" : ""}>${choice}</option>`).join("")}</select></div></div>`).join("")}<span class="status${hasGap ? " review" : ""}">${hasGap ? "Needs attention" : "Assigned"}</span></article>`;
  }).join("")}${patients.length ? "" : '<div class="empty-state">No patients match this search.</div>'}</div><div class="panel-footer"><span>Showing ${patients.length} of ${records.length} patients</span><span>All records are fictional</span></div></section><div class="page-actions roster-actions"><button class="button" type="button" data-action="export">⇩ Export roster</button><button class="button button-primary" type="button" data-action="add-patient">＋ Add patient</button></div>`;
}

function requirementsView() {
  const rows = [
    ["FR-01", "A patient or caregiver can create an account with their role, contact details, and health profile.", "Create account (#/register)"],
    ["FR-02", "A user can sign in with email and password; invalid credentials show an error.", "Sign in (#/login)"],
    ["NFR-05", "Private screens require a signed-in user.", "Try a private route while signed out"],
    ["DR-01", "Registration captures a role, name, email, password, age, weight, location, and health notes.", "Create account form (#/register)"]
  ];
  return `${pageHeading("Prototype documentation", "Requirements", "Requirement coverage in the current class prototype.")}<div class="glass-panel table-wrap"><table><thead><tr><th>Requirement ID</th><th>Requirement</th><th>Where to see it in the app</th></tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function directoryView(route) {
  const careTeam = route === "/care-team";
  const title = careTeam ? "Care team" : "Pharmacies";
  const entries = careTeam ? [["Dr. Maya Chen", "Primary care provider"], ["Sam Patel", "Caregiver for Elena Vasquez"], ["Jordan Lee", "Care coordinator"]] : [["Harbor Pharmacy", "Tampa, FL · Open until 6:00 PM"], ["Greenway Rx", "Tampa, FL · Open until 7:00 PM"], ["Northside Pharmacy", "Tampa, FL · Open until 5:30 PM"]];
  return `${pageHeading("Webmed directory", title, "Fictional directory entries for this class prototype.")}<section class="directory-list">${entries.map(([name, detail]) => `<article class="glass-panel directory-item"><span class="service-icon">${careTeam ? initialsFor(name) : "Rx"}</span><div><h2>${escapeHTML(name)}</h2><p>${escapeHTML(detail)}</p></div></article>`).join("")}</section>`;
}

function render() {
  let route = window.location.hash.replace(/^#/, "") || (currentUser() ? "/home" : "/login");
  const publicRoutes = ["/login", "/register"];
  if (!publicRoutes.includes(route) && !currentUser()) {
    window.location.hash = "/login";
    route = "/login";
  }
  if (route === "/patients" && currentUser()?.role !== "coordinator") route = "/home";
  if (["/care-team", "/pharmacies"].includes(route) && currentUser()?.role !== "coordinator") route = "/home";
  renderShell(route);
  const user = currentUser();
  if (route === "/login") app.innerHTML = loginView();
  else if (route === "/register") app.innerHTML = registerView();
  else if (route === "/home" && user?.role === "coordinator") app.innerHTML = coordinatorHome();
  else if (route === "/home" && user?.role === "patient") app.innerHTML = patientHome(user);
  else if (route === "/home") app.innerHTML = linkedPatient(user);
  else if (route === "/patients") app.innerHTML = rosterView();
  else if (route === "/requirements") app.innerHTML = requirementsView();
  else if (["/care-team", "/pharmacies"].includes(route)) app.innerHTML = directoryView(route);
  else if (route === "/patient" && ["caregiver", "provider"].includes(user?.role)) app.innerHTML = linkedPatient(user);
  else if (services[route.slice(1)]) app.innerHTML = serviceView(route.slice(1), user);
  else {
    window.location.hash = "/home";
    return;
  }
  document.title = `${route === "/home" ? "Home" : route.slice(1).replaceAll("-", " ").replace(/^\w/, letter => letter.toUpperCase())} | Webmed`;
}

function setFieldError(form, name, message) {
  const target = form.querySelector(`[data-error="${name}"]`);
  const input = form.elements[name];
  if (target) target.textContent = message;
  if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
}

function handleLogin(form) {
  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  const user = data.users.find(item => item.email.toLowerCase() === email && item.password === password);
  const error = document.getElementById("login-error");
  if (!user) {
    error.textContent = "Email or password is incorrect.";
    return;
  }
  data.session = user.email;
  saveData();
  window.location.hash = "/home";
  announce("Signed in");
}

function handleRegistration(form) {
  const names = ["role", "name", "email", "password", "age", "weight", "city", "state", "notes"];
  let valid = true;
  names.forEach(name => {
    const value = form.elements[name].value.trim();
    const message = value ? "" : `${({ role: "Role", name: "Full name", email: "Email", password: "Password", age: "Age", weight: "Weight", city: "City", state: "State", notes: "General health notes" })[name]} is required.`;
    setFieldError(form, name, message);
    if (message) valid = false;
  });
  if (!valid) return;
  if (!form.elements.email.validity.valid) {
    setFieldError(form, "email", "Enter a valid email address.");
    return;
  }
  if (!form.elements.age.validity.valid || Number(form.elements.age.value) <= 0) {
    setFieldError(form, "age", "Enter a valid age.");
    return;
  }
  if (!form.elements.weight.validity.valid || Number(form.elements.weight.value) <= 0) {
    setFieldError(form, "weight", "Enter a valid weight.");
    return;
  }
  const email = form.elements.email.value.trim().toLowerCase();
  if (data.users.some(user => user.email.toLowerCase() === email)) {
    setFieldError(form, "email", "An account with this email already exists.");
    return;
  }
  const patientId = Math.max(0, ...data.patients.map(patient => patient.id)) + 1;
  const user = {
    email, password: form.elements.password.value, name: form.elements.name.value.trim(), role: form.elements.role.value,
    age: Number(form.elements.age.value), weight: Number(form.elements.weight.value), city: form.elements.city.value.trim(),
    state: form.elements.state.value.trim().toUpperCase(), notes: form.elements.notes.value.trim(), patientId,
    insurance: "Not added", identityVerified: false
  };
  data.users.push(user);
  data.patients.push({ id: patientId, name: user.name, age: user.age, city: user.city, state: user.state, doctor: "Unassigned", pharmacy: "Unassigned", caregiver: "Unassigned", insurance: user.insurance, identityVerified: false });
  data.session = user.email;
  saveData();
  window.location.hash = "/home";
  announce("Account created");
}

function exportRoster() {
  const columns = ["Patient", "Age", "City", "State", "Doctor", "Pharmacy", "Caregiver", "Insurance"];
  const escapeCell = value => `"${String(value).replaceAll('"', '""')}"`;
  const csv = [columns, ...data.patients.map(patient => columns.map(column => patient[({ Patient: "name", Age: "age", City: "city", State: "state", Doctor: "doctor", Pharmacy: "pharmacy", Caregiver: "caregiver", Insurance: "insurance" })[column]]))].map(row => row.map(escapeCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "webmed-demo-patient-roster.csv";
  link.click();
  URL.revokeObjectURL(url);
  announce("Roster exported as CSV");
}

document.addEventListener("click", event => {
  const quickFill = event.target.closest("[data-email]");
  if (quickFill) {
    const form = document.getElementById("login-form");
    if (form) {
      form.elements.email.value = quickFill.dataset.email;
      form.elements.password.value = "demo123";
    }
    return;
  }
  const signout = event.target.closest('[data-action="signout"]');
  if (signout) {
    event.preventDefault();
    data.session = null;
    saveData();
    window.location.hash = "/login";
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    const query = document.getElementById("roster-search")?.value || "";
    render();
    const search = document.getElementById("roster-search");
    if (search) search.value = query;
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "add-patient") {
    const id = Math.max(0, ...data.patients.map(patient => patient.id)) + 1;
    const name = `New patient ${String(id).padStart(2, "0")}`;
    data.patients.unshift({ id, name, age: "", city: "Tampa", state: "FL", doctor: "Unassigned", pharmacy: "Unassigned", caregiver: "Unassigned", insurance: "None", identityVerified: false });
    saveData();
    render();
    announce(`${name} added to the roster`);
  }
  if (action === "export") exportRoster();
});

document.addEventListener("input", event => {
  if (event.target.id === "roster-search") {
    const position = event.target.selectionStart;
    render();
    const search = document.getElementById("roster-search");
    search.focus();
    search.setSelectionRange(position, position);
  }
  const form = event.target.closest("form");
  if (form && event.target.name && form.querySelector(`[data-error="${event.target.name}"]`)) setFieldError(form, event.target.name, "");
});

document.addEventListener("change", event => {
  const select = event.target.closest("select[data-patient]");
  if (!select) return;
  const patient = data.patients.find(item => item.id === Number(select.dataset.patient));
  if (!patient) return;
  patient[select.dataset.field] = select.value;
  saveData();
  render();
  announce(`${select.dataset.field[0].toUpperCase()}${select.dataset.field.slice(1)} assignment updated for ${patient.name}`);
});

document.addEventListener("submit", event => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    handleLogin(event.target);
  }
  if (event.target.id === "register-form") {
    event.preventDefault();
    handleRegistration(event.target);
  }
});

document.getElementById("reset-demo").addEventListener("click", () => {
  data = seedData();
  saveData();
  activeFilter = "all";
  window.location.hash = "/login";
  render();
  announce("Demo data reset");
});

window.addEventListener("hashchange", render);
if (!window.location.hash) window.location.hash = currentUser() ? "/home" : "/login";
render();
