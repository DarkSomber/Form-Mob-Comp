const registerBut = document.querySelector('.open-form');
const popup = document.getElementById('register-popup');
const packageBackground = document.querySelector('.package-container')
const closeBtn = document.getElementById('popup-close');
const allPopups = document.querySelectorAll('.popup');


function openPopup() {
    popup.classList.add('active');
    registerBut.classList.add('active')
    packageBackground.style.opacity = 0.7;
    registerBut.style.opacity = 0;
}

function closePopup() {
    popup.classList.remove('active');
    registerBut.classList.remove('active');
    packageBackground.style.opacity = 1;
    registerBut.style.opacity = 1;
}

registerBut.addEventListener('click', openPopup);
closeBtn.addEventListener('click', closePopup);
 
window.addEventListener('click', ({ target }) => {
    if (target.closest('.popup') || target.closest('.open-form')) return;
    allPopups.forEach(p => p.classList.remove('active'));
    packageBackground.style.opacity = 1;
    registerBut.style.opacity = 1;
});
 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
});
 
/* ---------- Registration form validation ---------- */
const form = document.getElementById('register-form');
const formStatus = document.getElementById('form-status');
 
const countryList = [
    'Philippines', 'United States', 'Canada', 'United Kingdom', 'Australia',
    'Singapore', 'Japan', 'South Korea', 'India', 'Germany', 'France',
    'Spain', 'Italy', 'Brazil', 'Mexico', 'New Zealand', 'United Arab Emirates',
    'Other'
];
 
(function populateCountries() {
    const select = document.getElementById('country');
    countryList.forEach((name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
})();
 
const NAME_RE = /^[A-Za-z' -]{2,40}$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOB_RE = /^(\d{2})\/(\d{2})\/(\d{2})$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
 
function isRealDate(day, month, year) {
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
 
function validateDob(value) {
    const match = value.match(DOB_RE);
    if (!match) return 'Use the format DD/MM/YY';
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const twoDigitYear = parseInt(match[3], 10);
    const currentTwoDigitYear = new Date().getFullYear() % 100;
    const century = twoDigitYear > currentTwoDigitYear + 5 ? 1900 : 2000;
    const year = century + twoDigitYear;
 
    if (month < 1 || month > 12) return 'Month must be between 01 and 12';
    if (day < 1 || day > 31) return 'Day must be between 01 and 31';
    if (!isRealDate(day, month, year)) return 'That date does not exist';
 
    const dob = new Date(year, month - 1, day);
    const today = new Date();
    if (dob > today) return 'Date of birth cannot be in the future';
 
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 13) return 'You must be at least 13 years old';
 
    return '';
}
 
const validators = {
    firstName: (v) => {
        if (!v.trim()) return 'First name is required';
        if (!NAME_RE.test(v.trim())) return 'Letters only, 2-40 characters';
        return '';
    },
    lastName: (v) => {
        if (!v.trim()) return 'Last name is required';
        if (!NAME_RE.test(v.trim())) return 'Letters only, 2-40 characters';
        return '';
    },
    username: (v) => {
        if (!v.trim()) return 'Username is required';
        if (!USERNAME_RE.test(v.trim())) return '3-20 characters: letters, numbers, underscore';
        return '';
    },
    phone: (v) => {
        if (!v.trim()) return 'Phone number is required';
        if (!PHONE_RE.test(v.trim().replace(/[\s-]/g, ''))) return 'Enter a valid phone number';
        return '';
    },
    email: (v) => {
        if (!v.trim()) return 'Email address is required';
        if (!EMAIL_RE.test(v.trim())) return 'Enter a valid email address';
        return '';
    },
    gender: (v) => (!v ? 'Please select a gender' : ''),
    dob: (v) => {
        if (!v.trim()) return 'Date of birth is required';
        return validateDob(v.trim());
    },
    country: (v) => (!v ? 'Please select a country' : ''),
    company: () => '',
    homeAddress: (v) => (!v.trim() ? 'Home address is required' : ''),
    officeAddress: () => '',
    password: (v) => {
        if (!v) return 'Password is required';
        if (!PASSWORD_RE.test(v)) return 'Min 8 characters, with at least one letter and one number';
        return '';
    },
    confirmPassword: (v) => {
        const password = document.getElementById('password').value;
        if (!v) return 'Please confirm your password';
        if (v !== password) return 'Passwords do not match';
        return '';
    },
};
 
function fieldGroup(field) {
    return field.closest('.form-group');
}
 
function showError(field, message) {
    const group = fieldGroup(field);
    if (group) {
        group.classList.toggle('invalid', Boolean(message));
        const errEl = group.querySelector('.error-message');
        if (errEl) errEl.textContent = message;
    }
    return !message;
}
 
function validateField(name) {
    const field = form.elements[name];
    if (!field || !validators[name]) return true;
    const message = validators[name](field.value);
    return showError(field, message);
}
 
Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener('blur', () => validateField(name));
    field.addEventListener('input', () => {
        const group = fieldGroup(field);
        if (group && group.classList.contains('invalid')) validateField(name);
    });
});
 
document.getElementById('password').addEventListener('input', () => {
    if (form.elements.confirmPassword.value) validateField('confirmPassword');
});
 
function validateTerms() {
    const terms = document.getElementById('terms');
    const errEl = document.getElementById('terms-error');
    const valid = terms.checked;
    errEl.textContent = valid ? '' : 'You must accept the terms & conditions to continue';
    return valid;
}
 
document.getElementById('terms').addEventListener('change', validateTerms);
 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';
 
    const fieldsValid = Object.keys(validators)
        .map(validateField)
        .every(Boolean);
    const termsValid = validateTerms();
 
    if (!fieldsValid || !termsValid) {
        formStatus.textContent = 'Please fix the highlighted fields before continuing.';
        formStatus.classList.add('error');
        const firstInvalid = form.querySelector('.invalid input, .invalid select, .invalid textarea')
            || (!termsValid ? document.getElementById('terms') : null);
        if (firstInvalid) firstInvalid.focus();
        return;
    }
 
    formStatus.textContent = 'Registration successful! You can now log in.';
    formStatus.classList.add('success');
    form.reset();
    form.querySelectorAll('.form-group.invalid').forEach((g) => g.classList.remove('invalid'));
});