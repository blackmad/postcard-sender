import React, { useState, useEffect } from "react";
import { Address, POSTCARD_COST } from "./types";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { loadStripe } from "@stripe/stripe-js";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51GqpRpGLGlm5kFVxzwruVzMZ2Bc07pqosMzyiZd6ixInJHEq6MgFE9v1kRVJZUUhuOT3X2XdfHj31oknZEmKK6KT004CUm09hp");

const CheckoutForm = ({
  checkedAddresses,
  myAddress,
  body,
}: {
  checkedAddresses: Address[];
  myAddress: Address;
  body: string;
}) => {
  const [error, setError] = useState('');
  
  const totalAmount = checkedAddresses.length * POSTCARD_COST;

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    var response = await fetch('/political-postcards/us-central1/api/startPayment', {
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
      })

    if (response.errors) {
      setError(response.errors.map((e: any) => e.message).join(', '));
      return;
    } else {
      setError('');
    }

    const stripeSessionId = response.sessionId;
    const orderId = response.orderId;

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeSessionId,
    });
    console.error(error);
  };

  return (
    <>
    {error && <Alert variant='danger'>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Button variant="primary" type="submit" disabled={checkedAddresses.length === 0}>
          {checkedAddresses.length > 0 ? `Pay $${totalAmount.toFixed(2)}` : "Select some addresses"}
        </Button>
      </form>
    </>
  );
};

export default CheckoutForm;
