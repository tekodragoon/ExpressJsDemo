import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const week = document.querySelector("#week");
const nextButton = document.querySelector("#next");
const prevButton = document.querySelector("#prev");

const slotDialog = document.querySelector("#slot-dialog");
const cancelSlot = document.querySelector("#cancel-slot");
const validSlot = document.querySelector("#valid-slot");
const addSlotButtons = document.querySelectorAll(".slot-add-btn");


let currentDate = new Date();

initPage();

// REGISTER

dialogPolyfill.registerDialog(slotDialog);
slotDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

// EVENTS

nextButton.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 7);
  setWeekText();
})

prevButton.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 7);
  setWeekText();
})

cancelSlot.addEventListener("click", () => {
  slotDialog.close();
})

validSlot.addEventListener("click", () => {
  slotDialog.close();
})

for(let i = 0; i < addSlotButtons.length; i++) {
  addSlotButtons[i].addEventListener("click", () => {
    openAddSlotDialog();
  })
}

// FUNCTIONS

function initPage() {
  currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
  // setWeekText();
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
  ].join('/');
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function setWeekText() {
  let friday = new Date();
  friday.setDate(currentDate.getDate() + 4);
  week.textContent = `From ${formatDate(currentDate)} to ${formatDate(friday)}`;
  setSlotDate();
}

function setSlotDate() {
  for(let i = 0; i < 5; i++) {
    let slot = document.querySelector(`#slot-date-${i}`);
    let date = new Date();
    date.setDate(currentDate.getDate() + i);
    slot.textContent = formatDate(date);
  }
}

function openAddSlotDialog() {
  if (typeof HTMLDialogElement === "function") {
    // console.log("navigateur compatible avec dialog");
    slotDialog.showModal();
  } else {
    // console.log("navigateur incompatible avec dialog");
    slotDialog.show();
  }
}