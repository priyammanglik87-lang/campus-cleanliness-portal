const wasSyncedFromUrl = hydrateFromSharedUrlIfPresent();
ensureTopicUrlSlug();

let reports = loadReports();
let registeredUsers = loadRegisteredUsers();
let currentRole = "reporter";

const ACADEMIC_LOCATIONS = [
  "Academic Block - School of Computing",
  "Academic Block - School of Law",
  "Academic Block - School of Agriculture",
  "Academic Block - School of Pharmacy",
  "Academic Block - School of Commerce",
  "Academic Block - School of Physical Education"
];

const DINING_LOCATIONS = [
  "Food Court near Central Mess-1",
  "Food Court behind BH-1",
  "Food Court near 34 Block"
];

const OTHER_LOCATIONS = [
  "Near Uni Mall",
  "Uni Hospital",
  "Robo Park",
  "UniPolis",
  "Sports Arena"
];

const LOCATIONS = [...ACADEMIC_LOCATIONS, ...DINING_LOCATIONS, ...OTHER_LOCATIONS];

// Auth DOM Elements
const authGateEl = document.getElementById("authGate");
const portalAppEl = document.getElementById("portalApp");
const tabLoginBtn = document.getElementById("tabLoginBtn");
const tabRegisterBtn = document.getElementById("tabRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authAlertEl = document.getElementById("authAlert");
const regPasswordInput = document.getElementById("regPassword");
const activeUserRegEl = document.getElementById("activeUserReg");
const logoutBtn = document.getElementById("logoutBtn");
const copySyncLinkBtn = document.getElementById("copySyncLinkBtn");

// Modal DOM Elements
const successModal = document.getElementById("successModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalTicketId = document.getElementById("modalTicketId");
const modalIssueTitle = document.getElementById("modalIssueTitle");
const modalLocation = document.getElementById("modalLocation");
const modalReportedBy = document.getElementById("modalReportedBy");

// Portal DOM Elements
const form = document.getElementById("feedbackForm");
const alertBanner = document.getElementById("alertBanner");
const reportsListEl = document.getElementById("reportsList");
const locationSummaryEl = document.getElementById("locationSummary");
const resultCountEl = document.getElementById("resultCount");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterLocation = document.getElementById("filterLocation");
const filterStatus = document.getElementById("filterStatus");

const statusFieldGroup = document.getElementById("statusFieldGroup");
const roomStatusRow = document.getElementById("status")?.parentElement?.parentElement;
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formHeading = document.getElementById("form-heading");
const roleReporterBtn = document.getElementById("roleReporterBtn");
const roleAdminBtn = document.getElementById("roleAdminBtn");

function showAuthAlert(message, type = "error") {
  authAlertEl.textContent = message;
  authAlertEl.className = `alert ${type}`;
}

function hideAuthAlert() {
  authAlertEl.classList.add("hidden");
}

function updatePasswordChecklist() {
  const checks = checkPasswordStrength(regPasswordInput.value);
  document.getElementById("rule-upper").classList.toggle("valid", checks.hasUpper);
  document.getElementById("rule-lower").classList.toggle("valid", checks.hasLower);
  document.getElementById("rule-special").classList.toggle("valid", checks.hasSpecial);
  document.getElementById("rule-length").classList.toggle("valid", checks.hasMinLength);
}

regPasswordInput.addEventListener("input", updatePasswordChecklist);

function openSuccessModal(report) {
  if (!successModal) return;
  modalTicketId.textContent = report.id;
  modalIssueTitle.textContent = report.title;
  modalLocation.textContent = report.location;
  modalReportedBy.textContent = report.reportedBy;
  successModal.classList.remove("hidden");
}

function closeSuccessModal() {
  if (successModal) {
    successModal.classList.add("hidden");
  }
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", () => {
    closeSuccessModal();
    reportsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (successModal) {
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal && !successModal.classList.contains("hidden")) {
    closeSuccessModal();
  }
});

function getUserDisplayName(regNo) {
  const normalized = normalizeRegNo(regNo);
  if (!normalized) return "";
  registeredUsers = loadRegisteredUsers();
  const user = registeredUsers[normalized];
  const sessionName = sessionStorage.getItem("pk_active_user_name");
  const name = (user && user.fullName) || sessionName;
  if (name) {
    return `${name} (${normalized})`;
  }
  return `User (${normalized})`;
}

function switchAuthTab(mode) {
  const isLogin = mode === "login";
  tabLoginBtn.classList.toggle("active", isLogin);
  tabRegisterBtn.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("hidden", !isLogin);
  registerForm.classList.toggle("hidden", isLogin);
  hideAuthAlert();
  clearFieldErrors(["loginFullName", "loginRegNo", "loginPassword", "regFullName", "regNumber", "regPassword", "regConfirmPassword"]);
}

tabLoginBtn.addEventListener("click", () => switchAuthTab("login"));
tabRegisterBtn.addEventListener("click", () => switchAuthTab("register"));

function enterPortal(regNo, customName = "") {
  const normalized = normalizeRegNo(regNo);
  setActiveSessionRegNo(normalized);

  if (customName) {
    sessionStorage.setItem("pk_active_user_name", customName);
    registeredUsers = loadRegisteredUsers();
    if (registeredUsers[normalized]) {
      registeredUsers[normalized].fullName = customName;
      saveRegisteredUsers(registeredUsers);
    }
  }

  const displayName = getUserDisplayName(normalized);
  activeUserRegEl.textContent = displayName;

  const reportedByInput = document.getElementById("reportedBy");
  reportedByInput.value = displayName;

  authGateEl.classList.add("hidden");
  portalAppEl.classList.remove("hidden");
  ensureTopicUrlSlug();
  syncFormByRole();
  refreshApp();
}

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearFieldErrors(["regFullName", "regNumber", "regPassword", "regConfirmPassword"]);
  hideAuthAlert();

  const fullName = document.getElementById("regFullName").value;
  const regNo = document.getElementById("regNumber").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  registeredUsers = loadRegisteredUsers();
  const { isValid, errors, cleanReg, cleanFullName } = validateCredentialSetup(
    { fullName, regNo, password, confirmPassword },
    registeredUsers
  );

  if (!isValid) {
    renderFieldErrors(errors);
    showAuthAlert("Please meet all mandatory fields and password requirements.", "error");
    return;
  }

  registeredUsers[cleanReg] = {
    regNo: cleanReg,
    fullName: cleanFullName,
    password: password,
    createdAt: new Date().toISOString()
  };
  saveRegisteredUsers(registeredUsers);
  sessionStorage.setItem("pk_active_user_name", cleanFullName);

  registerForm.reset();
  updatePasswordChecklist();
  enterPortal(cleanReg, cleanFullName);
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearFieldErrors(["loginFullName", "loginRegNo", "loginPassword"]);
  hideAuthAlert();

  const fullName = document.getElementById("loginFullName").value;
  const regNo = document.getElementById("loginRegNo").value;
  const password = document.getElementById("loginPassword").value;

  const { isValid, errors, cleanReg, cleanName } = validateLoginInput({ fullName, regNo, password });
  if (!isValid) {
    renderFieldErrors(errors);
    showAuthAlert("Name, Registration number, and password are mandatory.", "error");
    return;
  }

  registeredUsers = loadRegisteredUsers();
  let account = registeredUsers[cleanReg];

  if (!account) {
    // Auto-register first-time user entering through login
    account = {
      regNo: cleanReg,
      fullName: cleanName,
      password: password,
      createdAt: new Date().toISOString()
    };
    registeredUsers[cleanReg] = account;
    saveRegisteredUsers(registeredUsers);
  } else {
    // Verify password if account exists
    if (account.password && account.password !== password) {
      renderFieldErrors({
        loginPassword: "Incorrect password for this registration number."
      });
      showAuthAlert("Invalid credentials. Access denied.", "error");
      return;
    }
    // Update name to latest input
    account.fullName = cleanName;
    saveRegisteredUsers(registeredUsers);
  }

  sessionStorage.setItem("pk_active_user_name", cleanName);
  loginForm.reset();
  enterPortal(cleanReg, cleanName);
});

logoutBtn.addEventListener("click", () => {
  setActiveSessionRegNo("");
  sessionStorage.removeItem("pk_active_user_name");
  resetFormState();
  portalAppEl.classList.add("hidden");
  authGateEl.classList.remove("hidden");
  switchAuthTab("login");
});

copySyncLinkBtn.addEventListener("click", async () => {
  const shareUrl = buildCrossBrowserShareUrl();
  try {
    await navigator.clipboard.writeText(shareUrl);
    showAlert("Cross-browser link copied! Paste it in any other browser to access with your credentials & data.", "success");
  } catch (err) {
    window.prompt("Copy this URL to open in another browser:", shareUrl);
  }
});

function showAlert(message, type = "success") {
  alertBanner.textContent = message;
  alertBanner.className = `alert ${type}`;
  clearTimeout(showAlert._timer);
  showAlert._timer = setTimeout(() => {
    alertBanner.classList.add("hidden");
  }, 4500);
}

function formatNow() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function syncFormByRole() {
  const isAdmin = currentRole === "admin";
  const complaintFormSection = document.getElementById("complaintFormSection");
  const workspaceGrid = document.querySelector(".workspace-grid");

  if (complaintFormSection) {
    complaintFormSection.classList.toggle("hidden", isAdmin);
  }
  if (workspaceGrid) {
    workspaceGrid.classList.toggle("admin-view", isAdmin);
  }

  if (statusFieldGroup) {
    statusFieldGroup.classList.toggle("hidden", !isAdmin);
  }
  if (roomStatusRow && roomStatusRow.classList) {
    roomStatusRow.classList.toggle("single-col", !isAdmin);
  }
  const statusInput = document.getElementById("status");
  if (!isAdmin && statusInput) {
    statusInput.value = "Reported";
  }
}

function setRole(role) {
  currentRole = role;
  const isAdmin = role === "admin";

  roleReporterBtn.classList.toggle("active", !isAdmin);
  roleAdminBtn.classList.toggle("active", isAdmin);

  resetFormState();
  syncFormByRole();
  renderReports();
  showAlert(
    isAdmin
      ? "Switched to Admin / Staff View: Complaint entry is disabled. Review, update statuses, and manage records."
      : "Switched to Reporter View: Submit new complaints and track status.",
    "success"
  );
}

roleReporterBtn.addEventListener("click", () => setRole("reporter"));
roleAdminBtn.addEventListener("click", () => setRole("admin"));

let currentLocFilterTab = "all";

function renderDashboard() {
  const total = reports.length;
  const reported = reports.filter((r) => r.status === "Reported").length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statReported").textContent = reported;
  document.getElementById("statProgress").textContent = inProgress;
  document.getElementById("statResolved").textContent = resolved;

  const renderLocationCards = (locList, icon) => {
    return locList
      .map((loc) => {
        const locItems = reports.filter((r) => r.location === loc);
        const activeCount = locItems.filter((r) => r.status !== "Resolved").length;
        const resolvedCount = locItems.filter((r) => r.status === "Resolved").length;
        const isSelected = filterLocation.value === loc;

        const badgeHtml =
          activeCount > 0
            ? `<span class="loc-badge badge-open">${activeCount} Open</span>`
            : `<span class="loc-badge badge-clean">✓ Clear</span>`;

        return `
          <div class="loc-item ${isSelected ? "active-loc" : ""}"
               role="button"
               tabindex="0"
               onclick="quickFilterLocation('${escapeHTML(loc)}')"
               onkeydown="if(event.key==='Enter'||event.key===' ')quickFilterLocation('${escapeHTML(loc)}')"
               title="Click to view and filter complaints for ${escapeHTML(loc)}">
            <div class="loc-card-top loc-info-horizontal">
              <span class="loc-icon">${icon}</span>
              <strong class="loc-name">${escapeHTML(loc)}</strong>
            </div>
            <div class="loc-card-bottom loc-meta-horizontal">
              <div class="loc-stat-row">
                <span>Total: <b>${locItems.length}</b></span>
                <span>Open: <b>${activeCount}</b></span>
                <span>Resolved: <b>${resolvedCount}</b></span>
              </div>
              ${badgeHtml}
            </div>
          </div>
        `;
      })
      .join("");
  };

  const showAcademic = currentLocFilterTab === "all" || currentLocFilterTab === "academic";
  const showDining = currentLocFilterTab === "all" || currentLocFilterTab === "dining";
  const showOther = currentLocFilterTab === "all" || currentLocFilterTab === "facilities";

  locationSummaryEl.innerHTML = `
    <div class="loc-header-bar">
      <div class="loc-tabs-bar" role="tablist" aria-label="Location Categories">
        <button type="button" class="loc-tab-btn ${currentLocFilterTab === "all" ? "active" : ""}" onclick="switchLocationTab('all')">
          All Zones (14)
        </button>
        <button type="button" class="loc-tab-btn ${currentLocFilterTab === "academic" ? "active" : ""}" onclick="switchLocationTab('academic')">
          🏛️ Academic Blocks (6)
        </button>
        <button type="button" class="loc-tab-btn ${currentLocFilterTab === "dining" ? "active" : ""}" onclick="switchLocationTab('dining')">
          🍲 Food Courts (3)
        </button>
        <button type="button" class="loc-tab-btn ${currentLocFilterTab === "facilities" ? "active" : ""}" onclick="switchLocationTab('facilities')">
          📍 Facilities (5)
        </button>
      </div>
    </div>

    <div class="location-categories-horizontal ${currentLocFilterTab !== "all" ? "single-category-view" : ""}">
      ${showAcademic ? `
      <div class="location-group">
        <div class="group-header">
          <span class="group-title">
            <span class="group-icon">🏛️</span> Academic Blocks &amp; Schools
          </span>
          <span class="group-count">6 Departments</span>
        </div>
        <div class="location-grid">
          ${renderLocationCards(ACADEMIC_LOCATIONS, "🏫")}
        </div>
      </div>` : ""}

      ${showDining ? `
      <div class="location-group">
        <div class="group-header">
          <span class="group-title">
            <span class="group-icon">🍽️</span> Food Courts &amp; Dining Areas
          </span>
          <span class="group-count">3 Locations</span>
        </div>
        <div class="location-grid">
          ${renderLocationCards(DINING_LOCATIONS, "🍲")}
        </div>
      </div>` : ""}

      ${showOther ? `
      <div class="location-group">
        <div class="group-header">
          <span class="group-title">
            <span class="group-icon">📍</span> Campus Facilities &amp; Landmarks
          </span>
          <span class="group-count">5 Locations</span>
        </div>
        <div class="location-grid">
          ${renderLocationCards(OTHER_LOCATIONS, "🏢")}
        </div>
      </div>` : ""}
    </div>
  `;
}

window.switchLocationTab = function (tab) {
  currentLocFilterTab = tab;
  renderDashboard();
};

window.quickFilterLocation = function (loc) {
  if (filterLocation.value === loc) {
    filterLocation.value = "ALL";
    showAlert("Showing complaints across all locations.", "success");
  } else {
    filterLocation.value = loc;
    showAlert(`Filtered complaints by location: "${loc}". Click card again to reset.`, "success");
  }
  renderDashboard();
  renderReports();
  reportsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
};

function getFilteredReports() {
  const query = searchInput.value.trim().toLowerCase();
  const cat = filterCategory.value;
  const loc = filterLocation.value;
  const stat = filterStatus.value;

  return reports.filter((r) => {
    const matchesQuery =
      !query ||
      r.id.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.roomDetail.toLowerCase().includes(query) ||
      r.reportedBy.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query);

    const matchesCat = cat === "ALL" || r.category === cat;
    const matchesLoc = loc === "ALL" || r.location === loc;
    const matchesStat = stat === "ALL" || r.status === stat;

    return matchesQuery && matchesCat && matchesLoc && matchesStat;
  });
}

function getCategoryTagHtml(category) {
  const safeCat = escapeHTML(category || "Unassigned");
  let icon = "📋";
  let cls = "tag-cat-common";
  const normalized = (category || "").toLowerCase();

  if (normalized.includes("class")) {
    icon = "🏫";
    cls = "tag-cat-classroom";
  } else if (normalized.includes("wash")) {
    icon = "🚻";
    cls = "tag-cat-washroom";
  } else if (normalized.includes("corridor") || normalized.includes("stair")) {
    icon = "🪜";
    cls = "tag-cat-corridor";
  } else if (normalized.includes("common")) {
    icon = "🌳";
    cls = "tag-cat-common";
  }

  return `<span class="tag tag-category ${cls}"><span class="cat-tag-icon">${icon}</span> ${safeCat}</span>`;
}

function renderReports() {
  const filtered = getFilteredReports();
  const isAdmin = currentRole === "admin";
  resultCountEl.textContent = `${filtered.length} of ${reports.length} shown`;

  if (filtered.length === 0) {
    reportsListEl.innerHTML = `
      <div class="empty-state">
        No cleanliness complaints match your current search or filter criteria.
      </div>
    `;
    return;
  }

  reportsListEl.innerHTML = filtered
    .map((r) => {
      const statusClass = `status-${r.status.replace(/\s+/g, "-")}`;
      const controlsHTML = isAdmin
        ? `
          <div class="card-controls">
            <select aria-label="Update status for ${escapeHTML(r.id)}" onchange="handleQuickStatus('${r.id}', this.value)">
              <option value="Reported" ${r.status === "Reported" ? "selected" : ""}>Reported</option>
              <option value="In Progress" ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Resolved" ${r.status === "Resolved" ? "selected" : ""}>Resolved</option>
            </select>
            <button type="button" class="btn-sm btn-danger" onclick="deleteReport('${r.id}')" title="Delete complaint">Delete</button>
          </div>
        `
        : `<span class="locked-tag">Locked • Staff Managed</span>`;

      return `
        <article class="report-card">
          <div class="report-top">
            <div>
              <span class="report-id">Ticket: ${escapeHTML(r.id)}</span>
              <h3 class="report-title">${escapeHTML(r.title)}</h3>
            </div>
            <span class="status-pill ${statusClass}">${escapeHTML(r.status)}</span>
          </div>

          <div class="tags">
            ${getCategoryTagHtml(r.category)}
            <span class="tag">${escapeHTML(r.location)}</span>
            <span class="tag">${escapeHTML(r.roomDetail)}</span>
          </div>

          <p class="report-desc">${escapeHTML(r.description)}</p>

          <div class="report-footer">
            <span>By <b>${escapeHTML(r.reportedBy)}</b> • Updated: ${escapeHTML(r.updatedAt)}</span>
            ${controlsHTML}
          </div>
        </article>
      `;
    })
    .join("");
}

function refreshApp() {
  saveReports(reports);
  renderDashboard();
  renderReports();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const editId = document.getElementById("reportId").value;
  const isAdmin = currentRole === "admin";

  const payload = {
    title: document.getElementById("title").value.trim(),
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    roomDetail: document.getElementById("roomDetail").value.trim(),
    status: isAdmin ? document.getElementById("status").value : "Reported",
    reportedBy: document.getElementById("reportedBy").value.trim(),
    description: document.getElementById("description").value.trim()
  };

  const { isValid, errors } = validateFeedbackForm(payload);
  renderValidationErrors(errors);

  if (!isValid) {
    showAlert("Please fix the highlighted form errors before submitting.", "error");
    return;
  }

  if (editId && isAdmin) {
    reports = reports.map((r) =>
      r.id === editId ? { ...r, ...payload, updatedAt: formatNow() } : r
    );
    showAlert(`Complaint ${editId} updated successfully!`, "success");
    resetFormState();
  } else {
    const nextNum = 100 + reports.length + Math.floor(Math.random() * 90);
    const newReport = {
      id: `CLN-${nextNum}`,
      ...payload,
      status: "Reported",
      updatedAt: formatNow()
    };
    reports.unshift(newReport);
    openSuccessModal(newReport);
    showAlert(
      `Complaint registered with Ticket ID ${newReport.id}. Submitted complaints are locked for reporters.`,
      "success"
    );
    const currentReg = getActiveSessionRegNo();
    form.reset();
    if (currentReg) {
      document.getElementById("reportedBy").value = getUserDisplayName(currentReg);
    }
    syncFormByRole();
  }

  refreshApp();
});

function startEditReport(id) {
  if (currentRole !== "admin") {
    showAlert("Reporters cannot edit submitted complaints.", "error");
    return;
  }

  const target = reports.find((r) => r.id === id);
  if (!target) return;

  document.getElementById("reportId").value = target.id;
  document.getElementById("title").value = target.title;
  document.getElementById("category").value = target.category;
  document.getElementById("location").value = target.location;
  document.getElementById("roomDetail").value = target.roomDetail;
  document.getElementById("status").value = target.status;
  document.getElementById("reportedBy").value = target.reportedBy;
  document.getElementById("description").value = target.description;

  renderValidationErrors({});
  formHeading.textContent = `Manage Complaint (${target.id})`;
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });
}

function resetFormState() {
  const currentReg = getActiveSessionRegNo();
  form.reset();
  document.getElementById("reportId").value = "";
  if (currentReg) {
    document.getElementById("reportedBy").value = getUserDisplayName(currentReg);
  }
  renderValidationErrors({});
  formHeading.textContent = "Submit Cleanliness Complaint";
  submitBtn.textContent = "Submit Complaint";
  cancelEditBtn.classList.add("hidden");
  syncFormByRole();
}

cancelEditBtn.addEventListener("click", resetFormState);

window.handleQuickStatus = function (id, newStatus) {
  if (currentRole !== "admin") {
    showAlert("Only Admin / Staff can update complaint status.", "error");
    renderReports();
    return;
  }
  reports = reports.map((r) =>
    r.id === id ? { ...r, status: newStatus, updatedAt: formatNow() } : r
  );
  refreshApp();
  showAlert(`Status for ${id} updated to "${newStatus}".`, "success");
};

window.startEditReport = startEditReport;

window.deleteReport = function (id) {
  if (currentRole !== "admin") {
    showAlert("Reporters are not allowed to delete complaints.", "error");
    return;
  }
  reports = reports.filter((r) => r.id !== id);
  if (document.getElementById("reportId").value === id) {
    resetFormState();
  }
  refreshApp();
  showAlert(`Complaint ${id} removed.`, "success");
};

[searchInput, filterCategory, filterLocation, filterStatus].forEach((el) => {
  el.addEventListener("input", () => {
    renderReports();
    renderDashboard();
  });
  el.addEventListener("change", () => {
    renderReports();
    renderDashboard();
  });
});

document.getElementById("resetDemoBtn").addEventListener("click", () => {
  reports = resetDemoReports();
  resetFormState();
  refreshApp();
  showAlert("Demo campus records restored.", "success");
});

// Boot Check
const existingSessionReg = getActiveSessionRegNo();
registeredUsers = loadRegisteredUsers();
if (existingSessionReg && registeredUsers[existingSessionReg]) {
  enterPortal(existingSessionReg);
} else {
  setActiveSessionRegNo("");
  authGateEl.classList.remove("hidden");
  portalAppEl.classList.add("hidden");
  if (wasSyncedFromUrl) {
    showAuthAlert("Synced credentials & records loaded! Login with your set Registration No. & Password.", "success");
  }
}