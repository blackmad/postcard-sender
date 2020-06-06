import admin = require("firebase-admin");
admin.initializeApp();
export const orderCollection = admin.firestore().collection("orders")