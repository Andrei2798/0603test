import { usersRepository } from "./usersRepository.js";
import { collectionRepository } from "./collectionRepository.js";
import { v4 as uuidv4 } from "uuid";

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
  localStorage.clear();
  document.querySelector("#logout-button").hidden = true;
  document.querySelector("#enter-button").hidden = false;
  document.querySelector("#registration-button").hidden = false;
  document.querySelector("#userName").hidden = true;
  document.querySelector("#show-users-btn").hidden = true;
  document.querySelector("#create-collection-btn").hidden = true;
  document.querySelector("#create-collection-form").hidden = true;
  document.querySelector("#create-item-form").hidden = true;
  document.querySelector("#user-list").hidden = true;

  const deleteButtons = document.querySelectorAll(".btn-danger");
  deleteButtons.forEach((button) => {
    button.hidden = true;
  });
}

document.querySelector("#logout-button").addEventListener("click", exit);

///////////////////////////////////////////////////////////////////
document
  .querySelector("#create-collection-btn")
  .addEventListener("click", async () => {
    document.querySelector("#create-collection-form").hidden = false;
    document.querySelector("#create-item-form").hidden = false;
  });

document
  .querySelector("#create-collection-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let collectionName = document.querySelector("#collection-name").value;
    let itemsInput = document.querySelector("#item").value;

    let itemsArray = itemsInput.split(",").map((item) => item.trim());
    let userName = localStorage.getItem("userName");
    let id = Math.random().toString(36).substring(2); // Генерация случайной строки из символов и цифр
    let topic = document.querySelector("#collection-topic").value;
    let description = document.querySelector("#collection-description").value;
    console.log(id);
    // Создаем объект collectionData и добавляем в него стандартные поля
    let collectionData = {
      tag: "",
      name: collectionName,
      owner: userName,
      topic: topic,
      description: description,
    };

    // Добавляем остальные поля на основе элементов из массива itemsArray
    itemsArray.forEach((item) => {
      collectionData[item] = "";
    });

    // Передаем объект collectionData в функцию createCollection
    const collectionCreated = await collectionRepository.createCollection(
      collectionName,
      collectionData
    );

    // Если коллекция успешно создана, обновляем Metadata
    if (collectionCreated) {
      try {
        const metadataDocRef = doc(
          collectionRepository.metadataCollection,
          collectionName
        );
        const metadataDocSnapshot = await getDoc(metadataDocRef);

        // Получаем дополнительные поля для указанной коллекции
        const additionalFields = await collectionRepository.getAdditionalFields(
          collectionName
        );

        // Если документ Metadata уже существует, обновляем его
        if (metadataDocSnapshot.exists()) {
          await updateDoc(metadataDocRef, {
            additionalFields: additionalFields,
          });
        } else {
          // Если документ Metadata не существует, создаем его
          await setDoc(metadataDocRef, { additionalFields: additionalFields });
        }

        console.log("Metadata для коллекции успешно обновлен.");
      } catch (error) {
        console.error("Ошибка при обновлении Metadata для коллекции:", error);
      }
    }
  });

const collectionSelect = document.querySelector("#collection-select");

// При загрузке страницы заполняем select существующими коллекциями
window.addEventListener("DOMContentLoaded", async () => {
  try {
    let userName = localStorage.getItem("userName");
    console.log("userName: " + userName);
    let userCollections = "";
    if (localStorage.getItem("isAdmin") != "true") {
      userCollections = await collectionRepository.getCollectionsByOwner(
        userName
      );
    } else {
      userCollections = await collectionRepository.getAllCollections();
    }
    // Получаем только те коллекции, у которых owner === userName

    // Очищаем текущие опции в элементе select
    collectionSelect.innerHTML = "";

    // Добавляем новые опции в элемент select
    userCollections.forEach((collection) => {
      const option = document.createElement("option");
      option.value = collection.name;
      option.textContent = collection.name;
      collectionSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Ошибка при получении списка коллекций:", error);
  }
});
collectionRepository.getCollectionsByOwner();
//////////////////////////////////////////////////

// Назначаем обработчик события change выпадающему списку коллекций
collectionSelect.addEventListener("change", async () => {
  try {
    // Получаем выбранную коллекцию из выпадающего списка
    const selectedCollection = collectionSelect.value;

    // Получаем дополнительные поля для выбранной коллекции
    const additionalFields = await collectionRepository.getAdditionalFields(
      selectedCollection
    );

    // Очищаем предыдущие поля ввода
    dynamicFieldsContainer.innerHTML = "";

    // Создаем поля ввода на основе полученных дополнительных полей
    additionalFields.forEach((field) => {
      const label = document.createElement("label");
      label.textContent = `${field}:`;

      const input = document.createElement("input");
      input.type = "text";
      input.id = field;
      input.name = field;

      dynamicFieldsContainer.appendChild(label);
      dynamicFieldsContainer.appendChild(input);
    });
  } catch (error) {
    console.error("Ошибка при обновлении дополнительных полей:", error);
  }
});
const dynamicFieldsContainer = document.querySelector("#dynamic-fields");
// Назначаем обработчик события change выпадающему списку коллекций
collectionSelect.addEventListener("change", async () => {
  try {
    // Получаем выбранную коллекцию из выпадающего списка
    const selectedCollection = collectionSelect.value;

    // Получаем дополнительные поля для выбранной коллекции
    const additionalFields = await collectionRepository.getAdditionalFields(
      selectedCollection
    );

    // Очищаем предыдущие поля ввода
    dynamicFieldsContainer.innerHTML = "";

    // Создаем поля ввода на основе полученных дополнительных полей
    additionalFields.forEach((field) => {
      const label = document.createElement("label");
      label.textContent = `${field}:`;

      const input = document.createElement("input");
      input.type = "text";
      input.id = field;
      input.name = field;

      dynamicFieldsContainer.appendChild(label);
      dynamicFieldsContainer.appendChild(input);
    });
  } catch (error) {
    console.error("Ошибка при обновлении дополнительных полей:", error);
  }
});

// Обработчик события отправки формы создания элемента
document
  .querySelector("#create-item-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    try {
      const collectionName = collectionSelect.value;
      const itemName = document.querySelector("#item-name").value;
      const tag = document.querySelector("#tag").value;
      const itemFields = {};

      // Добавляем автоматически owner из localStorage
      const owner = localStorage.getItem("userName");
      itemFields["owner"] = owner;

      const additionalFields = await collectionRepository.getAdditionalFields(
        collectionName
      );
      additionalFields.forEach((field) => {
        const fieldValue = document.querySelector(`#${field}`).value;
        itemFields[field] = fieldValue;
      });

      // Генерация уникального ID для айтема
      const id = uuidv4();

      const itemData = {
        id: id,
        name: itemName,
        tag: tag,
        ...itemFields,
      };

      // Создание нового айтема в базе данных
      await collectionRepository.createItem(
        collectionName,
        itemName,
        tag,
        itemData
      );
    } catch (error) {
      console.error("Ошибка при создании элемента:", error);
    }
  });

// JavaScript код для отображения коллекций в таблице
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const collectionTableBody = document.querySelector(
      "#collection-table tbody"
    );
    const collectionNames = await collectionRepository.getAllCollections();
    const isAdmin = localStorage.getItem("isAdmin");
    const userName = localStorage.getItem("userName");

    // Очистка текущих данных в таблице
    collectionTableBody.innerHTML = "";

    // Функция для получения владельца коллекции
    const getCollectionOwner = async (collectionName) => {
      try {
        return await collectionRepository.getCollectionOwner(collectionName);
      } catch (error) {
        console.error("Ошибка при получении владельца коллекции:", error);
        return null;
      }
    };

    // Добавление строк с данными о коллекциях в таблицу
    for (let index = 0; index < collectionNames.length; index++) {
      const collection = collectionNames[index];
      const row = collectionTableBody.insertRow(index);
      // Установка данных о коллекции в ячейки таблицы
      const cell1 = row.insertCell(0);
      cell1.textContent = index + 1;
      const cell2 = row.insertCell(1);
      cell2.textContent = collection.name;
      const cell3 = row.insertCell(2);
      cell3.textContent = collection.description;
      const cell4 = row.insertCell(3);
      cell4.textContent = collection.topic;
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);

      // Получение владельца коллекции
      const owner = await getCollectionOwner(collection.name);

      // Проверка прав доступа для отображения кнопок
      const isOwner = userName === owner;
      const showButtons = isAdmin === "true" || isOwner;

      const viewButton = document.createElement("button");
      viewButton.textContent = "View";
      viewButton.classList.add("btn", "btn-primary");
      cell6.appendChild(viewButton);

      viewButton.addEventListener("click", function () {
        // Получаем название выбранной коллекции
        const collectionName = collection.name;

        // Формируем URL для перехода на страницу item.html с параметром collectionName в URL
        const url = `item.html?collection=${encodeURIComponent(
          collectionName
        )}`;

        // Перенаправляем пользователя на страницу item.html
        window.location.href = url;
      });

      // Добавление кнопок в последние ячейки строки
      if (showButtons) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger");
        cell5.appendChild(deleteButton);

        // Обработчик события клика на кнопку удаления коллекции
        deleteButton.addEventListener("click", async (event) => {
          event.stopPropagation(); // Остановка всплытия события, чтобы не срабатывал клик на строке

          try {
            const collectionNameToDelete = collection.name;
            const deleted = await collectionRepository.deleteCollection(
              collectionNameToDelete
            );
            if (deleted) {
              // Удаляем строку из таблицы
              row.remove();
            }
          } catch (error) {
            console.error("Ошибка при удалении коллекции:", error);
          }
        });

        // Обработчик события клика на кнопку просмотра коллекции
      }
    }
  } catch (error) {
    console.error("Ошибка при получении списка коллекций:", error);
  }
});
