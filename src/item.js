import { collectionRepository } from "./collectionRepository.js";

const urlParams = new URLSearchParams(window.location.search);
const collectionName = urlParams.get("collection");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log(`Текущая коллекция: ${collectionName}`);

    const collectionItems = await collectionRepository.getItems(collectionName);

    renderCollectionItems(collectionItems);
  } catch (error) {
    console.error("Ошибка при получении данных о коллекции:", error);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get("collection");

    const collectionItems = await collectionRepository.getItems(collectionName);

    renderCollectionItems(collectionItems);
  } catch (error) {
    console.error("Ошибка при получении данных о коллекции:", error);
  }
});

function renderCollectionItems(collectionItems) {
  const container = document.querySelector("#items-container");
  if (!container) {
    console.error("Контейнер не найден");
    return;
  }

  container.innerHTML = "";
  const table = createTable(collectionItems);
  container.appendChild(table);
}

function createTable(collectionItems) {
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-hover");
  const fieldsOrder = getFieldOrder(collectionItems);

  table.appendChild(createTableHeader(fieldsOrder));
  table.appendChild(createTableBody(collectionItems, fieldsOrder));

  return table;
}

function getFieldOrder(collectionItems) {
  if (!collectionItems || collectionItems.length === 0) {
    return [];
  }
  return Object.keys(collectionItems[0]);
}

function createTableHeader(fieldsOrder) {
  const thead = document.createElement("thead");
  thead.classList.add("thead-dark");
  const headerRow = document.createElement("tr");
  fieldsOrder.forEach((key) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = key;
    headerRow.appendChild(headerCell);
  });
  thead.appendChild(headerRow);
  return thead;
}

function createTableBody(collectionItems, fieldsOrder) {
  const tbody = document.createElement("tbody");
  collectionItems.forEach((item) => {
    const row = createTableRow(item, fieldsOrder);
    tbody.appendChild(row);
  });
  return tbody;
}

function createLikeButton(item) {
  const likeButton = document.createElement("button");
  const likeImage = document.createElement("img");
  likeImage.src = import.meta.env.BASE_URL + "images/like.png";
  likeImage.alt = "Like";
  likeButton.appendChild(likeImage);
  likeButton.classList.add("btn", "btn-like");

  const likeCountSpan = document.createElement("span");
  likeCountSpan.textContent = item.likes || 0;

  likeButton.addEventListener("click", () => {
    likeButton.disabled = true;

    item.likes = (item.likes || 0) + 1;
    likeCountSpan.textContent = item.likes;

    console.log("Лайк поставлен!");
  });

  likeButton.appendChild(likeImage);
  likeButton.appendChild(likeCountSpan);

  return likeButton;
}

function createDeleteButton(item) {
  const deleteButton = document.createElement("button");
  const userName = localStorage.getItem("userName");
  const isAdmin = localStorage.getItem("isAdmin");

  collectionRepository
    .getCollectionOwner(collectionName)
    .then((owner) => {
      console.log("Collection owner: " + owner);
      if (isAdmin == "true" || userName == owner) {
        deleteButton.hidden = false;
      } else {
        deleteButton.hidden = true;
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении владельца коллекции:", error);
    });

  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.addEventListener("click", async () => {
    try {
      const itemId = item.id;
      console.log(collectionName);
      console.log(itemId);
      const deleted = await collectionRepository.deleteItem(
        collectionName,
        itemId
      );
      if (deleted) {
        row.remove();

        console.log("Элемент успешно удален.");
      } else {
        console.log("Не удалось удалить элемент.");
      }
    } catch (error) {
      console.error("Ошибка при удалении элемента:", error);
    }
  });

  return deleteButton;
}

function createTableRow(item, fieldsOrder) {
  const isAuthorized = localStorage.getItem("isAuthorithed");
  const row = document.createElement("tr");
  fieldsOrder.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = item[key] || "";
    row.appendChild(cell);
  });

  collectionRepository
    .getCollectionOwner(collectionName)
    .then((owner) => {
      console.log("Collection owner: " + owner);
      if (isAuthorized == "true") {
        likeButtonCell.hidden = false;
      } else {
        likeButtonCell.hidden = true;
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении владельца коллекции:", error);
    });

  const likeButtonCell = document.createElement("td");
  const likeButton = createLikeButton(item);
  likeButtonCell.appendChild(likeButton);
  row.appendChild(likeButtonCell);

  const deleteButtonCell = document.createElement("td");
  const deleteButton = createDeleteButton(item);
  deleteButtonCell.appendChild(deleteButton);
  row.appendChild(deleteButtonCell);

  return row;
}
