import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const slotDialog = document.querySelector("#slot-dialog");
const cancelSlot = document.querySelector("#cancel-slot");
const validSlot = document.querySelector("#valid-slot");
const addSlotButtons = document.querySelectorAll(".slot-add-btn");
const createSlotDate = document.querySelector("#create-slot-date");

// REGISTER

dialogPolyfill.registerDialog(slotDialog);
slotDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

// EVENTS

cancelSlot.addEventListener("click", () => {
  createSlotDate.removeAttribute("value");
  slotDialog.close();
})

validSlot.addEventListener("click", () => {
  slotDialog.close();
})

for(let i = 0; i < addSlotButtons.length; i++) {
  let dateInfo = addSlotButtons[i].nextElementSibling;
  let date = dateInfo.textContent;
  addSlotButtons[i].addEventListener("click", () => {
    openAddSlotDialog(date);
  })
}

// FUNCTIONS

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