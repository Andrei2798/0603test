import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../firebase";

class CollectionRepository {
  constructor() {
    this.db = getFirestore(app);
    this.metadataCollection = collection(this.db, "Metadata");
  }

  async createCollection(collectionName, collectionData) {
    try {
      // Создаем новую коллекцию в Firestore
      const newCollectionRef = collection(this.db, collectionName);

      // Добавляем пустой документ в коллекцию с данными collectionData
      await addDoc(newCollectionRef, collectionData);

      // Проверяем наличие дополнительных полей в collectionData
      const additionalFields = Object.keys(collectionData).filter(
        (key) => key !== "id" && key !== "tag" && key !== "name"
      );

      // Если есть дополнительные поля, добавляем их в Metadata
      if (additionalFields.length > 0) {
        await setDoc(doc(this.metadataCollection, collectionName), {
          additionalFields,
          topic: collectionData.topic || "", // Добавляем поле topic, если указано, иначе оставляем пустую строку
          description: collectionData.description || "", // Добавляем поле description, если указано, иначе оставляем пустую строку
          owner: collectionData.owner,
        });
        console.log(
          "Дополнительные поля и поля topic и description сохранены в Metadata для коллекции ",
          collectionName
        );
      } else {
        // Если дополнительных полей нет, просто добавляем поля topic и description в Metadata
        await setDoc(doc(this.metadataCollection, collectionName), {
          topic: collectionData.topic || "", // Добавляем поле topic, если указано, иначе оставляем пустую строку
          description: collectionData.description || "", // Добавляем поле description, если указано, иначе оставляем пустую строку
        });
        console.log(
          "Поля topic и description сохранены в Metadata для коллекции ",
          collectionName
        );
      }

      console.log("Коллекция успешно создана в Firestore!");
      return true; // Возвращаем true в случае успешного создания
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
      return false; // Возвращаем false в случае ошибки
    }
  }

  async getCollectionOwner(collectionName) {
    try {
      const docRef = doc(this.metadataCollection, collectionName);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const metadata = docSnapshot.data();
        const owner = metadata.owner;
        return owner;
      } else {
        console.error("Document does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error getting owner of collection:", error);
      throw error;
    }
  }

  async deleteCollection(collectionName) {
    try {
      // Создаем ссылку на коллекцию
      const collectionRef = collection(this.db, collectionName);

      // Получаем все документы в коллекции
      const querySnapshot = await getDocs(collectionRef);

      // Удаляем каждый документ в коллекции
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Удаляем соответствующий документ из Metadata
      await deleteDoc(doc(this.metadataCollection, collectionName));

      console.log("Коллекция успешно удалена:", collectionName);
      return true;
    } catch (error) {
      console.error("Ошибка при удалении коллекции:", error);
      return false;
    }
  }

  async deleteItem(collectionName, itemId) {
    try {
      // Проверяем, передан ли корректный идентификатор элемента
      if (!itemId) {
        console.error("Ошибка: Не указан идентификатор элемента");
        return false;
      }

      // Создаем ссылку на коллекцию
      const collectionRef = collection(this.db, collectionName);

      // Получаем документ с указанным идентификатором
      const querySnapshot = await getDocs(
        query(collectionRef, where("id", "==", itemId))
      );

      // Проверяем, найден ли документ
      if (querySnapshot.empty) {
        console.error(
          `Ошибка: Документ с ID ${itemId} в коллекции ${collectionName} не найден`
        );
        return false;
      }

      // Удаляем найденный документ
      const docSnapshot = querySnapshot.docs[0]; // Предполагаем, что найдется только один документ
      await deleteDoc(doc(docSnapshot.ref.parent, docSnapshot.id));

      console.log(
        `Элемент с ID ${itemId} успешно удален из коллекции ${collectionName}`
      );
      return true;
    } catch (error) {
      console.error(
        `Ошибка при удалении элемента из коллекции ${collectionName}:`,
        error
      );
      return false;
    }
  }

  async getCollectionsByOwner(userName) {
    try {
      const querySnapshot = await getDocs(
        query(collection(this.db, "Metadata"), where("owner", "==", userName))
      );
      const collections = [];
      querySnapshot.forEach((doc) => {
        collections.push({
          name: doc.id,
          description: doc.data().description || "",
          topic: doc.data().topic || "",
        });
      });
      return collections;
    } catch (error) {
      console.error("Ошибка при получении коллекций пользователя:", error);
      throw error;
    }
  }
  async getAllCollections() {
    try {
      const querySnapshot = await getDocs(this.metadataCollection);
      const collections = [];
      querySnapshot.forEach((doc) => {
        collections.push({
          name: doc.id,
          description: doc.data().description || "", // если нет описания, используем пустую строку
          topic: doc.data().topic || "", // если нет темы, используем пустую строку
        });
      });
      return collections;
    } catch (error) {
      console.error("Ошибка при получении списка коллекций:", error);
      return [];
    }
  }
  async getAdditionalFields(collectionName) {
    try {
      const docRef = doc(this.metadataCollection, collectionName);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.additionalFields !== undefined) {
          // Исключаем поле 'owner' из списка дополнительных полей
          const additionalFields = Object(data.additionalFields).filter(
            (field) => field !== "owner"
          );
          console.log("additional fields: " + additionalFields);
          return additionalFields;
        } else {
          console.error("Дополнительные поля не найдены");
          return [];
        }
      } else {
        console.error("Документ не найден");
        return [];
      }
    } catch (error) {
      console.error(
        "Ошибка при получении дополнительных полей коллекции:",
        error
      );
      return [];
    }
  }

  async createItem(collectionName, itemName, tag, itemFields) {
    try {
      const itemCollectionRef = collection(this.db, collectionName);

      const itemData = {
        name: itemName,
        tag: tag,
        ...itemFields,
      };

      await addDoc(itemCollectionRef, itemData);

      console.log("Данные нового элемента:", itemData);
    } catch (error) {
      console.error("Ошибка при создании элемента:", error);
    }
  }

  async getItems(collectionName) {
    try {
      const collectionRef = collection(this.db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return items;
    } catch (error) {
      console.error("Ошибка при получении элементов коллекции:", error);
      return [];
    }
  }
}

export const collectionRepository = new CollectionRepository();
