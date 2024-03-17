import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
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
        });
        console.log(
          "Дополнительные поля сохранены в Metadata для коллекции",
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

  async getAllCollections() {
    try {
      const querySnapshot = await getDocs(this.metadataCollection);
      const collectionNames = [];
      querySnapshot.forEach((doc) => {
        collectionNames.push(doc.id);
      });
      console.log(JSON.stringify(collectionNames));
      return collectionNames;
    } catch (error) {
      console.error("Ошибка при получении списка коллекций:", error);
      return [];
    }
  }
  async getAdditionalFields(collectionName) {
    try {
      const docRef = doc(this.metadataCollection, collectionName); // Создание ссылки docRef на документ метаданных для указанной коллекции

      const docSnapshot = await getDoc(docRef); // Получение снимка документа метаданных с использованием getDoc()
      if (docSnapshot.exists()) {
        const data = docSnapshot.data(); // получение данных из снимка документа
        if (data && data.additionalFields !== undefined) {
          console.log("additional fields: " + Object(data.additionalFields));
          return Object(data.additionalFields);
        } else {
          console.error("Дополнительные поля не найдены");
          return []; // Возвращаем пустой массив, если дополнительные поля отсутствуют
        }
      } else {
        console.error("Документ не найден");
        return []; // Возвращаем пустой массив, если документ не найден
      }
    } catch (error) {
      console.error(
        "Ошибка при получении дополнительных полей коллекции:",
        error
      );
      return []; // Возвращаем пустой массив в случае ошибки
    }
  }
}

export const collectionRepository = new CollectionRepository();
