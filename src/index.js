import { usersRepository } from "./usersRepository.js";
import { collectionRepository } from "./collectionRepository.js";
// import { app } from "./firebase";

if (localStorage.getItem("isAuthorithed") == "true") {
  document.querySelector("#logout-button").hidden = false;
  document.querySelector("#enter-button").hidden = true;
  document.querySelector("#registration-button").hidden = true;
  document.querySelector("#create-collection-btn").hidden = false;
  getUserName();
} else {
  document.querySelector("#logout-button").hidden = true;
  document.querySelector("#enter-button").hidden = false;
  document.querySelector("#registration-button").hidden = false;
  // document.querySelector("#create-collection-btn").hidden = false;
}

if (localStorage.getItem("isAdmin") === "true") {
  document.querySelector("#show-users-btn").hidden = false;
  document.querySelector("#create-collection-btn").hidden = false;
}

function getUserName() {
  let userName = localStorage.getItem("userName");
  document.querySelector("#userName").innerHTML = userName;
}

function exit() {
  // localStorage.setItem("isAuthorithed", "false");
  localStorage.clear();
  document.querySelector("#logout-button").hidden = true;
  document.querySelector("#enter-button").hidden = false;
  document.querySelector("#registration-button").hidden = false;
  document.querySelector("#userName").hidden = true;
  document.querySelector("#show-users-btn").hidden = true;
  document.querySelector("#create-collection-btn").hidden = true;
  document.querySelector("#create-collection-form").hidden = true;
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

document
  .querySelector("#create-collection-btn")
  .addEventListener("click", async () => {
    document.querySelector("#create-collection-form").hidden = false;
  });

document
  .querySelector("#create-collection-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let collectionName = document.querySelector("#collection-name").value;
    let items = document.querySelector("#item").value;

    collectionRepository.createCollection(collectionName, {
      id: "",
      tag: "",
      name: "",
    });
  });
