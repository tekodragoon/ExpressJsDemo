import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const deleteButtons = document.querySelectorAll(".delete");
const roleSwitchers = document.querySelectorAll("#role-switch");

const deleteToken = document.querySelector("#delete-token");
const switchToken = document.querySelector("#switch-token");

const deleteDialog = document.querySelector("#valid-delete-dialog");
const createDialog = document.querySelector("#create-user-dialog");
const roleDialog = document.querySelector("#role-switch-dialog");

const deleteValidButton = document.querySelector("#valid-delete");
const deleteCancelButton = document.querySelector("#cancel-delete");

const createValidButton = document.querySelector("#valid-create");
const createCancelButton = document.querySelector("#cancel-create");

const switchCancelButton = document.querySelector("#cancel-switch");

const role_manager = document.querySelector("#role-manager");
const role_coach = document.querySelector("#role-coach");
const role_customer = document.querySelector("#role-customer");

const roleSelector = document.querySelector("#role");
const openCreateDialog = document.querySelector("#new-user");
const createUserForm = document.querySelector("#form-create-user");

for (let i = 0; i < deleteButtons.length; i++) {
  let prev = deleteButtons[i].previousElementSibling;
  let child = prev.firstElementChild;
  let ref = child.getAttribute("href");
  let id = ref.substring(ref.indexOf("=") + 1);
  deleteButtons[i].addEventListener("click", function () {
    openValidDeleteDialog(id);
  });
}

for (let i = 0; i < roleSwitchers.length; i++) {
  let prev = roleSwitchers[i].previousElementSibling;
  let role = prev.parentElement.innerText;
  let id = prev.innerText;
  roleSwitchers[i].addEventListener("click", () => {
    openRoleSwitchDialog(id, role);
  });
}

dialogPolyfill.registerDialog(deleteDialog);
dialogPolyfill.registerDialog(createDialog);
dialogPolyfill.registerDialog(roleDialog);
deleteDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});
createDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});
roleDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

deleteCancelButton.addEventListener("click", (ev) => {
  deleteToken.value = "";
  deleteDialog.close();
});
deleteValidButton.addEventListener("click", (ev) => {
  deleteDialog.close();
});

createCancelButton.addEventListener("click", (ev) => {
  createDialog.close();
});
switchCancelButton.addEventListener("click", (ev) => {
  roleDialog.close();
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

function openRoleSwitchDialog(id, role) {
  switchToken.value = id;
  switch (role) {
    case "manager":
      role_manager.setAttribute("selected", true);
      break;
    case "coach":
        role_coach.setAttribute("selected", true);
        break;
    case "customer":
      role_customer.setAttribute("selected", true);
      break;
  }
  openDialog(roleDialog);
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
