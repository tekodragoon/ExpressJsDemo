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

const editButtons = document.querySelectorAll(".edit-slot");
const updateSlotId = document.querySelector("#update-slot-id");

const deleteSlotButton = document.querySelector("#delete-slot");
const deleteSlotDialog = document.querySelector("#valid-delete-slot");
const deleteToken = document.querySelector("#slot-delete-token");
const cancelDelBtn = document.querySelector("#cancel-delete");

const bookButtons = document.querySelectorAll(".book-slot");
const unbookButtons = document.querySelectorAll(".unbook-slot");
const bookDialog = document.querySelector("#book-slot-dialog");
const bookToken = document.querySelector("#book-token");
const cancelBook = document.querySelector("#cancel-book");
const bookForm = document.querySelector("#book-form");
const bookMessage = document.querySelector("#book-message");

// REGISTER

dialogPolyfill.registerDialog(slotDialog);
dialogPolyfill.registerDialog(deleteSlotDialog);
dialogPolyfill.registerDialog(bookDialog);
slotDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});
deleteSlotDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
})
bookDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
})

// EVENTS

slotForm.addEventListener("submit", (ev) => {
  if (!isFormValid()) {
    ev.preventDefault();
    showFormError();
  }
});

cancelSlot.addEventListener("click", () => {
  createSlotDate.removeAttribute("value");
  slotForm.removeAttribute("action");
  slotForm.reset();
  hideFormError();
  let errors = document.querySelectorAll(".active");
  errors.forEach((error) => {
    error.className = "error-field";
    error.textContent = "";
  });
  slotDialog.close();
});

cancelDelBtn.addEventListener("click", () => {
  deleteSlotDialog.close();
})

deleteSlotButton.addEventListener("click", () => {
  openDialog(deleteSlotDialog);
})

cancelBook.addEventListener("click", () => {
  bookDialog.close();
})

for (let i = 0; i < addSlotButtons.length; i++) {
  let dateInfo = addSlotButtons[i].nextElementSibling;
  let date = dateInfo.textContent;
  addSlotButtons[i].addEventListener("click", () => {
    slotForm.action = "/slotCreate";
    deleteSlotButton.classList.add("hidden");
    openAddSlotDialog(date);
  });
}

for (let i = 0; i < clockInputs.length; i++) {
  clockInputs[i].addEventListener("change", () => {
    if (clockInputs[i].value.length == 1) {
      clockInputs[i].value = "0" + clockInputs[i].value;
    }
    checkMaxTime();
  });
}

for (let i = 0; i < editButtons.length; i++) {
  editButtons[i].addEventListener("click", () => {
    title.value = editButtons[i].previousElementSibling.textContent;
    let infos = editButtons[i].nextElementSibling.textContent.split("&");
    console.log(infos);
    startMin.value = infos[0].slice(-2);
    let startH = infos[0].slice(0, 2);
    let endHour = infos[1].slice(0, 2);
    duration.value = parseInt(endHour) - parseInt(startH);
    startHour.value = startH;
    seats.value = infos[2];
    updateSlotId.value = infos[3];
    deleteToken.value = infos[3];
    let date = new Date(infos[4]);
    let dt = formatDate(date);
    slotForm.action = "/slotUpdate";
    deleteSlotButton.classList.remove("hidden");
    openAddSlotDialog(dt);
  });
}

for (let i = 0; i < bookButtons.length; i++) {
  bookButtons[i].addEventListener("click", () => {
    let token = bookButtons[i].nextElementSibling.textContent;
    openValidBooking(token, true);
  })
}

for(let i = 0; i < unbookButtons.length; i++) {
  unbookButtons[i].addEventListener("click", () => {
    let token = unbookButtons[i].nextElementSibling.textContent;
    openValidBooking(token, false);
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
});

duration.addEventListener("input", (ev) => {
  if (duration.validity.valid) {
    durationErrFld.textContent = "";
    durationErrFld.className = "error-field";
    checkErrors();
  } else {
    showTimeError(durationErrFld, "1h", "4h");
  }
});

seats.addEventListener("input", (ev) => {
  if (seats.validity.valid) {
    seatsErrFld.textContent = "";
    seatsErrFld.className = "error-field";
    checkErrors();
  } else {
    showTimeError(seatsErrFld, "1", "30 seats");
  }
});

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
  openDialog(slotDialog);
}

function openValidBooking(token, book) {
  bookToken.value = token;
  if (book) {
    bookForm.action = "/slotBook";
    bookMessage.textContent = "Book this training?";
  } else {
    bookForm.action = "/slotUnbook";
    bookMessage.textContent = "Unbook this training?";
  }
  openDialog(bookDialog);
}

function openDialog(dialog) {
  if (typeof HTMLDialogElement === "function") {
    // console.log("navigateur compatible avec dialog");
    dialog.showModal();
  } else {
    // console.log("navigateur incompatible avec dialog");
    dialog.show();
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

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  console.log(date);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

