import React, { useState, useEffect } from "react";

import * as _ from "lodash";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";

import { Template, Address } from "./types";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";


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

const SpecialVars = ["YOUR NAME", "YOUR ADDRESS"];

function parseVars(template: string) {
  const match = template.match(/\[[^\]]+\]/g);
  return _.uniq(match?.map((s) => s.replace("[", "").replace("]", ""))).filter(
    (v) => !SpecialVars.includes(v)
  );
}

function Addresses({
  addresses,
  onAddressSelected,
}: {
  addresses: Address[];
  onAddressSelected: (b: boolean, c: Address) => void;
}) {
  return (
    <>
      {addresses?.map((address) => {
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onAddressSelected(event.target.checked, address);
        };
        return (
          <Row key={address.name}>
            <Form.Group controlId={address.name}>
              <Form.Check type="checkbox" label={address.name} onChange={onChange} />
            </Form.Group>
          </Row>
        );
      })}
    </>
  );
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
          <Form.Group className="row" key={input}>
            <Form.Label>{input}</Form.Label>
            <Form.Control type="text" onChange={onChange} />
          </Form.Group>
        );
      })}{" "}
    </>
  );
}

interface Props {
  mailId: string;
}

function PostcardForm({ mailId }: Props) {
  const [template, setTemplate] = useState({} as Template);
  const [myAddress, setMyAddress] = useState({} as Address);
  const [variables, setVariables] = useState([] as string[]);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as Address[]);

  useEffect(() => {
    db.collection("templates")
      .doc(mailId)
      .get()
      .then((value) => {
        console.log(value.data());
        const template = (value.data() as unknown) as Template;
        setTemplate(template);
        setVariables(parseVars(template.template) || []);
      });
  }, [mailId]);

  const updateField = (key: string, value: string) => {
    console.log({ key, value });
    const newMap = { ...variableMap };
    newMap[key] = value;
    setVariableMap(newMap);
  };

  const onAddressSelected = (isChecked: boolean, address: Address) => {
    console.log({ isChecked, address });
    if (isChecked) {
      setCheckedAddresses(_.uniq([...checkedAddresses, address]));
    } else {
      setCheckedAddresses(checkedAddresses.filter((a) => a !== address));
    }
  };

  const updateAddress = (address: Address) => {
    console.log("updating", address);
    setMyAddress(address);

    const cityStateLine = [address.address_city, address.address_state, address.address_zip]
      .filter((a) => Boolean(a))
      .join(" ");
    const formattedAddress = [address.address_line1, address.address_line2, cityStateLine]
      .filter((l) => Boolean(l))
      .join(", ");

    const newMap = { ...variableMap };
    newMap["YOUR NAME"] = address.name;
    newMap["YOUR ADDRESS"] = formattedAddress;
    setVariableMap(newMap);
  };

  let newBodyText = template.template;

  console.log(variableMap);

  _.forEach(variableMap, (value, key) => {
    newBodyText = newBodyText.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });

  console.log(newBodyText);

  return (
      <Container>
        <MyAddressInput updateAddress={updateAddress} />

        <Inputs inputs={variables} updateField={updateField} />
        <Row>
          {/* <Form.Control as="textarea" value={bodyText} /> */}
          {newBodyText}
        </Row>

        <Addresses addresses={template.addresses} onAddressSelected={onAddressSelected} />

        <CheckoutForm 
          checkedAddresses={checkedAddresses}
          myAddress={myAddress}
          body={newBodyText}
        />
      </Container>
  );
}

export default PostcardForm;
