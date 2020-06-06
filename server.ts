// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Lob = require("lob")(process.env.LOB_API_KEY);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

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

const sendRequestSchema = Joi.object({
  to: addressSchema.required(),
  from: addressSchema.required(),
});

interface SendRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof sendRequestSchema>;
}

app.get('/startPayment', async (req, res) => {
  const amount = req.query.amount;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
  });

  res.json({client_secret: paymentIntent.client_secret});
});

app.post(
  "/send",
  validator.body(sendRequestSchema),
  asyncHandler(async (req: ValidatedRequest<SendRequestSchema>, res) => {
    console.log(req.body);
    console.log(req.query);
    // res.end(`Hello ${req.query.name}!`)

  
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

const port = process.env.PORT || 8080; // default port to listen

app.listen(port, () => {
  console.log("Server running on port 3000");
});
