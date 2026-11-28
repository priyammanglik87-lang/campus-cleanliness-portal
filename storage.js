const TOPIC_SLUG = "campus-cleanliness-feedback-portal";
const STORAGE_KEY = "pk_campus_cleanliness_reports_v2";
const USERS_STORAGE_KEY = "pk_campus_cleanliness_users_v1";
const SESSION_STORAGE_KEY = "pk_campus_cleanliness_session_v1";

const DEFAULT_REPORTS = [
  {
    id: "CLN-101",
    title: "Overflowing dustbin near computer lab",
    category: "Classroom",
    location: "Academic Block - School of Computing",
    roomDetail: "3rd Floor, Lab 302 Entrance",
    status: "Reported",
    reportedBy: "Sidhant Bhardwaj (12602251)",
    description: "Paper waste and plastic beverage cups overflowing from corner bin after morning programming practicals.",
    updatedAt: "19 Nov 2026, 09:30 AM"
  },
  {
    id: "CLN-102",
    title: "Water leakage and slippery floor",
    category: "Washroom",
    location: "Academic Block - School of Law",
    roomDetail: "2nd Floor Moot Court Washroom",
    status: "In Progress",
    reportedBy: "Vinayak Mahajan (12606595)",
    description: "Water leakage near sink causing slippery tiles; maintenance and caution signage needed.",
    updatedAt: "19 Nov 2026, 11:15 AM"
  },
  {
    id: "CLN-103",
    title: "Food packaging left on outdoor benches",
    category: "Common Area",
    location: "Near Uni Mall",
    roomDetail: "Open Plaza Seating Area",
    status: "Resolved",
    reportedBy: "Priyam Manglik (12616721)",
    description: "Tables and seating benches were cleared, sanitised, and bins emptied by housekeeping staff.",
    updatedAt: "19 Nov 2026, 02:10 PM"
  },
  {
    id: "CLN-104",
    title: "Spilled fertilizer & soil in agronomy lab aisle",
    category: "Classroom",
    location: "Academic Block - School of Agriculture",
    roomDetail: "Ground Floor, Agronomy Lab 1",
    status: "Reported",
    reportedBy: "Priyam Manglik (12616721)",
    description: "Soil samples and tray packaging dropped in the walkway need immediate sweeping.",
    updatedAt: "19 Nov 2026, 03:40 PM"
  },
  {
    id: "CLN-105",
    title: "Medicine blister packs & dry waste near pharmacy store",
    category: "Corridor & Stairs",
    location: "Academic Block - School of Pharmacy",
    roomDetail: "1st Floor Dispensing Corridor",
    status: "In Progress",
    reportedBy: "Sidhant Bhardwaj (12602251)",
    description: "Packaging cartons and foil discards piled near corridor recycling bin.",
    updatedAt: "19 Nov 2026, 04:15 PM"
  },
  {
    id: "CLN-106",
    title: "Sanitizer dispenser empty near lecture theatre",
    category: "Common Area",
    location: "Academic Block - School of Commerce",
    roomDetail: "2nd Floor LT-4 Entrance",
    status: "Resolved",
    reportedBy: "Vinayak Mahajan (12606595)",
    description: "Automatic hand sanitizer dispenser refilled and wiped clean.",
    updatedAt: "20 Nov 2026, 10:15 AM"
  },
  {
    id: "CLN-107",
    title: "Water puddle near indoor gym lockers",
    category: "Washroom",
    location: "Academic Block - School of Physical Education",
    roomDetail: "Ground Floor Shower & Locker Zone",
    status: "Reported",
    reportedBy: "Priyam Manglik (12616721)",
    description: "Shower drainage overflowed onto the locker room floor; mop and suction cleanup requested.",
    updatedAt: "20 Nov 2026, 11:30 AM"
  },
  {
    id: "CLN-108",
    title: "Discarded bottles around drone arena lawn",
    category: "Common Area",
    location: "Robo Park",
    roomDetail: "Testing Arena East Lawn",
    status: "Reported",
    reportedBy: "Sidhant Bhardwaj (12602251)",
    description: "Plastic bottles and workshop scraps spotted near the seating ring after student drone exhibition.",
    updatedAt: "20 Nov 2026, 01:20 PM"
  },
  {
    id: "CLN-109",
    title: "Medical waste bin lining replacement required",
    category: "Common Area",
    location: "Uni Hospital",
    roomDetail: "OPD Waiting Lobby Area B",
    status: "In Progress",
    reportedBy: "Vinayak Mahajan (12606595)",
    description: "Color-coded biomedical hazard liner needed for the outpatient collection bin.",
    updatedAt: "20 Nov 2026, 02:45 PM"
  },
  {
    id: "CLN-110",
    title: "Post-event flyers and packaging in foyer",
    category: "Common Area",
    location: "UniPolis",
    roomDetail: "Main Auditorium Gate 2 Foyer",
    status: "Resolved",
    reportedBy: "Priyam Manglik (12616721)",
    description: "Event stage wrap and pamphlet discards cleared out by cleanup crew.",
    updatedAt: "20 Nov 2026, 04:00 PM"
  },
  {
    id: "CLN-111",
    title: "Spilled sports drinks on indoor court boundary",
    category: "Common Area",
    location: "Sports Arena",
    roomDetail: "Badminton Court 3 Spectator Line",
    status: "In Progress",
    reportedBy: "Sidhant Bhardwaj (12602251)",
    description: "Spill near spectator bench needs dry mopping to prevent players slipping during practice.",
    updatedAt: "20 Nov 2026, 05:10 PM"
  },
  {
    id: "CLN-112",
    title: "Food packaging and beverage cups left on central tables",
    category: "Common Area",
    location: "Food Court near Central Mess-1",
    roomDetail: "Outdoor Covered Deck, Table 14",
    status: "Reported",
    reportedBy: "Priyam Manglik (12616721)",
    description: "Plates and drink cups left uncleaned after evening tea rush; table sanitization required.",
    updatedAt: "21 Nov 2026, 05:40 PM"
  },
  {
    id: "CLN-113",
    title: "Overflowing wet waste bin behind food stall",
    category: "Common Area",
    location: "Food Court behind BH-1",
    roomDetail: "Stall No. 4 Rear Service Area",
    status: "In Progress",
    reportedBy: "Vinayak Mahajan (12606595)",
    description: "Wet waste bin needs clearance and lid sanitization before dinner crowd.",
    updatedAt: "21 Nov 2026, 06:15 PM"
  },
  {
    id: "CLN-114",
    title: "Washbasin tap splashing and grease buildup",
    category: "Washroom",
    location: "Food Court near 34 Block",
    roomDetail: "Hand Wash Island Section 2",
    status: "Resolved",
    reportedBy: "Sidhant Bhardwaj (12602251)",
    description: "Basin cleaned, drain descaled, and soap dispenser replenished by housekeeping.",
    updatedAt: "21 Nov 2026, 07:00 PM"
  }
];

const LEGACY_LOC_MAP = {
  "Academic Block A": "Academic Block - School of Computing",
  "Academic Block B": "Academic Block - School of Law",
  "Central Library": "Academic Block - School of Commerce",
  "Main Canteen": "Near Uni Mall",
  "Sports & Courtyard": "Sports Arena"
};

function migrateLegacyReports(reportsList) {
  if (!Array.isArray(reportsList)) return [...DEFAULT_REPORTS];
  let changed = false;
  const migrated = reportsList.map((r) => {
    if (!r) return r;
    let updated = { ...r };
    if (updated.location && LEGACY_LOC_MAP[updated.location]) {
      updated.location = LEGACY_LOC_MAP[updated.location];
      changed = true;
    }
    if (updated.id === "CLN-105" && updated.category !== "Corridor & Stairs") {
      updated.category = "Corridor & Stairs";
      changed = true;
    }
    return updated;
  });
  if (changed) {
    saveReports(migrated);
  }
  return migrated;
}

function ensureTopicUrlSlug() {
  try {
    const hash = window.location.hash || "";
    if (!hash.startsWith(`#/${TOPIC_SLUG}`)) {
      window.history.replaceState(null, "", `#/${TOPIC_SLUG}`);
    }
  } catch (err) {
    console.warn("URL slug update skipped:", err);
  }
}

function hydrateFromSharedUrlIfPresent() {
  try {
    const hash = window.location.hash || "";
    const queryIdx = hash.indexOf("?sync=");
    if (queryIdx === -1) return false;

    const encoded = hash.slice(queryIdx + 6);
    const jsonStr = decodeURIComponent(escape(atob(encoded)));
    const payload = JSON.parse(jsonStr);

    if (payload && typeof payload === "object") {
      if (payload.users && typeof payload.users === "object") {
        const mergedUsers = { ...loadRegisteredUsers(), ...payload.users };
        saveRegisteredUsers(mergedUsers);
      }
      if (Array.isArray(payload.reports)) {
        saveReports(payload.reports);
      }
      window.history.replaceState(null, "", `#/${TOPIC_SLUG}`);
      return true;
    }
  } catch (err) {
    console.error("Cross-browser sync decode failed:", err);
  }
  return false;
}

function buildCrossBrowserShareUrl() {
  const payload = {
    users: loadRegisteredUsers(),
    reports: loadReports()
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}#/${TOPIC_SLUG}?sync=${encoded}`;
}

function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveReports(DEFAULT_REPORTS);
      return [...DEFAULT_REPORTS];
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [...DEFAULT_REPORTS];
    return migrateLegacyReports(list);
  } catch (err) {
    console.error("Storage read error:", err);
    return [...DEFAULT_REPORTS];
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function resetDemoReports() {
  saveReports(DEFAULT_REPORTS);
  return [...DEFAULT_REPORTS];
}

function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.error("User storage read error:", err);
    return {};
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeRegNo(regNo) {
  return String(regNo || "").trim().toUpperCase();
}

function getActiveSessionRegNo() {
  return normalizeRegNo(sessionStorage.getItem(SESSION_STORAGE_KEY) || "");
}

function setActiveSessionRegNo(regNo) {
  const normalized = normalizeRegNo(regNo);
  if (normalized) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, normalized);
  } else {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}