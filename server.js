// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// // Обработчик события создания новой коллекции
// exports.onCreateCollection = functions.firestore
//   .document("/{collectionName}")
//   .onCreate(async (snapshot, context) => {
//     const collectionName = context.params.collectionName;

//     try {
//       // Получаем ссылку на коллекцию "Metadata"
//       const metadataRef = admin.firestore().collection("Metadata");

//       // Добавляем документ с информацией о новой коллекции
//       await metadataRef.doc(collectionName).set({
//         created_at: admin.firestore.FieldValue.serverTimestamp(),
//         // Дополнительная информация о коллекции, если необходимо
//       });

//       console.log(
//         `Документ успешно добавлен в коллекцию Metadata для коллекции ${collectionName}`
//       );
//     } catch (error) {
//       console.error(
//         `Ошибка при добавлении документа в коллекцию Metadata для коллекции ${collectionName}:`,
//         error
//       );
//     }
//   });
