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

const lastNameErrFld = document.querySelector("#lastName-err-fld");
const firstNameErrFld = document.querySelector("#firstName-err-fld");
const birthdateErrFld = document.querySelector("#birthdate-err-fld");
const roleSelectorErrFld = document.querySelector("#role-err-fld");
const loginErrFld = document.querySelector("#login-err-fld");
const passwordErrFld = document.querySelector("#password-err-fld");
const formErrFld = document.querySelector("#form-err-fld");

const lastName = document.querySelector("#lastName");
const firstName = document.querySelector("#firstName");
const birthdate = document.querySelector("#birthdate");
const login = document.querySelector("#login");
const password = document.querySelector("#password");

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
      createUserForm.action = "/user/create";
      break;
    case "coach":
      createUserForm.action = "/coachCreate";
      break;
    case "customer":
      createUserForm.action = "/customerCreate";
      break;
  }
  if (roleSelector.validity.valid) {
    roleSelectorErrFld.textContent = "";
    roleSelectorErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(roleSelector, roleSelectorErrFld);
  }
})

createUserForm.addEventListener("submit", (ev) => {
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

birthdate.addEventListener("focus", birthdateHandler, false);
birthdate.addEventListener("input", birthdateHandler, false);

function birthdateHandler(ev) {
  if (birthdate.validity.valid) {
    birthdateErrFld.textContent = "";
    birthdateErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(birthdate, birthdateErrFld);
  }
}

roleSelector.addEventListener("focus", (ev) => {
  if (roleSelector.validity.valid) {
    roleSelectorErrFld.textContent = "";
    roleSelectorErrFld.className = "error-field";
    checkErrors();
  } else {
    showError(roleSelector, roleSelectorErrFld);
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

// functions

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