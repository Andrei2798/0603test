import { doc } from "firebase/firestore";
import { usersRepository } from "./usersRepository.js";

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

async function renderUserList() {
  const users = await usersRepository.getAll();
  const userListContainer = document.querySelector("#user-list");
  const table = createTable(users);
  userListContainer.innerHTML = "";
  userListContainer.appendChild(table);
  return users;
}

function createTable(users) {
  const table = document.createElement("table");
  table.classList.add("table", "table-bordered");
  const headers = getUsersHeaders(users);
  const thead = createTableHeader(headers);
  const tbody = createTableBody(users, headers);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function createTableHeader(headers) {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  const deleteHeaderCell = createHeaderCell("Delete");
  const blockHeaderCell = createHeaderCell("Block");
  headerRow.appendChild(deleteHeaderCell);
  headerRow.appendChild(blockHeaderCell);
  thead.appendChild(headerRow);
  return thead;
}

function createHeaderCell(text) {
  const cell = document.createElement("th");
  cell.textContent = text;
  return cell;
}

function createTableBody(users, headers) {
  const tbody = document.createElement("tbody");
  users.forEach((user) => {
    const userRow = createUserRow(user, headers);
    const deleteButton = createButton("Delete", "btn-danger", () =>
      deleteUser(user)
    );
    const blockButton = createButton("Block", "btn-warning", () =>
      blockUser(user)
    );
    const deleteCell = createTableCell(deleteButton);
    const blockCell = createTableCell(blockButton);

    // Добавляем кнопки в конец строки пользователя
    userRow.appendChild(deleteCell);
    userRow.appendChild(blockCell);

    tbody.appendChild(userRow);
  });
  return tbody;
}

function createTableCell(element) {
  const cell = document.createElement("td");
  cell.appendChild(element);
  return cell;
}

function createUserRow(user, headers) {
  const row = document.createElement("tr");
  headers.forEach((headerText) => {
    const cell = document.createElement("td");
    cell.textContent = user[headerText];
    row.appendChild(cell);
  });
  return row;
}

function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("btn", className);
  button.addEventListener("click", clickHandler);
  return button;
}
function getUsersHeaders(users) {
  return users.length > 0 ? Object.keys(users[0]) : [];
}
