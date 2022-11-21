const lastNameErrFld = document.querySelector("#lastName-err-fld");
const firstNameErrFld = document.querySelector("#firstName-err-fld");
const birthdateErrFld = document.querySelector("#birthdate-err-fld");
const disciplineErrFld = document.querySelector("#discipline-err-fld");
const bioErrFld = document.querySelector("#bio-err-fld");
const formErrFld = document.querySelector("#form-err-fld");

const lastName = document.querySelector("#lastName");
const firstName = document.querySelector("#firstName");
const birthdate = document.querySelector("#birthdate");
const discipline = document.querySelector("#discipline");
const bio = document.querySelector("#bio");

const form = document.querySelector("#user-form");

form.addEventListener("submit", (ev) => {
  if (!isFormValid()) {
      ev.preventDefault();
      showFormError();
    }
})

function isFormValid() {
  if (!lastName.validity.valid) return false;
  if (!firstName.validity.valid) return false;
  if (!birthdate.validity.valid) return false;
  if (discipline) {
    if (!discipline.validity.valid) return false;
  }
  if (bio) {
    if (!bio.validity.valid) return false;
  }
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

birthdate.addEventListener("input", (ev) => {
  if (birthdate.validity.valid) {
    birthdateErrFld.textContent = "";
    birthdateErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(birthdate, birthdateErrFld);
  }
})

if (discipline) {
  discipline.addEventListener("input", (ev) => {
    if (discipline.validity.valid) {
      disciplineErrFld.textContent = "";
      disciplineErrFld.className = "error-field";
      checkErrors();
    } else {
      showError(discipline, disciplineErrFld);
    }
  })
}

if (bio) {
  bio.addEventListener("input", (ev) => {
    if (bio.validity.valid) {
      bioErrFld.textContent = "";
      bioErrFld.className = "error-field";
      checkErrors();
    } else {
      showError(bio, bioErrFld);
    }
  })
}