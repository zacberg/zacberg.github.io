const STORAGE_KEY = "carerelay-demo";
const app = document.getElementById("app");
const nav = document.getElementById("primary-nav");
const profileArea = document.getElementById("profile-area");
const toast = document.getElementById("toast");
let data;
let toastTimer;
let activeFilter = "all";
let verificationChallenge = null;
let doctorSearch = null;
let bookingDate = "";

const rosterSeed = [
  { id: 1, name: "Elena Vasquez", age: 68, weight: 148, city: "Tampa", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Harbor Pharmacy", caregiver: "Sam Patel", insurance: "Approved", identityVerified: true },
  { id: 2, name: "Marcus Johnson", age: 54, weight: 185, city: "Tampa", state: "FL", doctor: "Dr. Amir Rahman", pharmacy: "Harbor Pharmacy", caregiver: "Taylor Brooks", insurance: "Pending", identityVerified: true },
  { id: 3, name: "Priya Nair", age: 72, weight: 139, city: "Tampa", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Greenway Rx", caregiver: "Unassigned", insurance: "None", identityVerified: false },
  { id: 4, name: "Robert Kim", age: 61, city: "St. Petersburg", state: "FL", doctor: "Dr. Sofia Alvarez", pharmacy: "Northside Pharmacy", caregiver: "Alex Morgan", insurance: "Approved", identityVerified: true },
  { id: 5, name: "Grace Thompson", age: 47, city: "Tampa", state: "FL", doctor: "Dr. Amir Rahman", pharmacy: "Unassigned", caregiver: "Sam Patel", insurance: "Review", identityVerified: true },
  { id: 6, name: "Daniel Okafor", age: 80, weight: 178, city: "Clearwater", state: "FL", doctor: "Dr. Maya Chen", pharmacy: "Harbor Pharmacy", caregiver: "Taylor Brooks", insurance: "Approved", identityVerified: true }
];

const doctorSeed = [
  { id: "maya-chen", name: "Dr. Maya Chen", city: "Tampa", state: "FL", specialty: "Internal medicine", hours: { Monday: ["09:00", "17:00"], Tuesday: ["09:00", "17:00"], Wednesday: ["09:00", "17:00"], Thursday: ["09:00", "17:00"], Friday: ["09:00", "16:00"], Saturday: null, Sunday: null } },
  { id: "amir-rahman", name: "Dr. Amir Rahman", city: "Tampa", state: "FL", specialty: "Family medicine", hours: { Monday: ["08:30", "16:30"], Tuesday: ["08:30", "16:30"], Wednesday: ["08:30", "16:30"], Thursday: ["08:30", "16:30"], Friday: ["08:30", "15:00"], Saturday: ["09:00", "12:00"], Sunday: null } },
  { id: "sofia-alvarez", name: "Dr. Sofia Alvarez", city: "Tampa", state: "FL", specialty: "Cardiology", hours: { Monday: ["09:00", "17:00"], Tuesday: ["09:00", "17:00"], Wednesday: ["09:00", "17:00"], Thursday: ["09:00", "17:00"], Friday: ["09:00", "17:00"], Saturday: null, Sunday: null } },
  { id: "evelyn-park", name: "Dr. Evelyn Park", city: "Tampa", state: "FL", specialty: "Pediatrics", hours: { Monday: ["10:00", "18:00"], Tuesday: ["10:00", "18:00"], Wednesday: ["10:00", "18:00"], Thursday: ["10:00", "18:00"], Friday: ["10:00", "18:00"], Saturday: ["09:00", "12:00"], Sunday: null } },
  { id: "mateo-rivera", name: "Dr. Mateo Rivera", city: "Orlando", state: "FL", specialty: "Family medicine", hours: { Monday: ["08:00", "17:00"], Tuesday: ["08:00", "17:00"], Wednesday: ["08:00", "17:00"], Thursday: ["08:00", "17:00"], Friday: ["08:00", "15:00"], Saturday: null, Sunday: null } },
  { id: "asha-iyer", name: "Dr. Asha Iyer", city: "Orlando", state: "FL", specialty: "Dermatology", hours: { Monday: ["09:00", "16:00"], Tuesday: ["09:00", "16:00"], Wednesday: ["09:00", "16:00"], Thursday: ["09:00", "16:00"], Friday: null, Saturday: null, Sunday: null } },
  { id: "nora-williams", name: "Dr. Nora Williams", city: "Atlanta", state: "GA", specialty: "Endocrinology", hours: { Monday: ["08:00", "16:00"], Tuesday: ["08:00", "16:00"], Wednesday: ["08:00", "16:00"], Thursday: ["08:00", "16:00"], Friday: ["08:00", "15:00"], Saturday: null, Sunday: null } },
  { id: "gabriel-price", name: "Dr. Gabriel Price", city: "Savannah", state: "GA", specialty: "Neurology", hours: { Monday: ["09:00", "17:00"], Tuesday: ["09:00", "17:00"], Wednesday: ["09:00", "17:00"], Thursday: ["09:00", "17:00"], Friday: ["09:00", "13:00"], Saturday: null, Sunday: null } }
];

const medicineSeed = [
  { id: "ibuprofen", name: "Ibuprofen", type: "OTC", withInsurance: 2.5, withoutInsurance: 4.75 },
  { id: "loratadine", name: "Loratadine", type: "OTC", withInsurance: 3.2, withoutInsurance: 6.4 },
  { id: "lisinopril", name: "Lisinopril", type: "Rx-only", withInsurance: 4, withoutInsurance: 18 },
  { id: "amoxicillin", name: "Amoxicillin", type: "Rx-only", withInsurance: 6, withoutInsurance: 14 },
  { id: "metformin", name: "Metformin", type: "Rx-only", withInsurance: 4, withoutInsurance: 12 }
];

function dateFromToday(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function seedAppointments() {
  return [
    { id: "visit-elena-seed", patientId: 1, doctorId: "maya-chen", date: dateFromToday(2), time: "10:00", reason: "Annual wellness visit", status: "confirmed", requestedBy: "elena@demo.test", requestedAt: new Date().toISOString() },
    { id: "visit-daniel-seed", patientId: 6, doctorId: "maya-chen", date: dateFromToday(3), time: "11:00", reason: "Blood pressure follow-up", status: "confirmed", requestedBy: "elena@demo.test", requestedAt: new Date().toISOString() }
  ];
}

function seedData() {
  return {
    users: [
      { email: "elena@demo.test", password: "demo123", name: "Elena Vasquez", role: "patient", age: 68, weight: 148, city: "Tampa", state: "FL", patientId: 1, notes: "", insurance: "Approved", insuranceDetails: { insurer: "Suncoast Health Plan", memberId: "EV-10482", groupNumber: "FL-ELENA", submitted: true }, identityVerified: true },
      { email: "priya@demo.test", password: "demo123", name: "Priya Nair", role: "patient", age: 72, weight: 139, city: "Tampa", state: "FL", patientId: 3, notes: "", insurance: "None", insuranceDetails: { insurer: "", memberId: "", groupNumber: "", submitted: false }, identityVerified: false },
      { email: "sam@demo.test", password: "demo123", name: "Sam Patel", role: "caregiver", patientId: 1 },
      { email: "dr.chen@demo.test", password: "demo123", name: "Dr. Maya Chen", role: "provider", providerId: "maya-chen" },
      { email: "jordan@demo.test", password: "demo123", name: "Jordan Lee", role: "coordinator" }
    ],
    patients: structuredClone(rosterSeed),
    doctors: structuredClone(doctorSeed),
    medicines: structuredClone(medicineSeed),
    prescriptions: [
      { patientId: 1, medicineId: "lisinopril", validThrough: "2027-06-30" },
      { patientId: 1, medicineId: "amoxicillin", validThrough: "2026-09-15" }
    ],
    appointments: seedAppointments(),
    orders: [],
    payments: [],
    carts: {},
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
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaults = seedData();
      const users = (parsed.users || defaults.users).map(user => {
        const seededUser = defaults.users.find(item => item.email === user.email);
        return { ...user, providerId: user.providerId || seededUser?.providerId, weight: user.weight ?? seededUser?.weight, identityVerified: user.identityVerified ?? seededUser?.identityVerified ?? false, insuranceDetails: user.insuranceDetails || seededUser?.insuranceDetails };
      });
      const patients = (parsed.patients || defaults.patients).map(patient => ({ ...patient, weight: patient.weight ?? defaults.patients.find(item => item.id === patient.id)?.weight }));
      return { ...defaults, ...parsed, users, patients, doctors: parsed.doctors || defaults.doctors, medicines: parsed.medicines || defaults.medicines, prescriptions: parsed.prescriptions || defaults.prescriptions, appointments: parsed.appointments || defaults.appointments, orders: parsed.orders || [], payments: parsed.payments || [], carts: parsed.carts || {} };
    }
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
  patient: [["Home", "#/home"], ["Insurance", "#/insurance"], ["Find a doctor", "#/doctors"], ["Appointments", "#/appointments"], ["Pharmacy", "#/pharmacy"], ["Orders", "#/orders"], ["Payments", "#/payments"], ["Requirements", "#/requirements"]],
  caregiver: [["Home", "#/home"], ["My patient", "#/patient"], ["Find a doctor", "#/doctors"], ["Appointments", "#/appointments"], ["Insurance", "#/insurance"], ["Pharmacy", "#/pharmacy"], ["Orders", "#/orders"], ["Requirements", "#/requirements"]],
  provider: [["Home", "#/home"], ["Appointments", "#/appointments"], ["Requirements", "#/requirements"]],
  coordinator: [["Patients", "#/patients"], ["Care team", "#/care-team"], ["Pharmacies", "#/pharmacies"], ["Requirements", "#/requirements"]]
};

function renderShell(route) {
  const user = currentUser();
  const brandLink = user ? "#/home" : "#/login";
  document.querySelector(".brand").href = brandLink;
  nav.innerHTML = user ? (navByRole[user.role] || []).map(([label, href]) => `<a class="nav-link${route === href.slice(1) ? " active" : ""}" href="${href}"${route === href.slice(1) ? ' aria-current="page"' : ""}>${label}</a>`).join("") : `<a class="nav-link${route === "/login" ? " active" : ""}" href="#/login">Sign in</a><a class="nav-link${route === "/register" ? " active" : ""}" href="#/register">Create account</a>`;
  profileArea.innerHTML = user ? `<div class="profile-copy"><strong>${escapeHTML(user.name)}</strong><span>${roleLabel(user.role)}</span></div><span class="avatar" aria-hidden="true">${initialsFor(user.name)}</span><a class="signout-link" href="#/login" data-action="signout">Sign out</a>` : `<span class="workspace-label"><span class="workspace-dot"></span> Webmed demo</span>`;
  const actingBar = document.getElementById("acting-bar");
  if (actingBar) actingBar.innerHTML = user?.role === "caregiver" && user.patientId === 1 ? `<span>Acting for <strong>${escapeHTML(patientAccount(1)?.name || "Elena Vasquez")}</strong></span>` : "";
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

function insuranceStatus(user) {
  return ["None", "Pending", "Approved"].includes(user.insurance) ? user.insurance : "None";
}

function patientAccount(patientId) {
  return data.users.find(user => user.role === "patient" && user.patientId === patientId);
}

function insuranceOwner(user) {
  return user.role === "caregiver" ? patientAccount(user.patientId) || user : user;
}

function syncPatientInsurance(user) {
  const patient = data.patients.find(item => item.id === user.patientId);
  if (!patient) return;
  patient.insurance = insuranceStatus(user);
  patient.identityVerified = Boolean(user.identityVerified);
}

function maskedMemberId(memberId) {
  const lastFour = String(memberId || "").replace(/\s/g, "").slice(-4).padStart(4, "•");
  return `•••• ${lastFour}`;
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

const insurancePlans = [
  { name: "HarborCare Essential", premium: 148, deductible: 3500 },
  { name: "Sunrise Plus", premium: 219, deductible: 1800 },
  { name: "Gulf Coast Saver", premium: 112, deductible: 5000 }
];

function doctorById(id) {
  return data.doctors.find(doctor => doctor.id === id);
}

function patientApprovals(patientId) {
  const appointments = data.appointments.filter(item => item.patientId === patientId && item.status === "awaiting-approval");
  const orders = data.orders.filter(item => item.patientId === patientId && item.approvalStatus === "awaiting");
  return [...appointments.map(item => ({ ...item, approvalType: "appointment", description: `${doctorById(item.doctorId)?.name || "Doctor"} · ${item.reason}` })), ...orders.map(item => ({ ...item, approvalType: "order", description: item.items.map(entry => `${entry.quantity} × ${entry.name}`).join(", ") }))];
}

function requesterName(email) {
  return data.users.find(user => user.email === email)?.name || "Care team member";
}

function appointmentDateTime(appointment) {
  const date = new Date(`${appointment.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${date} · ${displayTime(appointment.time)}`;
}

function approvalMarkup(patientId) {
  const approvals = patientApprovals(patientId);
  if (!approvals.length) return "";
  return `<section class="glass-panel approvals-panel"><div class="section-heading"><h2>Approvals</h2><span class="record-count">${approvals.length} awaiting</span></div>${approvals.map(item => `<article class="approval-item"><div><strong>${escapeHTML(requesterName(item.requestedBy))} asked</strong><span>${escapeHTML(item.description)}</span><small>${new Date(item.requestedAt).toLocaleString()}</small></div><div class="approval-actions"><button class="button button-primary" type="button" data-approval="approve" data-approval-type="${item.approvalType}" data-approval-id="${item.id}">Approve</button><button class="button" type="button" data-approval="decline" data-approval-type="${item.approvalType}" data-approval-id="${item.id}">Decline</button></div></article>`).join("")}</section>`;
}

function appointmentsMarkup(patientId) {
  const visits = data.appointments.filter(item => item.patientId === patientId && item.status !== "cancelled");
  return `<section class="glass-panel appointments-panel"><div class="section-heading"><h2>Appointments</h2><a href="#/appointments">View all</a></div>${visits.length ? visits.map(visit => `<article class="visit-row"><div><strong>${escapeHTML(doctorById(visit.doctorId)?.name || "Doctor")}</strong><span>${escapeHTML(appointmentDateTime(visit))} · ${escapeHTML(visit.reason)}</span></div><span class="visit-status ${visit.status === "awaiting-approval" ? "pending" : ""}">${visit.status === "awaiting-approval" ? "Awaiting patient approval" : "Confirmed"}</span></article>`).join("") : '<p class="empty-note">No appointments yet.</p>'}<a class="button" href="#/doctors">Find a doctor</a></section>`;
}

function patientHome(user) {
  const cards = [["Insurance", "Coverage status and plan details", "#/insurance", "✓"], ["Find a doctor", "Search connected care providers", "#/doctors", "＋"], ["Pharmacy", "Compare prices and order medicines", "#/pharmacy", "Rx"], ["Orders", "Track your orders", "#/orders", "↗"], ["Payments", "Review payment history", "#/payments", "$"], ["My record", "View your patient record", `#/patient/${user.patientId}`, "＋"]];
  return `${pageHeading("Your Webmed account", `Good day, ${escapeHTML(user.name.split(" ")[0])}`, "Your healthcare services, together in one account.")}<section class="service-grid">${cards.map(([title, detail, href, icon]) => `<a class="service-card glass-panel" href="${href}"><span class="service-icon">${icon}</span><span class="service-copy"><strong>${title}</strong><span>${detail}</span></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join("")}</section><section class="dashboard-columns">${appointmentsMarkup(user.patientId)}${approvalMarkup(user.patientId)}</section><p class="service-note">Class prototype service information is illustrative only.</p>`;
}

function linkedPatient(user) {
  const patient = data.patients.find(item => item.id === user.patientId) || data.patients[0];
  if (!patient) return `<div class="empty-panel glass-panel">No linked patient record is available.</div>`;
  return `${pageHeading(user.role === "caregiver" ? "Caregiver view" : "Provider view", escapeHTML(patient.name), `${patient.city}, ${patient.state} · Age ${patient.age}`)}<section class="detail-grid"><article class="glass-panel detail-panel"><h2>Care overview</h2><dl><div><dt>Doctor</dt><dd>${escapeHTML(patient.doctor)}</dd></div><div><dt>Caregiver</dt><dd>${escapeHTML(patient.caregiver)}</dd></div><div><dt>Insurance</dt><dd>${escapeHTML(patient.insurance)}</dd></div><div><dt>Identity verification</dt><dd>${patient.identityVerified ? "Verified" : "Not verified"}</dd></div></dl></article><a class="glass-panel service-card" href="#/pharmacy"><span class="service-icon">Rx</span><span class="service-copy"><strong>Pharmacy</strong><span>View pharmacy services</span></span><span class="card-arrow">↗</span></a></section>`;
}

function patientRecordView(user, requestedId) {
  const id = Number(requestedId);
  if (user.role !== "patient" || id !== user.patientId) return `<section class="glass-panel access-denied" role="alert">Access denied. You can only view your own records.</section>`;
  const patient = data.patients.find(item => item.id === id);
  if (!patient) return `<section class="glass-panel access-denied" role="alert">Patient record not found.</section>`;
  return `${pageHeading("Private patient record", escapeHTML(patient.name), "Your personal information in this demo account.")}<article class="glass-panel detail-panel patient-record"><dl><div><dt>Name</dt><dd>${escapeHTML(patient.name)}</dd></div><div><dt>Age</dt><dd>${escapeHTML(patient.age)}</dd></div><div><dt>Weight</dt><dd>${escapeHTML(user.weight)} lb</dd></div><div><dt>City</dt><dd>${escapeHTML(patient.city)}, ${escapeHTML(patient.state)}</dd></div><div><dt>Primary doctor</dt><dd>${escapeHTML(patient.doctor)}</dd></div></dl></article>`;
}

function providerAppointmentsView(user) {
  const visits = data.appointments.filter(visit => visit.doctorId === user.providerId && visit.status === "confirmed");
  return `${pageHeading("Provider workspace", "Booked appointments", "Your confirmed patient visits.")}<section class="provider-visits">${visits.map(visit => {
    const patient = data.patients.find(item => item.id === visit.patientId);
    if (!patient) return "";
    return `<article class="glass-panel provider-visit"><h2>${escapeHTML(patient.name)}</h2><dl><div><dt>Age</dt><dd>${escapeHTML(patient.age)}</dd></div><div><dt>Weight</dt><dd>${escapeHTML(patient.weight || "Not listed")} lb</dd></div><div><dt>Visit reason</dt><dd>${escapeHTML(visit.reason)}</dd></div></dl></article>`;
  }).join("") || '<div class="glass-panel empty-panel">No confirmed appointments.</div>'}</section><p class="privacy-note">Hidden: insurance, payments, orders, and other visits.</p>`;
}

function appointmentsView(user) {
  if (user.role === "provider") return providerAppointmentsView(user);
  return `${pageHeading("Visit schedule", "Appointments", "Upcoming and requested visits.")}${appointmentsMarkup(user.patientId)}${user.role === "patient" ? approvalMarkup(user.patientId) : ""}`;
}

function formatMoney(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function pharmacyPatientId(user) {
  return user.role === "caregiver" ? user.patientId : user.patientId;
}

function applicableInsurance(user) {
  const account = patientAccount(pharmacyPatientId(user));
  return insuranceStatus(account || user) === "Approved";
}

function prescriptionFor(patientId, medicineId) {
  return data.prescriptions.find(item => item.patientId === patientId && item.medicineId === medicineId) || null;
}

function prescriptionStatus(patientId, medicine) {
  if (medicine.type === "OTC") return "OTC, no prescription required";
  const prescription = prescriptionFor(patientId, medicine.id);
  if (!prescription) return "Prescription required";
  if (prescription.validThrough < dateFromToday(0)) return `Expired ${shortDate(prescription.validThrough)}`;
  return `Valid through ${new Date(`${prescription.validThrough}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

function shortDate(value) {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function pharmacyView(user) {
  const patientId = pharmacyPatientId(user);
  const cart = data.carts[String(patientId)] || {};
  const insured = applicableInsurance(user);
  const items = Object.entries(cart).map(([id, quantity]) => ({ medicine: data.medicines.find(item => item.id === id), quantity: Number(quantity) })).filter(item => item.medicine && item.quantity > 0);
  const totalWithInsurance = items.reduce((sum, item) => sum + item.medicine.withInsurance * item.quantity, 0);
  const totalWithoutInsurance = items.reduce((sum, item) => sum + item.medicine.withoutInsurance * item.quantity, 0);
  const patient = data.patients.find(item => item.id === patientId);
  const insuranceNote = insured ? "" : `<p class="uninsured-note">You're paying without-insurance prices. <a href="#/insurance">Get covered</a> to pay less.</p>`;
  return `${pageHeading("Pharmacy", "Medicine pricing", `Fictional pharmacy pricing for ${escapeHTML(patient?.name || user.name)}.`)}${insuranceNote}<section class="medicine-grid">${data.medicines.map(medicine => `<article class="glass-panel medicine-card"><div class="medicine-heading"><h2>${medicine.name}</h2><span class="medicine-type ${medicine.type === "OTC" ? "otc" : "rx"}">${medicine.type}</span></div><div class="price-pair"><div class="price-option ${insured ? "applies" : ""}"><span>With insurance</span><strong>${formatMoney(medicine.withInsurance)}</strong></div><div class="price-option ${insured ? "" : "applies"}"><span>Without insurance</span><strong>${formatMoney(medicine.withoutInsurance)}</strong></div></div><p class="savings-note">Insurance saves ${formatMoney(medicine.withoutInsurance - medicine.withInsurance)}</p><label class="quantity-field">Quantity<input type="number" min="1" max="10" value="1" data-quantity="${medicine.id}" aria-label="Quantity for ${medicine.name}"></label><button class="button" type="button" data-add-medicine="${medicine.id}">Add to cart</button></article>`).join("")}</section><section class="glass-panel checkout-panel"><div class="section-heading"><h2>Your cart</h2><span>${items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>${items.length ? `<ul class="cart-list">${items.map(item => `<li><span>${item.quantity} × ${item.medicine.name}</span><span>${formatMoney((insured ? item.medicine.withInsurance : item.medicine.withoutInsurance) * item.quantity)}</span><small>${escapeHTML(prescriptionStatus(patientId, item.medicine))}</small></li>`).join("")}</ul>` : '<p class="empty-note">Your cart is empty.</p>'}<div class="cart-totals"><div><span>With insurance</span><strong>${formatMoney(totalWithInsurance)}</strong></div><div><span>Without insurance</span><strong>${formatMoney(totalWithoutInsurance)}</strong></div><div class="applied-total"><span>Price applied</span><strong>${formatMoney(insured ? totalWithInsurance : totalWithoutInsurance)}</strong></div></div><fieldset class="payment-choices"><legend>Payment method</legend><label><input type="radio" name="payment-method" value="online" checked> Pay online now</label><label><input type="radio" name="payment-method" value="cod"> Cash on delivery</label></fieldset><p class="checkout-error" id="checkout-error" role="alert"></p><button class="button button-primary checkout-button" type="button" data-action="checkout"${items.length ? "" : " disabled"}>${document.querySelector('input[name="payment-method"]:checked')?.value === "cod" ? "Place order" : `Pay ${formatMoney(insured ? totalWithInsurance : totalWithoutInsurance)}`}</button></section>`;
}

function orderTracker(order) {
  const steps = ["Placed", "Confirmed by pharmacy", "Out for delivery", "Delivered"];
  const activeIndex = steps.indexOf(order.status);
  return `<ol class="order-tracker">${steps.map((step, index) => `<li class="${index <= activeIndex ? "complete" : ""}"><span>${index + 1}</span><small>${step}</small></li>`).join("")}</ol>`;
}

function ordersView(user) {
  const patientId = user.role === "caregiver" ? user.patientId : user.patientId;
  const orders = data.orders.filter(order => order.patientId === patientId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return `${pageHeading("Pharmacy", "Orders and tracking", "Order history and simulated pharmacy updates.")}${orders.length ? `<section class="order-list">${orders.map(order => `<article class="glass-panel order-card"><div class="order-head"><div><h2>Order ${escapeHTML(order.id.slice(-6))}</h2><span>Placed ${new Date(`${order.date}T12:00:00`).toLocaleDateString("en-US")}</span></div><span class="order-state ${order.approvalStatus === "awaiting" ? "pending" : ""}">${order.approvalStatus === "awaiting" ? "Awaiting patient approval" : order.status}</span></div><ul class="order-items">${order.items.map(item => `<li>${item.quantity} × ${escapeHTML(item.name)} <small>${escapeHTML(item.prescriptionStatus)}</small></li>`).join("")}</ul><dl class="order-meta"><div><dt>Payment method</dt><dd>${order.paymentMethod === "online" ? "Pay online now" : "Cash on delivery"}</dd></div><div><dt>Payment status</dt><dd>${escapeHTML(order.paymentStatus)}</dd></div><div><dt>Expected delivery</dt><dd>${new Date(`${order.expectedDelivery}T12:00:00`).toLocaleDateString("en-US")}</dd></div><div><dt>Total</dt><dd>${formatMoney(order.total)}</dd></div></dl>${order.status === "Cancelled" ? '<p class="empty-note">This order was declined and cancelled.</p>' : order.approvalStatus === "awaiting" ? "" : `${orderTracker(order)}${order.status !== "Delivered" ? `<button class="button" type="button" data-action="advance-order" data-order-id="${order.id}">Advance status (simulates pharmacy update)</button>` : ""}`}</article>`).join("")}</section>` : '<section class="glass-panel empty-panel">No orders yet. Visit the pharmacy to add an item to your cart.</section>'}`;
}

function paymentsView(user) {
  if (user.role !== "patient") return `<section class="glass-panel access-denied" role="alert">Access denied. Payment history is available to patients only.</section>`;
  const payments = data.payments.filter(payment => payment.patientId === user.patientId).sort((a, b) => b.date.localeCompare(a.date));
  return `${pageHeading("Account", "Payment history", "Your fictional payment activity.")}<section class="glass-panel payment-history"><p class="availability-note">Available 24/7.</p>${payments.length ? `<div class="payment-table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead><tbody>${payments.map(payment => `<tr><td>${new Date(`${payment.date}T12:00:00`).toLocaleDateString("en-US")}</td><td>${escapeHTML(payment.description)}</td><td>${formatMoney(payment.amount)}</td><td>${payment.method === "online" ? "Online" : "Cash on delivery"}</td><td>${escapeHTML(payment.status)}</td></tr>`).join("")}</tbody></table></div>` : '<p class="empty-note">No payments recorded.</p>'}</section>`;
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

function identityVerificationView() {
  return `${pageHeading("Account security", "Verify it's you", "Confirm your identity before viewing or submitting insurance information.")}<section class="glass-panel verification-panel"><span class="service-icon" aria-hidden="true">✓</span><form id="identity-form" novalidate><label class="field">6-digit verification code<input name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required aria-describedby="identity-hint"><span class="field-error" id="identity-error" role="alert"></span></label><p class="form-intro" id="identity-hint">A demo text message was sent to the phone number on this account.</p><button class="button button-primary" type="submit">Verify identity</button></form></section>`;
}

function insuranceView(user) {
  const owner = insuranceOwner(user);
  const status = insuranceStatus(owner);
  const details = owner.insuranceDetails || { insurer: "", memberId: "", groupNumber: "", submitted: false };
  const saved = Boolean(details.submitted) && status !== "None";
  const summary = saved ? `<article class="glass-panel insurance-summary"><div class="insurance-summary-head"><div><p class="eyebrow">Coverage details</p><h2>${escapeHTML(details.insurer || details.planName || "Insurance plan")}</h2></div><span class="insurance-status ${status.toLowerCase()}">${status}</span></div><dl><div><dt>Insurer / plan</dt><dd>${escapeHTML(details.insurer || details.planName || "Plan application")}</dd></div><div><dt>Member ID</dt><dd>${details.memberId ? maskedMemberId(details.memberId) : "Assigned after approval"}</dd></div><div><dt>Group number</dt><dd>${escapeHTML(details.groupNumber || "Not assigned")}</dd></div></dl>${status === "Pending" ? `<div class="response-action"><p>Application submitted. The insurer response is pending.</p><button class="button button-primary" type="button" data-action="simulate-insurer">Simulate insurer response</button><small>Stand-in for the insurer connection</small></div>` : ""}</article>` : `<form class="glass-panel insurance-form" id="insurance-form" novalidate><div class="insurance-summary-head"><div><p class="eyebrow">Coverage details</p><h2>Enter insurance information</h2></div><span class="insurance-status ${status.toLowerCase()}">${status}</span></div><p class="form-intro">Your information stays in this fictional local demo.</p><label class="field">Insurer<input name="insurer" autocomplete="organization" required><span class="field-error" data-error="insurer"></span></label><label class="field">Member ID<input name="memberId" autocomplete="off" required><span class="field-error" data-error="memberId"></span></label><label class="field">Group number<input name="groupNumber" autocomplete="off" required><span class="field-error" data-error="groupNumber"></span></label><button class="button button-primary" type="submit">Save insurance details</button></form>`;
  const plans = status === "None" ? `<section class="plans-section"><div class="section-heading"><div><p class="eyebrow">Enrollment</p><h2>Don't have insurance? Get covered</h2></div></div><div class="plan-grid">${insurancePlans.map((plan, index) => `<article class="glass-panel plan-card"><h3>${plan.name}</h3><p class="plan-price"><strong>$${plan.premium}</strong><span>/ month</span></p><p class="plan-deductible">$${plan.deductible.toLocaleString()} deductible</p><button class="button button-primary" type="button" data-plan-index="${index}">Apply for plan</button></article>`).join("")}</div></section>` : "";
  return `${pageHeading("Coverage", "Insurance", "Manage your coverage details and fictional plan enrollment.")}<div class="insurance-layout">${summary}${plans}</div>`;
}

function fullStateName(code) {
  return ({ FL: "Florida", GA: "Georgia" })[code] || code;
}

function displayTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function doctorHoursMarkup(doctor) {
  return `<ul class="hours-list">${Object.entries(doctor.hours).map(([day, hours]) => `<li><span>${day.slice(0, 3)}</span><span>${hours ? `${displayTime(hours[0])} to ${displayTime(hours[1])}` : "Closed"}</span></li>`).join("")}</ul>`;
}

function doctorMatchesSearch(doctor, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const stateSearch = normalized === "georgia" ? "GA" : normalized === "florida" ? "FL" : normalized.toUpperCase();
  if (["GA", "FL"].includes(stateSearch) && normalized.length <= 7) return doctor.state === stateSearch;
  const [city, state] = normalized.split(",").map(value => value.trim());
  if (state && city) {
    const normalizedState = state === "georgia" ? "ga" : state === "florida" ? "fl" : state;
    return doctor.city.toLowerCase().includes(city) && (doctor.state.toLowerCase() === normalizedState || fullStateName(doctor.state).toLowerCase() === normalizedState);
  }
  return doctor.city.toLowerCase().includes(normalized) || doctor.state.toLowerCase() === normalized || fullStateName(doctor.state).toLowerCase() === normalized;
}

function doctorsView(user) {
  if (doctorSearch === null) doctorSearch = `${user.city || "Tampa"}, ${user.state || "FL"}`;
  const doctors = data.doctors.filter(doctor => doctorMatchesSearch(doctor, doctorSearch));
  return `${pageHeading("Care directory", "Find a doctor", "Search fictional providers by city or state.")}<form class="doctor-search glass-panel" id="doctor-search-form"><label class="field">City or state<input name="location" value="${escapeHTML(doctorSearch)}" placeholder="Tampa, FL or Georgia" aria-label="Search doctors by city or state"></label><button class="button button-primary" type="submit">Search</button></form><p class="results-label">${doctors.length} ${doctors.length === 1 ? "provider" : "providers"} found</p><section class="doctor-grid">${doctors.map(doctor => `<article class="glass-panel doctor-card"><div class="doctor-card-head"><div><h2>${escapeHTML(doctor.name)}</h2><p>${escapeHTML(doctor.specialty)}</p></div><span class="doctor-location">${escapeHTML(doctor.city)}, ${doctor.state}</span></div><h3>Weekly hours</h3>${doctorHoursMarkup(doctor)}<a class="button button-primary" href="#/book/${doctor.id}">Book appointment</a></article>`).join("") || '<div class="empty-panel glass-panel">No doctors match this location.</div>'}</section>`;
}

function appointmentSlots(doctor, date) {
  if (!date) return { closed: false, slots: [] };
  const day = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
  const hours = doctor.hours[day];
  if (!hours) return { closed: true, slots: [] };
  const toMinutes = time => time.split(":").reduce((total, part, index) => total + Number(part) * (index === 0 ? 60 : 1), 0);
  const start = toMinutes(hours[0]);
  const end = toMinutes(hours[1]);
  const slots = [];
  for (let minute = start; minute + 30 <= end; minute += 30) slots.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
  return { closed: false, slots };
}

function bookingView(doctorId, user) {
  const doctor = data.doctors.find(item => item.id === doctorId);
  if (!doctor) return `<div class="glass-panel empty-panel">Doctor not found.</div>`;
  const availability = appointmentSlots(doctor, bookingDate);
  const patient = user.role === "caregiver" ? patientAccount(user.patientId) : user;
  const dateField = `<label class="field">Visit date<input name="date" type="date" min="${dateFromToday(0)}" value="${escapeHTML(bookingDate)}" required></label>`;
  const slotField = availability.closed ? `<p class="closed-day" role="status">Closed. Choose another day.</p>` : bookingDate ? `<label class="field">Available 30-minute time slots<select name="time" required><option value="">Choose a time</option>${availability.slots.map(slot => `<option value="${slot}">${displayTime(slot)}</option>`).join("")}</select></label>` : `<p class="form-intro">Choose a date to see available 30-minute appointments.</p>`;
  return `${pageHeading("Appointment booking", doctor.name, `${doctor.specialty} · ${doctor.city}, ${doctor.state}`)}<form class="glass-panel booking-form" id="booking-form" data-doctor-id="${doctor.id}"><p class="acting-copy">Booking for <strong>${escapeHTML(patient?.name || user.name)}</strong></p>${dateField}${slotField}<label class="field">Visit reason<input name="reason" maxlength="120" required></label><button class="button button-primary" type="submit"${!bookingDate || availability.closed || !availability.slots.length ? " disabled" : ""}>Request appointment</button></form>`;
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
    ["FR-03", "A patient or caregiver can apply for a fictional insurance plan.", "Insurance (#/insurance)"],
    ["FR-04", "Patients can search doctors by city or state.", "Find a doctor (#/doctors)"],
    ["FR-05", "Patients can book a 30-minute appointment during provider hours.", "Doctor booking and appointments"],
    ["FR-06", "Prescription-only medicines require a valid prescription at checkout.", "Pharmacy checkout (#/pharmacy)"],
    ["FR-07", "Patients can simulate online payment or choose cash on delivery.", "Pharmacy checkout (#/pharmacy)"],
    ["SR-01", "Patients can view only their own patient record.", "Patient record (#/patient/<id>)"],
    ["SR-02", "Providers see only booked visits and limited patient information.", "Provider appointments (#/appointments)"],
    ["SR-03", "Caregiver appointments and orders require patient approval.", "Caregiver requests on patient home"],
    ["SR-04", "Insurance details require identity verification before entry.", "Insurance verification (#/insurance)"],
    ["BR-02", "Expired or missing prescriptions block Rx-only checkout items.", "Pharmacy checkout (#/pharmacy)"],
    ["BR-03", "Caregiver requests are held for patient approval.", "Approvals card on patient home"],
    ["BR-04", "Appointments are offered only during provider business hours.", "Doctor booking"],
    ["BR-05", "State searches return providers in that state only.", "Find a doctor (#/doctors)"],
    ["BR-06", "Checkout uses the price for the patient's insurance status.", "Pharmacy cart totals"],
    ["DR-02", "Insurance stores insurer, member ID, and group number.", "Insurance details"],
    ["DR-03", "Order history records items, prescriptions, payment, delivery, and tracking.", "Orders (#/orders)"],
    ["DR-04", "Patients can review payment history.", "Payments (#/payments)"],
    ["IR-01", "Insurance status is None, Pending, or Approved.", "Insurance (#/insurance)"],
    ["IR-02", "Order tracking shows four pharmacy fulfillment steps.", "Order tracker (#/orders)"],
    ["IR-03", "Doctor search starts from the patient's profile location.", "Find a doctor (#/doctors)"],
    ["NFR-01", "Payment history is available 24/7.", "Payments (#/payments)"],
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
  if (route === "/patient" && currentUser()?.role === "provider") route = "/appointments";
  if (route !== "/insurance") verificationChallenge = null;
  if (route !== "/doctors") doctorSearch = null;
  if (!route.startsWith("/book/")) bookingDate = "";
  renderShell(route);
  const user = currentUser();
  if (route === "/login") app.innerHTML = loginView();
  else if (route === "/register") app.innerHTML = registerView();
  else if (route === "/home" && user?.role === "coordinator") app.innerHTML = coordinatorHome();
  else if (route === "/home" && user?.role === "patient") app.innerHTML = patientHome(user);
  else if (route === "/home" && user?.role === "provider") app.innerHTML = providerAppointmentsView(user);
  else if (route === "/home") app.innerHTML = linkedPatient(user);
  else if (route === "/patients") app.innerHTML = rosterView();
  else if (route === "/requirements") app.innerHTML = requirementsView();
  else if (["/care-team", "/pharmacies"].includes(route)) app.innerHTML = directoryView(route);
  else if (route === "/patient" && user?.role === "caregiver") app.innerHTML = linkedPatient(user);
  else if (route.startsWith("/patient/")) app.innerHTML = patientRecordView(user, route.slice("/patient/".length));
  else if (route === "/insurance" && !user.identityVerified) {
    if (!verificationChallenge || verificationChallenge.email !== user.email) verificationChallenge = { email: user.email, code: String(Math.floor(100000 + Math.random() * 900000)), notified: false };
    app.innerHTML = identityVerificationView();
    if (!verificationChallenge.notified) {
      announce(`Demo text message: your code is ${verificationChallenge.code}.`);
      verificationChallenge.notified = true;
    }
  }
  else if (route === "/insurance") app.innerHTML = insuranceView(user);
  else if (route === "/doctors") app.innerHTML = doctorsView(user);
  else if (route.startsWith("/book/")) app.innerHTML = bookingView(route.slice("/book/".length), user);
  else if (route === "/appointments") app.innerHTML = appointmentsView(user);
  else if (route === "/pharmacy") app.innerHTML = pharmacyView(user);
  else if (route === "/orders") app.innerHTML = ordersView(user);
  else if (route === "/payments") app.innerHTML = paymentsView(user);
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

function handleIdentityVerification(form) {
  const user = currentUser();
  const input = form.elements.code.value.trim();
  const error = document.getElementById("identity-error");
  if (!verificationChallenge || input !== verificationChallenge.code) {
    error.textContent = "That code is incorrect. Try again.";
    return;
  }
  user.identityVerified = true;
  const patient = data.patients.find(item => item.id === user.patientId);
  if (patient) patient.identityVerified = true;
  saveData();
  verificationChallenge = null;
  render();
  announce("Identity verified");
}

function handleInsuranceSave(form) {
  const user = currentUser();
  const owner = insuranceOwner(user);
  let valid = true;
  for (const [name, label] of [["insurer", "Insurer"], ["memberId", "Member ID"], ["groupNumber", "Group number"]]) {
    const message = form.elements[name].value.trim() ? "" : `${label} is required.`;
    setFieldError(form, name, message);
    if (message) valid = false;
  }
  if (!valid) return;
  owner.insuranceDetails = { insurer: form.elements.insurer.value.trim(), memberId: form.elements.memberId.value.trim(), groupNumber: form.elements.groupNumber.value.trim(), submitted: true };
  owner.insurance = "Pending";
  syncPatientInsurance(owner);
  saveData();
  render();
  announce("Insurance details saved. Status: Pending.");
}

function applyForPlan(index) {
  const user = currentUser();
  const owner = insuranceOwner(user);
  const plan = insurancePlans[index];
  if (!plan) return;
  owner.insurance = "Pending";
  owner.insuranceDetails = { insurer: plan.name, planName: plan.name, memberId: "", groupNumber: "", submitted: true, premium: plan.premium, deductible: plan.deductible };
  syncPatientInsurance(owner);
  saveData();
  render();
  announce(`${plan.name} application submitted. Status: Pending.`);
}

function simulateInsurerResponse() {
  const owner = insuranceOwner(currentUser());
  if (insuranceStatus(owner) !== "Pending") return;
  owner.insurance = "Approved";
  owner.insuranceDetails = owner.insuranceDetails || { insurer: "Suncoast Health Plan", groupNumber: "", submitted: true };
  if (!owner.insuranceDetails.memberId) owner.insuranceDetails.memberId = `WM-${String(owner.patientId || 1).padStart(3, "0")}-4821`;
  syncPatientInsurance(owner);
  saveData();
  render();
  announce("Insurer response simulated. Status: Approved.");
}

function handleBooking(form) {
  const user = currentUser();
  const doctor = doctorById(form.dataset.doctorId);
  if (!doctor) return;
  const date = form.elements.date.value;
  const time = form.elements.time?.value;
  const availability = appointmentSlots(doctor, date);
  if (availability.closed || !availability.slots.includes(time)) return;
  const patientId = user.role === "caregiver" ? user.patientId : user.patientId;
  const awaitingApproval = user.role === "caregiver";
  data.appointments.push({ id: `visit-${Date.now()}`, patientId, doctorId: doctor.id, date, time, reason: form.elements.reason.value.trim(), status: awaitingApproval ? "awaiting-approval" : "confirmed", requestedBy: user.email, requestedAt: new Date().toISOString() });
  saveData();
  window.location.hash = "#/appointments";
  announce(awaitingApproval ? "Appointment request sent for patient approval." : "Appointment confirmed.");
}

function recordOnlinePayment(order) {
  if (data.payments.some(payment => payment.id === `pay-${order.id}`)) return;
  const status = order.paymentMethod === "online" ? "Paid" : "Due on delivery";
  data.payments.push({ id: `pay-${order.id}`, patientId: order.patientId, date: dateFromToday(0), description: `Pharmacy order ${order.id.slice(-6)}`, amount: order.total, method: order.paymentMethod, status });
  order.paymentStatus = status;
}

function checkoutOrder() {
  const user = currentUser();
  const patientId = pharmacyPatientId(user);
  const cart = data.carts[String(patientId)] || {};
  const items = Object.entries(cart).map(([id, quantity]) => ({ medicine: data.medicines.find(item => item.id === id), quantity: Number(quantity) })).filter(item => item.medicine && item.quantity > 0);
  const error = document.getElementById("checkout-error");
  if (!items.length) return;
  for (const item of items) {
    if (item.medicine.type !== "Rx-only") continue;
    const prescription = prescriptionFor(patientId, item.medicine.id);
    if (!prescription) {
      error.textContent = `${item.medicine.name} needs a prescription from your doctor.`;
      return;
    }
    if (prescription.validThrough < dateFromToday(0)) {
      const expired = shortDate(prescription.validThrough);
      error.textContent = `Your ${item.medicine.name.toLowerCase()} prescription expired ${expired}.`;
      return;
    }
  }
  const insured = applicableInsurance(user);
  const method = document.querySelector('input[name="payment-method"]:checked')?.value || "online";
  const id = `order-${Date.now()}`;
  const order = {
    id, patientId, date: dateFromToday(0), createdAt: new Date().toISOString(), requestedAt: new Date().toISOString(),
    items: items.map(item => ({ medicineId: item.medicine.id, name: item.medicine.name, quantity: item.quantity, prescriptionStatus: prescriptionStatus(patientId, item.medicine) })),
    total: items.reduce((sum, item) => sum + (insured ? item.medicine.withInsurance : item.medicine.withoutInsurance) * item.quantity, 0),
    paymentMethod: method, paymentStatus: user.role === "caregiver" ? "Awaiting patient approval" : method === "online" ? "Paid" : "Due on delivery",
    expectedDelivery: dateFromToday(3), status: "Placed", approvalStatus: user.role === "caregiver" ? "awaiting" : "approved", requestedBy: user.email
  };
  data.orders.push(order);
  if (user.role !== "caregiver") recordOnlinePayment(order);
  delete data.carts[String(patientId)];
  saveData();
  window.location.hash = "#/orders";
  announce(user.role === "caregiver" ? "Order sent for patient approval." : "Order placed.");
}

function handleApproval(action, type, id) {
  if (type === "appointment") {
    const appointment = data.appointments.find(item => item.id === id);
    if (!appointment || appointment.status !== "awaiting-approval") return;
    appointment.status = action === "approve" ? "confirmed" : "cancelled";
  } else if (type === "order") {
    const order = data.orders.find(item => item.id === id);
    if (!order || order.approvalStatus !== "awaiting") return;
    if (action === "approve") {
      order.approvalStatus = "approved";
      order.paymentStatus = order.paymentMethod === "online" ? "Pending payment" : "Due on delivery";
      recordOnlinePayment(order);
    } else {
      order.approvalStatus = "declined";
      order.status = "Cancelled";
      order.paymentStatus = "Not charged";
    }
  }
  saveData();
  render();
  announce(action === "approve" ? "Request approved." : "Request declined.");
}

function advanceOrder(id) {
  const order = data.orders.find(item => item.id === id);
  const steps = ["Placed", "Confirmed by pharmacy", "Out for delivery", "Delivered"];
  const currentIndex = order ? steps.indexOf(order.status) : -1;
  if (!order || currentIndex < 0 || currentIndex >= steps.length - 1) return;
  order.status = steps[currentIndex + 1];
  saveData();
  render();
  announce(`Order status updated: ${order.status}.`);
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
  data.patients.push({ id: patientId, name: user.name, age: user.age, weight: user.weight, city: user.city, state: user.state, doctor: "Unassigned", pharmacy: "Unassigned", caregiver: "Unassigned", insurance: user.insurance, identityVerified: false });
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
  const approval = event.target.closest("[data-approval]");
  if (approval) {
    handleApproval(approval.dataset.approval, approval.dataset.approvalType, approval.dataset.approvalId);
    return;
  }
  const planButton = event.target.closest("[data-plan-index]");
  if (planButton) {
    applyForPlan(Number(planButton.dataset.planIndex));
    return;
  }
  const addMedicine = event.target.closest("[data-add-medicine]");
  if (addMedicine) {
    const user = currentUser();
    const patientId = pharmacyPatientId(user);
    const medicineId = addMedicine.dataset.addMedicine;
    const quantity = Number(document.querySelector(`[data-quantity="${medicineId}"]`)?.value || 1);
    const cart = data.carts[String(patientId)] || (data.carts[String(patientId)] = {});
    cart[medicineId] = (Number(cart[medicineId]) || 0) + Math.max(1, Math.min(10, quantity));
    saveData();
    render();
    announce("Item added to cart");
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
  if (action === "simulate-insurer") simulateInsurerResponse();
  if (action === "checkout") checkoutOrder();
  if (action === "advance-order") advanceOrder(event.target.closest("[data-action]").dataset.orderId);
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
  if (event.target.id === "identity-form") {
    event.preventDefault();
    handleIdentityVerification(event.target);
  }
  if (event.target.id === "insurance-form") {
    event.preventDefault();
    handleInsuranceSave(event.target);
  }
  if (event.target.id === "doctor-search-form") {
    event.preventDefault();
    doctorSearch = event.target.elements.location.value.trim();
    render();
  }
  if (event.target.id === "booking-form") {
    event.preventDefault();
    handleBooking(event.target);
  }
});

document.addEventListener("change", event => {
  if (event.target.matches('input[name="payment-method"]')) {
    const button = document.querySelector(".checkout-button");
    if (button) button.textContent = event.target.value === "cod" ? "Place order" : `Pay ${document.querySelector(".applied-total strong")?.textContent || "$0.00"}`;
  }
  if (event.target.matches('#booking-form input[name="date"]')) {
    const form = event.target.closest("form");
    const doctorId = form.dataset.doctorId;
    const reason = form.elements.reason.value;
    bookingDate = event.target.value;
    app.innerHTML = bookingView(doctorId, currentUser());
    const reasonField = app.querySelector('#booking-form [name="reason"]');
    if (reasonField) reasonField.value = reason;
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
