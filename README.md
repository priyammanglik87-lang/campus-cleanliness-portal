# Campus Cleanliness Feedback Portal

A responsive, web-based campus hygiene reporting, categorization, and status tracking portal built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** for our project-based assessment.

## Team Details
* **Team Name:** Punjab Kings
* **Team Members:**
  * **Sidhant Bhardwaj** (`12602251`)
  * **Vinayak Mahajan** (`12606595`)
  * **Priyam Manglik** (`12616721`)

---

## Key Features
1. **Mandatory Login & First-Time Credential Setup:**
   * Users must set up or enter a valid **Registration Number** and **Password** before accessing the portal.
   * Password rules enforce: minimum **6 characters**, at least **1 uppercase letter (`A-Z`)**, **1 lowercase letter (`a-z`)**, and **1 special character**.
   * Once a registration number sets its password, it is bound to that registration number and cannot be re-registered again.
2. **RMS-Style Role Separation:**
   * **Reporter View:** Submit new cleanliness complaints (assigned a unique Ticket ID with `Reported` status) and view/track records. Submitted complaints are locked for reporters.
   * **Admin / Staff View:** Update complaint progress (`Reported` -> `In Progress` -> `Resolved`), edit records, or remove invalid entries.
3. **Dashboard & Location-Wise Summary:**
   * Real-time KPI cards (`Total Complaints`, `Reported`, `In Progress`, `Resolved`) and location-wise breakdowns across campus areas (`Academic Block A`, `Academic Block B`, `Central Library`, `Main Canteen`, `Sports & Courtyard`).
4. **Search, Multi-Filter & Input Validation:**
   * Instant search by ticket ID, title, room/floor, reporter name, or description, combined with category (`Classroom`, `Washroom`, `Common Area`), location, and status filters.
   * Form validation with clear field-level error messages and success/error alert banners.
5. **Topic URL Slug & Cross-Browser Link Sync:**
   * Maintains the `#/campus-cleanliness-feedback-portal` route slug and provides a **Copy Cross-Browser Link** option to carry registered credentials and report data across browsers during testing or evaluation.

---

## Project Structure
```text
campus-cleanliness-feedback-portal/
├── index.html      # Auth gate, dashboard, complaint form, filters, and report feed
├── styles.css      # Responsive layout, role switcher, status badges, and mobile styles
├── storage.js      # Default campus records, localStorage/sessionStorage, and URL sync helpers
├── validation.js   # Password strength checker, credential validation, and form validation
├── app.js          # Authentication flow, role controls, dashboard stats, search/filter, and CRUD
└── README.md       # Project documentation
