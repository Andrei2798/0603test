import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase";

class CollectionRepository {
  constructor() {
    this.db = getFirestore(app);
  }

  async createCollection(collectionName, collectionData) {
    try {
      // Создаем новую коллекцию в Firestore
      const newCollectionRef = collection(this.db, collectionName);

      // Добавляем пустой документ в коллекцию с данными collectionData
      await addDoc(newCollectionRef, collectionData);
      console.log(this.db);
      console.log(collectionName);
      console.log("Коллекция успешно создана в Firestore!");
      return true; // Возвращаем true в случае успешного создания
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
      return false; // Возвращаем false в случае ошибки
    }
  }
}

export const collectionRepository = new CollectionRepository();
