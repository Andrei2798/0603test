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

    // Создаем ячейки для кнопок "Delete" и "Block"
    const deleteButton = createButton("Delete", "btn-danger", async (event) => {
      event.stopPropagation(); // Остановка всплытия события, чтобы не срабатывал клик на строке
      try {
        await usersRepository.delete(String(user.id));
        await renderUserList(); // После удаления пользователя обновляем список пользователей
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
    const blockButton = createButton("Block", "btn-warning", () =>
      blockUser(user)
    );
    const deleteCell = createTableCell(deleteButton);
    const blockCell = createTableCell(blockButton);

    // Добавляем ячейки с кнопками "Delete" и "Block" в конец строки пользователя
    userRow.appendChild(deleteCell);
    userRow.appendChild(blockCell);

    tbody.appendChild(userRow);
  });
  return tbody;
}

// Вызов createTableBody
createTableBody(users, headers, usersRepository);

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
  button.addEventListener("click", (event) => clickHandler(event));
  return button;
}
function getUsersHeaders(users) {
  return users.length > 0 ? Object.keys(users[0]) : [];
}

// Назначаем обработчик события клика на кнопки удаления
document.querySelectorAll(".delete-user-btn").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    event.stopPropagation(); // Остановка всплытия события, чтобы не срабатывал клик на строке
    const userId = btn.dataset.id;
    try {
      await usersRepository.delete(userId);
      await renderUserList(); // После удаления пользователя обновляем список пользователей
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  });
});

try {
  const users = await usersRepository.getAll();
  users.forEach((user) => {
    console.log("User ID:", user.id);
    // Здесь вы можете выполнить дополнительные действия с id пользователями, например, отобразить их на странице
  });
} catch (error) {
  console.error("Error fetching users:", error);
}
