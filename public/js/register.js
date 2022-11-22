const lastNameErrFld = document.querySelector("#lastName-err-fld");
const firstNameErrFld = document.querySelector("#firstName-err-fld");
const loginErrFld = document.querySelector("#login-err-fld");
const passwordErrFld = document.querySelector("#password-err-fld");
const formErrFld = document.querySelector("#form-err-fld");

const lastName = document.querySelector("#lastName");
const firstName = document.querySelector("#firstName");
const login = document.querySelector("#login");
const password = document.querySelector("#password");

const form = document.querySelector("#register-form");

form.addEventListener("submit", (ev) => {
  if (!isFormValid()) {
      ev.preventDefault();
      showFormError();
    }
})

lastName.addEventListener("input", (ev) => {
  if (lastName.validity.valid) {
    lastNameErrFld.textContent = "";
    lastNameErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(lastName, lastNameErrFld);
  }
})

firstName.addEventListener("input", (ev) => {
  if (firstName.validity.valid) {
    firstNameErrFld.textContent = "";
    firstNameErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(firstName, firstNameErrFld);
  }
})

login.addEventListener("input", (ev) => {
  if (login.validity.valid) {
    loginErrFld.textContent = "";
    loginErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(login, loginErrFld);
  }
})

password.addEventListener("input", (ev) => {
  if (password.validity.valid) {
    passwordErrFld.textContent = "";
    passwordErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(password, passwordErrFld);
  }
})


function isFormValid() {
  if (!lastName.validity.valid) return false;
  if (!firstName.validity.valid) return false;
  if (!login.validity.valid) return false;
  if (!password.validity.valid) return false;
  
  return true;
}

function showError(field, errorField) {
  if (field.validity.valueMissing) {
    errorField.textContent = `Please enter your ${field.name.toLowerCase()}`;
  }
  if (field.validity.tooShort) {
    errorField.textContent = `You need ${field.minLength} characters minimun`;
  }
  errorField.className = "error-field active";
}

function showFormError() {
  formErrFld.textContent = "There are still errors on this form";
  formErrFld.className = "error-field active";
}

function hideFormError() {
  formErrFld.textContent = "";
  formErrFld.className = "error-field";
}

function checkErrors() {
  if (isFormValid()) {
    hideFormError();
  }
}