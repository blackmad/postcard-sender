import { Config, stripe } from './apis';

import * as express from "express";
import * as asyncHandler from "express-async-handler";

import bodyParser = require("body-parser");
const app = express();

import { startPaymentRequestSchema, StartPaymentRequestType } from "./types";
import { orderCollection } from "./database";
import { finishOrder } from "./orders";

app.use(bodyParser.json());

app.post(
  "/startPayment",
  asyncHandler(async (req, res) => {
    const validation = startPaymentRequestSchema.validate(req.body);
    if (validation.error) {
      res.status(500).json({errors: validation.error.details});
      return;
    }

    const body = req.body as StartPaymentRequestType;
    const toAddresses = body.toAddresses;

    const orderRef = orderCollection.doc();
    const orderId = orderRef.id;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: Config.stripe.product_id,
        quantity: (toAddresses || []).length,
      }],
      client_reference_id: orderId,
      mode: 'payment',
      success_url: `${process.env.HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOST}/cancel`,
    });

    console.dir({sesionId:  stripeSession.id, orderId }, {depth: 10})

   orderRef
      .set({...body, orderId})
      .then(() => {
        res.json({ sessionId: stripeSession.id });
      });
  })
);

// Match the raw body to content type application/json
app.post('/paymentWebhook',  asyncHandler(async (req, res) => {
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
        console.log(event.data.object.client_reference_id);
        await finishOrder(event.data.object.client_reference_id);
        return res.json({received: true});
    default:
      // Unexpected event type
      return res.status(400).end();
  }
}));

app.get('/forceOrder/:id',  asyncHandler(async (req, res) => {
  await finishOrder(req.params.id as string);
  return res.json({received: true});
}));

// app.get(
//   '/template/:id',
//   (req, res) => {
//     console.log(req.body);
//     console.log(req.query);
//     // res.end(`Hello ${req.query.name}!`)
//   }
// )

// app.post("/send", (req, res, next) => {
//   const body = request.body;
//   const validation = schema.validate(body)

//   if (validation.error) {
//     res.
//   }

//   const lobParams = {
//     size: "4x6",
//     front: frontHtml,
//     back: backHtml,
//     merge_variables: {
//       background_image: row[1],
//       background_color: row[2],
//       name: row[0],
//       car: row[3],
//       mileage: row[4],
//     },
//   };

//   return Lob.postcards.create(lobParams, (err, postcard) => {
//     if (err) {
//       return console.log(err);
//     }
//     console.log(`Postcard to ${postcard.to.name} sent! View it here: ${postcard.url}`);
//   });
// });

export default app;
