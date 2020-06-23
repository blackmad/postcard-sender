import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

 
import app from './api';
import { executeOrder } from './orders';
import { Order } from './types';

exports.api = functions.https.onRequest(app);

// fixing: yqRgdp693E5Pcn8fo1DE

exports.executeOrder = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((change, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = change.after.data();

      // ...or the previous value before this update
      const previousValue = change.before.data();

      console.log('got order change on ', context.params.orderId)

      if (previousValue.paid || !newValue.paid || newValue.fulfilled || previousValue.fulfilled) {
        console.log('was already paid')
        return true;
      }

      console.log('executing order');

      return executeOrder(newValue as Order);
    });