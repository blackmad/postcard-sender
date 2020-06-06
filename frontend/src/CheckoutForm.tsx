import React, { useState, useEffect } from "react";
import { Address, LETTER_COST } from "./types";

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
  formValid,
}: {
  checkedAddresses: Address[];
  myAddress: Address;
  body: string;
  formValid: boolean,
}) => {
  const [error, setError] = useState('');
  
  const totalAmount = checkedAddresses.length * LETTER_COST;
5
  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    var response = await fetch('https://us-central1-political-postcards.cloudfunctions.net/api/startPayment', {
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

  const isDisabled = checkedAddresses.length === 0 || !formValid;

  return (
    <>
    {error && <Alert variant='danger'>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Button variant="primary" type="submit" disabled={isDisabled}>
          {!isDisabled ? `Mail ${checkedAddresses.length} letters for $${totalAmount.toFixed(2)}` : "Select some addresses and fill in all fields"}
        </Button>
      </form>
    </>
  );
};

export default CheckoutForm;
