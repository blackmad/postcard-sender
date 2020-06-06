import React, { useState, useEffect } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Address, POSTCARD_COST } from "./types";

import Button from "react-bootstrap/Button";

const CheckoutForm = ({
  checkedAddresses,
  myAddress,
  body,
}: {
  checkedAddresses: Address[];
  myAddress: Address;
  body: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null as any);

  const totalAmount = checkedAddresses.length * POSTCARD_COST;

  useEffect(() => {
    if (stripe) {

      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: totalAmount*100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, totalAmount]);

  // if (paymentRequest) {
  //   return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  // }

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    var stripeClientSecret = await fetch('/startPayment', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        myAddress,
        checkedAddresses,
        body
      })
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (responseJson) {
        return responseJson.client_secret;
      });

    const result = await stripe.confirmCardPayment(stripeClientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: myAddress.name,
          address: {
            postal_code: myAddress.address_zip,
          },
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      window.alert(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent?.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />

      <Button variant="primary" type="submit" disabled={checkedAddresses.length === 0}>
        {checkedAddresses.length > 0 ? `Pay $${totalAmount.toFixed(2)}` : "Select some addresses"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
