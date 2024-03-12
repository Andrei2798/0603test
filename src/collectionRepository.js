import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase";

export class CollectionRepository {
  db = getFirestore(app);
  newCollectionName = "collections"; // Название новой коллекции

  async createDocument(params) {
    try {
      const docRef = await addDoc(
        collection(this.db, this.newCollectionName),
        params
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Другие методы для работы с новой коллекцией
}

export const collectionRepository = new CollectionRepository();
