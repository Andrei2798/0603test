import { usersRepository } from "./usersRepository.js";

// Функция для обновления списка пользователей
function renderUserList(users) {
  const userList = document.querySelector("#user-list");
  if (userList) {
    userList.innerHTML = ""; // Очищаем список перед обновлением

    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `Name: ${user.name}, Email: ${user.email}, Password: ${user.password}`;
      userList.appendChild(li);
    });
  } else {
    console.error("Element with id 'user-list' not found.");
  }
}

// Обработчик события для кнопки отображения списка пользователей
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
