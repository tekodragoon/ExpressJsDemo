import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const manageBtn = document.querySelector("#manage-sub");
const cancelSub = document.querySelector("#cancel-sub");
const subDialog = document.querySelector("#subscribe-dialog");
const subForm = document.querySelector("#sub-form");

const startDate = document.querySelector("#start-date");
const duration = document.querySelector("#duration");
const paymentMethod = document.querySelector("#payment-method");
const amountPaid = document.querySelector("#amount-paid");

const startErrFld = document.querySelector("#strdt-err-fld");
const durationErrFld = document.querySelector("#duration-err-fld");
const methodErrFld = document.querySelector("#method-err-fld");
const formErrFld = document.querySelector("#form-err-fld");

let startDateValue;

// REGISTER

dialogPolyfill.registerDialog(subDialog);
subDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

// EVENTS

manageBtn.addEventListener("click", () => {
  if (manageBtn.classList.contains("sub")) {
    openDialog(subDialog);
  }
})

cancelSub.addEventListener("click", () => {
  hideFormError();
  subForm.reset();
  subDialog.close();
})

subForm.addEventListener("submit", (ev) => {
  if (!isFormValid()) {
    ev.preventDefault();
    showFormError();
  }
});

startDate.addEventListener("input", (ev) => {
  if (startDate.validity.valid) {
    startErrFld.textContent = "";
    startErrFld.className = "error-field";
    checkErrors();
  } else {
    startErrFld.textContent = "Please enter a valid date.";
    startErrFld.className = "error-field active";
  }
});

startDate.addEventListener("blur", () => {
  let sd = new Date(startDate.value);
  if (isCorrectDate(sd)) {
    startDateValue = sd;
    checkSubscriptionDuration();
    return;
  }
  startDateValue = null;
})

duration.addEventListener("input", (ev) => {
  if (duration.validity.valid) {
    durationErrFld.textContent = "";
    durationErrFld.className = "error-field";
    checkSubscriptionDuration();
    checkErrors();
  } else {
    durationErrFld.textContent = "Please select a duration.";
    durationErrFld.className = "error-field active";
  }
});

paymentMethod.addEventListener("input", (ev) => {
  if (paymentMethod.validity.valid) {
    methodErrFld.textContent = "";
    methodErrFld.className = "error-field";
    checkErrors();
  } else {
    methodErrFld.textContent = "Please select a payment method.";
    methodErrFld.className = "error-field active";
  }
});

// FUNCTIONS

function openDialog(dialog) {
  if (typeof HTMLDialogElement === "function") {
    // console.log("navigateur compatible avec dialog");
    dialog.showModal();
  } else {
    // console.log("navigateur incompatible avec dialog");
    dialog.show();
  }
}

function isFormValid() {
  if (!startDate.validity.valid) return false;
  if (!duration.validity.valid) return false;
  if (!paymentMethod.validity.valid) return false;
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

function isCorrectDate(date) {
  if ( Object.prototype.toString.call(date) === "[object Date]") {
    if ( !isNaN(date.getTime()) ) {
      return true;
    } else {
      return false;
    }
 }
 return false;
}

function checkSubscriptionDuration() {
  if (startDateValue != null && duration.value > 0) {
    switch (duration.value) {
      case "7":
        amountPaid.value = "10€";
        break;
      case "14":
        amountPaid.value = "20€";
        break;
      case "30":
        amountPaid.value = "35€";
        break;
      case "60":
        amountPaid.value = "65€";
        break;
      case "90":
        amountPaid.value = "95€";
        break;
      case "180":
        amountPaid.value = "160€";
        break;
      case "365":
        amountPaid.value = "300€";
        break;
    }
  }
}