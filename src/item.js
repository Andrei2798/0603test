import { collectionRepository } from "./collectionRepository.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Получаем название выбранной коллекции из URL
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get("collection");

    // Запрашиваем данные об элементах выбранной коллекции
    const collectionItems = await collectionRepository.getItems(collectionName);

    // Отображаем полученные элементы на странице
    renderCollectionItems(collectionItems);
  } catch (error) {
    console.error("Ошибка при получении данных о коллекции:", error);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Получаем название выбранной коллекции из URL
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get("collection");

    // Запрашиваем данные об элементах выбранной коллекции
    const collectionItems = await collectionRepository.getItems(collectionName);

    // Отображаем полученные элементы на странице
    renderCollectionItems(collectionItems);
  } catch (error) {
    console.error("Ошибка при получении данных о коллекции:", error);
  }
});

function renderCollectionItems(collectionItems) {
  const container = document.querySelector("#items-container");
  if (container) {
    // Очищаем содержимое контейнера перед добавлением новых элементов
    container.innerHTML = "";

    // Создаем таблицу с классами Bootstrap для стилизации
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-hover");

    // Создаем заголовок таблицы с классом Bootstrap
    const thead = document.createElement("thead");
    thead.classList.add("thead-dark");
    const headerRow = document.createElement("tr");
    Object.keys(collectionItems[0]).forEach((key) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Создаем строки с данными элементов с классом Bootstrap
    const tbody = document.createElement("tbody");
    collectionItems.forEach((item) => {
      const row = document.createElement("tr");
      Object.values(item).forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Добавляем таблицу в контейнер
    container.appendChild(table);
  } else {
    console.error("Контейнер не найден");
  }
}
