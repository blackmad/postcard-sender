import { orderCollection } from "./database";
import { Order, Address } from "./types";

import { Lob } from "./apis";

// import mailgun = require("mailgun-js");

// const notifyUser() {
//   const DOMAIN = "sandboxde73a2919f44487791325367101f5da8.mailgun.org";
//   const mg = mailgun({apiKey: "3b7073e73711a8aeddb5c884f256c8d3-a2b91229-5e8e5db0", domain: DOMAIN});
//   const data = {
//     from: "Mailgun Sandbox <postmaster@sandboxde73a2919f44487791325367101f5da8.mailgun.org>",
//     to: "politics@blackmad.com",
//     subject: "Hello",
//     text: "Testing some Mailgun awesomness!"
//   };
//   mg.messages().send(data, function (error, body) {
//     console.log(body);
//   });
// }

const makeLetter = ({
  toAddress,
  fromAddress,
  body,
}: {
  toAddress: Address;
  fromAddress: Address;
  body: string;
}): string => {
  const formattedBody = body.replace(/\n/g, "<br/>");

  const options1 = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const date1 = new Date();

  const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options1);
  const formattedDate = dateTimeFormat3.format(date1);

  return `
<html>
<head>
<meta charset="UTF-8">
<link href='https://fonts.googleapis.com/css?family=Open+Sans:400' rel='stylesheet' type='text/css'>
<title>Lob.com Outstanding Balance Letter Template</title>
<style>
  @font-face {
    font-family: 'Loved by the King';
    font-style: normal;
    font-weight: 400;
    src: url('https://s3-us-west-2.amazonaws.com/public.lob.com/fonts/lovedByTheKing/LovedbytheKing.ttf') format('truetype');
  }

  *, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  body {
    width: 8.5in;
    height: 11in;
    margin: 0;
    padding: 0;
    font-family: 'Open Sans';
  }

  .page {
    page-break-after: always;
  }

  .page-content {
    position: relative;
    width: 7in;
    height: 10.625in;
    left: 0.75in;
    top: 0.1875in;
  }

  #logo {
    position: absolute;
    right: 0;
  }

  .wrapper {
    position: absolute;
    top: 2.75in;
  }

  .signature {
    font-family: 'Loved by the King';
    font-size: 45px;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="page-content">
      <!-- Your logo here! -->

      <div class='wrapper'>
        <p>${formattedDate}</p>

        <p>Dear ${toAddress.name},</p>

        ${formattedBody.replace(/\n/g, "<br/>")}

        <p>Sincerely,</p>
        <p class="signature">${fromAddress.name}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export const markOrderPaid = async (orderId: string) => {
  const docs = await orderCollection.where("orderId", "==", orderId).get();
  if (docs.empty) {
    throw new Error("no order with id " + orderId);
  }

  const order = docs.docs[0];

  const orderPromise = order.ref.update({ paid: true });
  return orderPromise;
};

export const executeOrderId = async (orderId: string) => {
  const docs = await orderCollection.where("orderId", "==", orderId).get();
  if (docs.empty) {
    throw new Error("no order with id " + orderId);
  }

  const order = docs.docs[0];
  const orderData: Order = order.data() as Order;
  return executeOrder(orderData);
};

export const executeOrder = async (orderData: Order) => {
  if (!orderData || !orderData.toAddresses || !orderData.body) {
    throw new Error("no order with id ");
  }

  const lobPromises = orderData.toAddresses.map((toAddress: Address) => {
    return new Promise((resolve, reject) => {
      Lob.letters.create(
        {
          description: "Demo Letter",
          to: toAddress,
          from: orderData.fromAddress,
          file: makeLetter({ toAddress, fromAddress: orderData.fromAddress, body: orderData.body }),
          color: false,
        },
        (err: any, body: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        }
      );
    });
  });

  await orderCollection.doc(orderData.id).update({ fulfilled: true });
  const lobResponses = await Promise.all([...lobPromises]);
  return lobResponses;
};
