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
}

document.querySelector("#logout-button").addEventListener("click", exit);

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
    if (localStorage.getItem("iaAdmin") != "true") {
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
    let description = document.querySelector("#collection-description").value;
    // Очистка текущих данных в таблице
    collectionTableBody.innerHTML = "";

    // Добавление строк с данными о коллекциях в таблицу
    collectionNames.forEach((collection, index) => {
      const row = collectionTableBody.insertRow(index);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);
      // Установка данных о коллекции в ячейки таблицы
      cell1.textContent = index + 1;
      cell2.textContent = collection.name;
      cell3.textContent = collection.topic; // Вставляем тему коллекции в третью ячейку
      cell4.textContent = collection.description; // Вставляем описание коллекции в четвертую ячейку
      // Добавьте другие ячейки с данными о коллекции, если нужно
    });
  } catch (error) {
    console.error("Ошибка при получении списка коллекций:", error);
  }
});
//////////////////////////////////

// Обработчик события клика на строку таблицы
document
  .querySelector("#collection-table tbody")
  .addEventListener("click", (event) => {
    // Проверяем, что клик произошел на элементе tr или его дочерних элементах
    let targetElement = event.target.closest("tr");
    if (targetElement) {
      // Получаем название выбранной коллекции из текстового содержимого второй ячейки строки
      const collectionName = targetElement.cells[1].textContent;
      // Перенаправляем пользователя на страницу item.html с параметром collectionName в URL
      window.location.href = `item.html?collection=${encodeURIComponent(
        collectionName
      )}`;
    }
  });
