// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { POSTCARD_COST } from "../../frontend/src/types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Lob = require("lob")(process.env.LOB_API_KEY);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

import Joi = require("@hapi/joi");

import {
  ContainerTypes,
  // Use this as a replacement for express.Request
  ValidatedRequest,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
  // Creates a validator that generates middlewares
  createValidator,
} from "express-joi-validation";

import "joi-extract-type";

import * as express from "express";
import * as asyncHandler from "express-async-handler";

import bodyParser = require("body-parser");
const app = express();
const validator = createValidator();

import admin = require("firebase-admin");
admin.initializeApp();

app.use(bodyParser.json());

const addressSchema = Joi.object({
  name: Joi.string().required(),
  address_line1: Joi.string().required(),
  address_line2: Joi.string().optional(),
  address_city: Joi.string().required(),
  address_state: Joi.string().required(),
  address_zip: Joi.string().required(),
  address_country: Joi.string().required(),
});

const startPaymentRequestSchema = Joi.object({
  fromAddress: addressSchema.required(),
  toAddresses: Joi.array().items(addressSchema).min(1),
  body: Joi.string,
});

interface StartPaymentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof startPaymentRequestSchema>;
}

app.post(
  "/startPayment",
  validator.body(startPaymentRequestSchema),
  asyncHandler(async (_req, res) => {
    const toAddresses = req.query.toAddresses;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [{
        price: process.env.STRIPE_PRODUCT_ID,
        quantity: toAddresses.length,
      }],
      mode: 'payment',
      success_url: `${process.env.HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOST}/cancel`,
    });

    admin
      .firestore()
      .collection("orders")
      .add(req.query)
      .then((writeResult) => {
        res.json({ sessionId: stripeSession.id, orderId: writeResult.id });
      });
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
