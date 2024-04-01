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
      const newCollectionRef = collection(this.db, collectionName);

      await addDoc(newCollectionRef, collectionData);

      const additionalFields = Object.keys(collectionData).filter(
        (key) => key !== "id" && key !== "tag" && key !== "name"
      );

      if (additionalFields.length > 0) {
        await setDoc(doc(this.metadataCollection, collectionName), {
          additionalFields,
          topic: collectionData.topic || "",
          description: collectionData.description || "",
          owner: collectionData.owner,
        });
        console.log(
          "Дополнительные поля и поля topic и description сохранены в Metadata для коллекции ",
          collectionName
        );
      } else {
        await setDoc(doc(this.metadataCollection, collectionName), {
          topic: collectionData.topic || "",
          description: collectionData.description || "",
        });
        console.log(
          "Поля topic и description сохранены в Metadata для коллекции ",
          collectionName
        );
      }

      console.log("Коллекция успешно создана в Firestore!");
      return true;
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
      return false;
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
      const collectionRef = collection(this.db, collectionName);

      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

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
      if (!itemId) {
        console.error("Ошибка: Не указан идентификатор элемента");
        return false;
      }

      const collectionRef = collection(this.db, collectionName);

      const querySnapshot = await getDocs(
        query(collectionRef, where("id", "==", itemId))
      );

      if (querySnapshot.empty) {
        console.error(
          `Ошибка: Документ с ID ${itemId} в коллекции ${collectionName} не найден`
        );
        return false;
      }

      const docSnapshot = querySnapshot.docs[0];
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
          description: doc.data().description || "",
          topic: doc.data().topic || "",
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
          // Исключаем поле 'owner'
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
