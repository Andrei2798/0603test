import { usersRepository } from "./usersRepository.js";

// Функция для обновления списка пользователей
function renderUserList(users) {
  const userList = document.querySelector("#user-list");
  userList.innerHTML = ""; // Очищаем список перед обновлением

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `Name: ${user.name}, Email: ${user.email}, Password: ${user.password}`;
    userList.appendChild(li);
  });
}

// Обработчик события для кнопки добавления пользователя
const addUserForm = document.querySelector("#user-form");
addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.querySelector("#name-input");
  const emailInput = document.querySelector("#email-input");
  const passwordInput = document.querySelector("#password-input");

  // Добавляем пользователя
  await usersRepository.create({
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  });

  // Получаем обновленный список пользователей и обновляем интерфейс
  const users = await usersRepository.getAll();
  renderUserList(users);

  // Очищаем поля формы
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
});

// Обработчик события для кнопки отображения списка пользователей
const showUsersButton = document.querySelector("#show-users-btn");
showUsersButton.addEventListener("click", async () => {
  // Получаем список пользователей и обновляем интерфейс
  const users = await usersRepository.getAll();
  renderUserList(users);
});
