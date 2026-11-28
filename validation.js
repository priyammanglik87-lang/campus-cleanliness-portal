function checkPasswordStrength(password) {
    const val = String(password || "");
    return {
        hasUpper: /[A-Z]/.test(val),
        hasLower: /[a-z]/.test(val),
        hasSpecial: /[^A-Za-z0-9]/.test(val),
        hasMinLength: val.length >= 6
    };
}

function validateCredentialSetup({ fullName, regNo, password, confirmPassword }, existingUsers) {
    const errors = {};
    const cleanReg = normalizeRegNo(regNo);

    if (!fullName || fullName.trim().length < 3) {
        errors.regFullName = "Full name is mandatory (at least 3 characters).";
    }

    if (!cleanReg || cleanReg.length < 4) {
        errors.regNumber = "Registration number is mandatory (at least 4 characters).";
    } else if (existingUsers && Object.prototype.hasOwnProperty.call(existingUsers, cleanReg)) {
        errors.regNumber = "This registration number already has a password set. Please use Login.";
    }

    const strength = checkPasswordStrength(password);
    if (!password) {
        errors.regPassword = "Password is mandatory.";
    } else if (!strength.hasMinLength || !strength.hasUpper || !strength.hasLower || !strength.hasSpecial) {
        errors.regPassword = "Password must have 6+ chars, 1 uppercase, 1 lowercase, and 1 special character.";
    }

    if (!confirmPassword) {
        errors.regConfirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
        errors.regConfirmPassword = "Passwords do not match.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        cleanReg,
        cleanFullName: String(fullName || "").trim()
    };
}

function validateLoginInput({ fullName, regNo, password }) {
    const errors = {};
    const cleanReg = normalizeRegNo(regNo);
    const cleanName = String(fullName || "").trim();

    if (!cleanName || cleanName.length < 3) {
        errors.loginFullName = "Full name is mandatory (at least 3 characters).";
    }

    if (!cleanReg) {
        errors.loginRegNo = "Registration number is mandatory.";
    }

    if (!password) {
        errors.loginPassword = "Password is mandatory.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        cleanReg,
        cleanName
    };
}

function renderFieldErrors(errors) {
    Object.keys(errors).forEach((field) => {
        const inputEl = document.getElementById(field);
        const errEl = document.getElementById(`err-${field}`);
        if (inputEl) inputEl.classList.add("invalid");
        if (errEl) errEl.textContent = errors[field];
    });
}

function clearFieldErrors(fieldIds) {
    fieldIds.forEach((field) => {
        const inputEl = document.getElementById(field);
        const errEl = document.getElementById(`err-${field}`);
        if (inputEl) inputEl.classList.remove("invalid");
        if (errEl) errEl.textContent = "";
    });
}

function validateFeedbackForm(data) {
    const errors = {};

    if (!data.title || data.title.trim().length < 5) {
        errors.title = "Issue title must be at least 5 characters.";
    }

    if (!data.category) {
        errors.category = "Please select a valid category.";
    }

    if (!data.location) {
        errors.location = "Please select a campus location.";
    }

    if (!data.roomDetail || data.roomDetail.trim().length < 2) {
        errors.roomDetail = "Enter room number, floor, or area detail.";
    }

    if (!["Reported", "In Progress", "Resolved"].includes(data.status)) {
        errors.status = "Select a valid progress status.";
    }

    if (!data.reportedBy || data.reportedBy.trim().length < 3) {
        errors.reportedBy = "Enter reporter name or registration number.";
    }

    if (!data.description || data.description.trim().length < 10) {
        errors.description = "Description must be at least 10 characters long.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function renderValidationErrors(errors) {
    const fields = ["title", "category", "location", "roomDetail", "status", "reportedBy", "description"];
    clearFieldErrors(fields);
    renderFieldErrors(errors);
}