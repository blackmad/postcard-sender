import React, { useState, useEffect } from "react";

import * as _ from 'lodash';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import "./App.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


import firebase from "firebase/app";
import "firebase/firestore";

import { Template } from "./types";
import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG");

const firebaseConfig = {
  apiKey: "AIzaSyAiQLnfziASZ6GGByNDLV3E7WkhtOtfi9s",
  authDomain: "political-postcards.firebaseapp.com",
  databaseURL: "https://political-postcards.firebaseio.com",
  projectId: "political-postcards",
  storageBucket: "political-postcards.appspot.com",
  messagingSenderId: "308810265041",
  appId: "1:308810265041:web:2959c1e11ae6967c7370f0",
  measurementId: "G-9Y0THVSV61",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function parseVars(template: string) {
  const match = template.match(/\[[^\]]+\]/g);
  return _.uniq(match?.map((s) => s.replace("[", "").replace("]", "")));
}

function Inputs({
  inputs,
  updateField,
}: {
  inputs: string[];
  updateField: (key: string, value: string) => void;
}) {
  return (
    <>
      {inputs.map((input) => {
        const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          updateField(input, event.target.value);
        };
        return (
          <Row key={input}>
            <Form.Group>
              <Form.Label>{input}</Form.Label>
              <Form.Control type="text" onChange={onChange} />
            </Form.Group>
          </Row>
        );
      })}{" "}
    </>
  );
}

function PostcardForm() {
  const [template, setTemplate] = useState({} as Template);
  const [bodyText, setBodyText] = useState("");
  const [variables, setVariables] = useState([] as string[]);

  const variableMap: Record<string, string> = {}

  const mailId = window.location.search.substr(1);
  useEffect(() => {
    db.collection("templates")
      .doc(mailId)
      .get()
      .then((value) => {
        console.log(value.data());
        const template = (value.data() as unknown) as Template;
        setTemplate(template);
        setVariables(parseVars(template.template) || []);
        setBodyText(template.template);
      });
  }, [mailId]);

  const renderBody = () => {
    let newBodyText = template.template;
    
    _.forEach(variableMap, (value, key) => {
      newBodyText = newBodyText.replace(`[${key}]`, value);
    });
    setBodyText(newBodyText);
  }

  const updateField = (key: string, value: string) => {
    variableMap[key] = value;
    renderBody();
  };


  return (
    <Elements stripe={stripePromise}>
      <Container>
        <Inputs inputs={variables} updateField={updateField} />
        <Row>
        <Form.Control as="textarea" value={bodyText} />
        </Row>
        <CheckoutForm />

      </Container>
    </Elements>
  );
}

export default PostcardForm;
