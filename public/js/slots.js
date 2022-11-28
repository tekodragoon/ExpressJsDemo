import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const slotDialog = document.querySelector("#slot-dialog");
const cancelSlot = document.querySelector("#cancel-slot");
const addSlotButtons = document.querySelectorAll(".slot-add-btn");
const createSlotDate = document.querySelector("#create-slot-date");
const clockInputs = document.querySelectorAll(".input-clock");

const titleErrFld = document.querySelector("#title-err-fld");
const timeErrFld = document.querySelector("#time-err-fld");
const durationErrFld = document.querySelector("#duration-err-fld");
const seatsErrFld = document.querySelector("#people-err-fld");
const formErrFld = document.querySelector("#form-err-fld");

const title = document.querySelector("#title");
const startHour = document.querySelector("#startHour");
const startMin = document.querySelector("#startMin");
const duration = document.querySelector("#duration");
const seats = document.querySelector("#peopleLimit");
const slotForm = document.querySelector("#slot-form");

// REGISTER

dialogPolyfill.registerDialog(slotDialog);
slotDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

// EVENTS

slotForm.addEventListener("submit", (ev) => {
  if (!isFormValid()) {
    console.log("form not valid");
    ev.preventDefault();
    showFormError();
  }
})

cancelSlot.addEventListener("click", () => {
  createSlotDate.removeAttribute("value");
  slotDialog.close();
})

for(let i = 0; i < addSlotButtons.length; i++) {
  let dateInfo = addSlotButtons[i].nextElementSibling;
  let date = dateInfo.textContent;
  addSlotButtons[i].addEventListener("click", () => {
    openAddSlotDialog(date);
  })
}

for(let i = 0; i < clockInputs.length; i++) {
  clockInputs[i].addEventListener("change", () => {
    if (clockInputs[i].value.length == 1) {
      clockInputs[i].value = "0" + clockInputs[i].value;
    }
    checkMaxTime();
  })
  
}

title.addEventListener("input", (ev) => {
  if (title.validity.valid) {
    titleErrFld.textContent = "";
    titleErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(title, titleErrFld);
  }
})

duration.addEventListener("input", (ev) => {
  if (duration.validity.valid) {
    durationErrFld.textContent = "";
    durationErrFld.className = "error-field";
    checkErrors();
  } else {
    showTimeError(durationErrFld, "1h", "4h");
  }
})

seats.addEventListener("input", (ev) => {
  if (seats.validity.valid) {
    seatsErrFld.textContent = "";
    seatsErrFld.className = "error-field";
    checkErrors();
  } else {
    showTimeError(seatsErrFld, "1", "30 seats");
  }
})

startHour.addEventListener("input", timeCb);
startMin.addEventListener("input", timeCb);

// FUNCTIONS

function timeCb() {
  if (startHour.validity.valid && startMin.validity.valid) {
    timeErrFld.textContent = "";
    timeErrFld.className = "error-field";
    checkErrors();
  } else {
    showTimeError(timeErrFld, "9am", "6pm");
  }
}

function checkMaxTime() {
  if (startHour.value == "18") {
    startMin.value = "00";
  }
}

function openAddSlotDialog(date) {
  createSlotDate.value = date;
  if (typeof HTMLDialogElement === "function") {
    // console.log("navigateur compatible avec dialog");
    slotDialog.showModal();
  } else {
    // console.log("navigateur incompatible avec dialog");
    slotDialog.show();
  }
}

function showError(field, errorField) {
  if (field.validity.valueMissing) {
    errorField.textContent = `Please enter a ${field.name.toLowerCase()}`;
  }
  if (field.validity.tooShort) {
    errorField.textContent = `You need ${field.minLength} characters minimun`;
  }
  errorField.className = "error-field active";
}

function showTimeError(errorField, from, to) {
  errorField.textContent = `Invalid value. Must be from ${from} to ${to}`;
  errorField.className = "error-field active";
}

function isFormValid() {
  if (!title.validity.valid) return false;
  if (!startHour.validity.valid) return false;
  if (!startMin.validity.valid) return false;
  if (!duration.validity.valid) return false;
  if (!seats.validity.valid) return false;
  return true;
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