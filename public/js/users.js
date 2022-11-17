import dialogPolyfill from "/dist/dialog-polyfill.esm.js";

const deleteButtons = document.querySelectorAll(".delete");
const deleteToken = document.querySelector("#delete-token");
const deleteDialog = document.querySelector("#valid-delete");
const delDiagValidButton = document.querySelector("#valid-delete");
const cancelDelDiagButton = document.querySelector("#cancel-delete");

for (let i = 0; i < deleteButtons.length; i++) {
  let prev = deleteButtons[i].previousElementSibling;
  let ref = prev.getAttribute("href");
  let id = ref.substring(ref.indexOf("=") + 1);
  deleteButtons[i].addEventListener("click", function () {
    openValidDeleteDialog(id);
  });
}

dialogPolyfill.registerDialog(deleteDialog);
deleteDialog.addEventListener("cancel", (ev) => {
  ev.preventDefault();
});

cancelDelDiagButton.addEventListener("click", (ev) => {
  deleteDialog.close();
});

delDiagValidButton.addEventListener("click", (ev) => {
  deleteDialog.close();
});


function openValidDeleteDialog(id) {
  deleteToken.value = id;
  if (typeof HTMLDialogElement === "function") {
    // console.log("navigateur compatible avec dialog");
    deleteDialog.showModal();
  } else {
    // console.log("navigateur incompatible avec dialog");
    deleteDialog.show();
  }
}
