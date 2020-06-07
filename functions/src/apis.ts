import functions = require('firebase-functions');

export let Config = functions.config().test;
if (functions.config().global.mode === 'prod') {
  Config = functions.config().prod;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const Lob = require("lob")(Config.lob.api_key);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const stripe = require("stripe")(Config.stripe.api_key);

import mailgun = require("mailgun-js");
const DOMAIN = "sandboxde73a2919f44487791325367101f5da8.mailgun.org";
export const mg = mailgun({apiKey: Config.mailgun.api_key, domain: DOMAIN});

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(Config.sendgrid.api_key);

export const GoogleApiKey = Config.google.api_key;