import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const deleteButtons = document.querySelectorAll(".delete");
const deleteToken = document.querySelector("#delete-token");
const deleteDialog = document.querySelector("#valid-delete-dialog");
const createDialog = document.querySelector("#create-user-dialog");
const deleteValidButton = document.querySelector("#valid-delete");
const deleteCancelButton = document.querySelector("#cancel-delete");
const openCreateDialog = document.querySelector("#new-user");
const createValidButton = document.querySelector("#valid-create");
const createCancelButton = document.querySelector("#cancel-create");
const roleSelector = document.querySelector("#role");
const createUserForm = document.querySelector("#form-create-user");

for (let i = 0; i < deleteButtons.length; i++) {
  let prev = deleteButtons[i].previousElementSibling;
  let ref = prev.getAttribute("href");
  let id = ref.substring(ref.indexOf("=") + 1);
  deleteButtons[i].addEventListener("click", function () {
    openValidDeleteDialog(id);
  });
}

dialogPolyfill.registerDialog(deleteDialog);
dialogPolyfill.registerDialog(createDialog);
deleteDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});
createDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

deleteCancelButton.addEventListener("click", (ev) => {
  deleteToken.value = "";
  deleteDialog.close();
});
deleteValidButton.addEventListener("click", (ev) => {
  deleteDialog.close();
});

// createValidButton.addEventListener("click", (ev) => {
//   createDialog.close();
// });
createCancelButton.addEventListener("click", (ev) => {
  createDialog.close();
});


openCreateDialog.addEventListener("click", (ev) => {
  openCreateUserDialog();
});

roleSelector.addEventListener("change", () => {
  if (createValidButton.disabled) {
    createValidButton.removeAttribute("disabled");
  }
  switch (roleSelector.value) {
    case "manager":
      createUserForm.action = "/userCreate";
      break;
    case "coach":
      createUserForm.action = "/coachCreate";
      break;
    case "customer":
      createUserForm.action = "/customerCreate";
      break;
  }
})

function openValidDeleteDialog(id) {
  deleteToken.value = id;
  openDialog(deleteDialog);
}

function openCreateUserDialog() {
  openDialog(createDialog);
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
