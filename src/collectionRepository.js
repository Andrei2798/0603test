import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
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
      await setDoc(doc(this.metadataCollection, collectionName), {});
      console.log(this.db);
      console.log(collectionName);
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
}

export const collectionRepository = new CollectionRepository();
