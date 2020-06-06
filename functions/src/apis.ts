import functions = require('firebase-functions');

export let Config = functions.config().test;
if (functions.config().mode === 'prod') {
  Config = functions.config().prod;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const Lob = require("lob")(Config.lob.api_key);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const stripe = require("stripe")(Config.stripe.api_key);
