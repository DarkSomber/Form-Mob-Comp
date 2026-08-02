const registerBut = document.querySelector('.open-form');
const popup = document.getElementById('register-popup');
const packageBackground = document.querySelector('.package-container')
const closeBtn = document.getElementById('popup-close');
const allPopups = document.querySelectorAll('.popup');
const textHook = document.querySelector('.package-hook')
const termsPopup = document.getElementById('terms-popup');
const termsCloseBtn = document.getElementById('terms-close');
const termsScrollArea = document.getElementById('terms-scroll-area');
const acceptTermsBtn = document.getElementById('accept-terms-btn');
const termsCheckbox = document.getElementById('terms');
const termsTextSpan = document.querySelector('input#terms + span');
const notAcceptTermsBtn = document.getElementById('not-accept-terms-btn');

function openPopup() {
    popup.classList.add('active');
    registerBut.classList.add('active');
    textHook.classList.add('active');
    packageBackground.style.opacity = 0.7;
    registerBut.style.opacity = 0;
    textHook.style.opacity = 0;

    const submitBtn = form.querySelector('.register-submit');
    if (submitBtn) submitBtn.style.display = 'block';
    formStatus.textContent = '';
    formStatus.className = 'form-status';
}

function closePopup() {
    popup.classList.remove('active');
    registerBut.classList.remove('active');
    textHook.classList.add('active')
    packageBackground.style.opacity = 1;
    registerBut.style.opacity = 1;
    textHook.style.opacity = 1;
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
 
/* Registration form validation*/
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

(function populateDob() {
    const daySelect = document.getElementById('dobDay');
    const monthSelect = document.getElementById('dobMonth');
    const yearSelect = document.getElementById('dobYear');

    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = String(d).padStart(2, '0');
        opt.textContent = d;
        daySelect.appendChild(opt);
    }

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
        'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
    ];
    months.forEach((name, i) => {
        const opt = document.createElement('option');
        opt.value = String(i + 1).padStart(2, '0');
        opt.textContent = name;
        monthSelect.appendChild(opt);
    });

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 100; y--) {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
})();
 
const NAME_RE = /^[A-Za-z' -]{2,40}$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
 
function isRealDate(day, month, year) {
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
 
function validateDobFields() {
    const day = document.getElementById('dobDay').value;
    const month = document.getElementById('dobMonth').value;
    const year = document.getElementById('dobYear').value;
    const group = document.querySelector('.dob-group');
    const errEl = document.getElementById('dob-error');
 
    let message = '';
    if (!day || !month || !year) {
        message = 'Please select your full date of birth';
    } else {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);
        if (!isRealDate(d, m, y)) {
            message = 'That date does not exist';
        } else {
            const dob = new Date(y, m - 1, d);
            const today = new Date();
            if (dob > today) {
                message = 'Date of birth cannot be in the future';
            } else {
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
                if (age < 13) message = 'You must be at least 13 years old';
            }
        }
    }
 
    if (group) group.classList.toggle('invalid', Boolean(message));
    if (errEl) errEl.textContent = message;
    return !message;
}
 
['dobDay', 'dobMonth', 'dobYear'].forEach((id) => {
    const select = document.getElementById(id);
    select.addEventListener('blur', validateDobFields);
    select.addEventListener('change', () => {
        const group = document.querySelector('.dob-group');
        if (group && group.classList.contains('invalid')) validateDobFields();
    });
});
 
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
    country: (v) => (!v ? 'Please select a country' : ''),
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
    const dobValid = validateDobFields();
    const termsValid = validateTerms();
 
    if (!fieldsValid || !dobValid || !termsValid) {
        formStatus.textContent = 'Please fix the highlighted fields before continuing.';
        formStatus.classList.add('error');
        const firstInvalid = form.querySelector('.invalid input, .invalid select, .invalid textarea')
            || (!termsValid ? document.getElementById('terms') : null);
        if (firstInvalid) firstInvalid.focus();
        return;
    }
 
    // SUCCESS STATE
    formStatus.textContent = '🎉 Registration successful! You can now log in.';
    formStatus.classList.add('success');
    
    // Hide the register submit button completely
    const submitBtn = form.querySelector('.register-submit');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }

    form.reset();
    form.querySelectorAll('.form-group.invalid').forEach((g) => g.classList.remove('invalid'));
});




function checkScrollStatus() {
    // If the content doesn't overflow, there's nothing to scroll through,
    // so unlock the buttons immediately.
    const isScrollable = termsScrollArea.scrollHeight > termsScrollArea.clientHeight + 1;
    acceptTermsBtn.disabled = isScrollable;
    notAcceptTermsBtn.disabled = isScrollable;
}

termsScrollArea.addEventListener('scroll', () => {
    const reachedBottom =
        termsScrollArea.scrollTop + termsScrollArea.clientHeight >= termsScrollArea.scrollHeight - 2;
    if (reachedBottom) {
        acceptTermsBtn.disabled = false;
        notAcceptTermsBtn.disabled = false;
    }
});

function openTermsPopup(e) {
    e.preventDefault(); 
    termsPopup.classList.add('active');
    
    // Reset scroll position to the top whenever opened
    termsScrollArea.scrollTop = 0;
    
    // Check instantly if the text is short or screen is large enough that no scroll is needed
    checkScrollStatus();
}

termsCheckbox.addEventListener('click', openTermsPopup);
if (termsTextSpan) {
    termsTextSpan.addEventListener('click', openTermsPopup);
}

function closeTermsPopup() {
    termsPopup.classList.remove('active');
}

termsCloseBtn.addEventListener('click', closeTermsPopup);

acceptTermsBtn.addEventListener('click', () => {
    termsCheckbox.checked = true; 
    validateTerms(); 
    closeTermsPopup();
});

notAcceptTermsBtn.addEventListener('click', () => {
    termsCheckbox.checked = false; 
    validateTerms(); 
    closeTermsPopup(); 
});