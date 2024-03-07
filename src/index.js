import { usersRepository } from "./usersRepository.js";

if (localStorage.getItem("isAuthorithed") == "true") {
  document.querySelector("#logout-button").hidden = false;
  document.querySelector("#enter-button").hidden = true;
  document.querySelector("#registration-button").hidden = true;
} else {
  document.querySelector("#logout-button").hidden = true;
  document.querySelector("#enter-button").hidden = false;
  document.querySelector("#registration-button").hidden = false;
}

function exit() {
  localStorage.setItem("isAuthorithed", "false");
  document.querySelector("#logout-button").hidden = true;
  document.querySelector("#enter-button").hidden = false;
  document.querySelector("#registration-button").hidden = false;
}

document.querySelector("#logout-button").addEventListener("click", exit);

function renderUserList(users) {
  const userList = document.querySelector("#user-list");
  if (userList) {
    userList.innerHTML = "";

    const headerRow = document.createElement("tr");

    const selectHeader = document.createElement("th");
    selectHeader.textContent = "";
    headerRow.appendChild(selectHeader);

    const idHeader = document.createElement("th");
    idHeader.textContent = "ID";
    headerRow.appendChild(idHeader);

    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";
    headerRow.appendChild(nameHeader);

    const emailHeader = document.createElement("th");
    emailHeader.textContent = "Email";
    headerRow.appendChild(emailHeader);

    const registrationDateHeader = document.createElement("th");
    registrationDateHeader.textContent = "Registration Date";
    headerRow.appendChild(registrationDateHeader);

    userList.appendChild(headerRow);

    const toolbar = document.createElement("div");
    toolbar.classList.add("toolbar");

    const blockButton = document.createElement("button");
    blockButton.textContent = "Block";
    blockButton.classList.add("btn", "btn-primary", "mr-2");
    toolbar.appendChild(blockButton);

    const unblockButton = document.createElement("button");
    unblockButton.textContent = "Unblock";
    unblockButton.classList.add("btn", "btn-primary", "mr-2");
    toolbar.appendChild(unblockButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    toolbar.appendChild(deleteButton);

    userList.parentNode.insertBefore(toolbar, userList);

    users.forEach((user) => {
      const tr = document.createElement("tr");

      const selectCell = document.createElement("td");
      const selectCheckbox = document.createElement("input");
      selectCheckbox.type = "checkbox";
      selectCell.appendChild(selectCheckbox);
      tr.appendChild(selectCell);

      const idCell = document.createElement("td");
      idCell.textContent = user.id;
      tr.appendChild(idCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = user.name;
      tr.appendChild(nameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      tr.appendChild(emailCell);

      const registrationDateCell = document.createElement("td");
      registrationDateCell.textContent = user.registrationDate;
      tr.appendChild(registrationDateCell);

      userList.appendChild(tr);
    });
  } else {
    console.error("Element with id 'user-list' not found.");
  }
}

const showUsersButton = document.querySelector("#show-users-btn");
if (showUsersButton) {
  showUsersButton.addEventListener("click", async () => {
    try {
      // Получаем список пользователей и обновляем интерфейс
      const users = await usersRepository.getAll();
      renderUserList(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
} else {
  console.error("Element with id 'show-users-btn' not found.");
}

document.addEventListener("click", async (event) => {
  if (event.target.matches(".block-btn")) {
  } else if (event.target.matches(".unblock-btn")) {
  } else if (event.target.matches(".delete-btn")) {
  }
});

if (localStorage.getItem("isAuthorithed") == 1) {
  document.querySelector("#show-users-btn").removeAttribute("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  const blockButton = document.querySelector("#block-btn");
  blockButton.addEventListener("click", blockSelectedUsers);

  const unblockButton = document.querySelector("#unblock-btn");
  unblockButton.addEventListener("click", unblockSelectedUsers);

  const deleteButton = document.querySelector("#delete-btn");
  deleteButton.addEventListener("click", deleteSelectedUsers);
});

function blockSelectedUsers() {
  const selectedUsers = getSelectedUsers();
  if (selectedUsers.length > 0) {
    console.log("Block users:", selectedUsers);
  } else {
    console.log("No users selected for blocking.");
  }
}

function unblockSelectedUsers() {
  const selectedUsers = getSelectedUsers();
  if (selectedUsers.length > 0) {
    console.log("Unblock users:", selectedUsers);
  } else {
    console.log("No users selected for unblocking.");
  }
}

function deleteSelectedUsers() {
  const selectedUsers = getSelectedUsers();
  if (selectedUsers.length > 0) {
    console.log("Delete users:", selectedUsers);
  } else {
    console.log("No users selected for deletion.");
  }
}

function getSelectedUsers() {
  const checkboxes = document.querySelectorAll(
    "#user-list input[type='checkbox']"
  );
  const selectedUsers = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedUsers.push(index);
    }
  });
  return selectedUsers;
}

toolbar.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn")) {
    const btnType = event.target.textContent.toLowerCase();
    switch (btnType) {
      case "block":
        blockSelectedUsers();
        break;
      case "unblock":
        unblockSelectedUsers();
        break;
      case "delete":
        deleteSelectedUsers();
        break;
      default:
        console.log("Unknown action");
        break;
    }
  }
});
