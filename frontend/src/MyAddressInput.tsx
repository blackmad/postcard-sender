import React, { useState, useEffect } from "react";

import * as _ from "lodash";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { Address } from "./types";

export default function MyAddressInput({ updateAddress }: { updateAddress: (a: Address) => void }) {
  const [myAddress, setMyAddress] = useState({} as Address);

  const setAddress = (address: Partial<Address>) => {
    const updatedAddress = { ...myAddress, ...address };
    setMyAddress(updatedAddress);
    updateAddress(updatedAddress);
  };

  return (
    <>
      <Form.Group className="row">
        <Form.Label>Your Address</Form.Label>
        <Form.Control
          placeholder="Your Name"
          type="text"
          name="name"
          onChange={(e) =>
            setAddress({
              name: e.target.value,
            })
          }
        />
      </Form.Group>

      <Form.Group className="row">
        {/* <Form.Label>Your Address</Form.Label> */}
        <Form.Control
          placeholder="123 Main St"
          type="text"
          name="address"
          onChange={(e) =>
            setAddress({
              address_line1: e.target.value,
            })
          }
        />
      </Form.Group>

      <Form.Group className="row">
        {/* <Form.Label>Your City</Form.Label> */}
        <Form.Control
          className="col-5"
          placeholder="City"
          type="text"
          name="city"
          onChange={(e) =>
            setAddress({
              address_city: e.target.value,
            })
          }
        />

        <Form.Control
          className="col-2"
          placeholder="State"
          type="text"
          name="state"
          onChange={(e) =>
            setAddress({
              address_state: e.target.value,
            })
          }
        />

        <Form.Control
          className="col-5"
          placeholder="Zipcode"
          type="text"
          name="zip"
          onChange={(e) =>
            setAddress({
              address_zip: e.target.value,
            })
          }
        />
      </Form.Group>
    </>
  );
}
