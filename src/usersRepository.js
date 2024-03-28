import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { app } from "../firebase";

export class UsersRepository {
  db = getFirestore(app);
  collectionName = "users";

  async create(params) {
    try {
      const docRef = await addDoc(
        collection(this.db, this.collectionName),
        params
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async deleteUser(id) {
    let result = await this.getUserReference(id);
    await deleteDoc(doc(this.db, this.collectionName, result));
  }

  async blockUser(id) {
    try {
      let result = await this.getUserReference(id);
      if (!result) {
        console.log("User not found in Firestore");
        return;
      }
      const userRef = doc(this.db, this.collectionName, result);
      await updateDoc(userRef, { status: "blocked" });
      console.log("User successfully blocked!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  }

  async unblockUser(id) {
    try {
      let result = await this.getUserReference(id);
      if (!result) {
        console.log("User not found in Firestore");
        return;
      }
      const userRef = doc(this.db, this.collectionName, result);
      await updateDoc(userRef, { status: "unblocked" });
      console.log("User successfully blocked!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  }

  async makeAdmin(id) {
    try {
      let result = await this.getUserReference(id);
      if (!result) {
        console.log("User not found in Firestore");
        return;
      }
      const userRef = doc(this.db, this.collectionName, result);
      await updateDoc(userRef, { status: "admin" });
      console.log("User successfully blocked!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  }

  async getUserReference(id) {
    try {
      const querySnapshot = await getDocs(
        // документы коллекции
        collection(this.db, this.collectionName) // коллекция
      );
      const results = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          if (userData.id == id) {
            console.log("User ID from Firestore:", doc.id);
            return doc.id;
          }
        })
      );
      console.log(results);
      return results.find((id) => id !== undefined) || null;
    } catch (error) {
      console.error("Error getting user ID from Firestore:", error);
      return null;
    }
  }

  async getAll() {
    const usersSnapshot = await getDocs(
      collection(this.db, this.collectionName)
    );
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  }
}

export const usersRepository = new UsersRepository();
