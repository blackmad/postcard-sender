import React, { useState, useEffect } from "react";
import { Address, POSTCARD_COST } from "./types";
import Button from "react-bootstrap/Button";

import { loadStripe } from "@stripe/stripe-js";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG");

const CheckoutForm = ({
  checkedAddresses,
  myAddress,
  body,
}: {
  checkedAddresses: Address[];
  myAddress: Address;
  body: string;
}) => {
  const totalAmount = checkedAddresses.length * POSTCARD_COST;

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    var response = await fetch('/startPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromAddress: myAddress,
        toAddresses: checkedAddresses,
        body
      })
    })
      .then(function (response) {
        return response.json();
      });

    const stripeSessionId = response.sessionId;
    const orderId = response.orderId;

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeSessionId,
      clientReferenceId: orderId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button variant="primary" type="submit" disabled={checkedAddresses.length === 0}>
        {checkedAddresses.length > 0 ? `Pay $${totalAmount.toFixed(2)}` : "Select some addresses"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
