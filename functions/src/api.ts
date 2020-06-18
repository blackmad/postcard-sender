import { prodStripe, testStripe, GoogleApiKey, ProdConfig, TestConfig } from "./apis";

import * as express from "express";
import * as asyncHandler from "express-async-handler";
import axios from "axios";

import cors = require("cors");

import bodyParser = require("body-parser");
const app = express();

app.use(cors({ origin: true }));

import { startPaymentRequestSchema, StartPaymentRequestType } from "./types";
import { orderCollection } from "./database";
import { markOrderPaid } from "./orders";

app.use(bodyParser.json());

app.get(
  "/findReps",
  asyncHandler(async (req, res) => {
    // Optionally the request above could also be done as
    const response = await axios.get("https://www.googleapis.com/civicinfo/v2/representatives", {
      params: {
        address: req.query.address,
        key: GoogleApiKey,
      },
    });
  
    res.json(response.data);
  })
);

app.post(
  "/startPayment",
  asyncHandler(async (req, res) => {
    const host = req.get("Origin") || req.get("origin");

    const validation = startPaymentRequestSchema.validate(req.body);
    if (validation.error) {
      res.status(500).json({ errors: validation.error.details });
      return;
    }

    const body = req.body as StartPaymentRequestType;
    
    const isTest = body.test;

    const toAddresses = body.toAddresses;

    const orderRef = orderCollection.doc();
    const orderId = orderRef.id;

    const stripe = isTest ? testStripe : prodStripe;
    const productId = isTest ? TestConfig.stripe.product_id : ProdConfig.stripe.product_id;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: productId,
          quantity: (toAddresses || []).length,
        },
      ],
      customer_email: body.email,
      client_reference_id: orderId,
      mode: "payment",
      success_url: `${host}/letterSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/cancel`,
    });

    orderRef.set({ ...body, orderId, isTest }).then(() => {
      res.json({ sessionId: stripeSession.id });
    });
  })
);

// Match the raw body to content type application/json
app.post(
  "/paymentWebhook",
  asyncHandler(async (req, res) => {
    const event = req.body;

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await markOrderPaid(event.data.object.client_reference_id);
        return res.json({ received: true });
      default:
        // Unexpected event type
        return res.status(400).end();
    }
  })
);

app.get(
  "/forceOrder/:id",
  asyncHandler(async (req, res) => {
    // await finishOrder(req.params.id as string);
    return res.json({ received: true });
  })
);

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
