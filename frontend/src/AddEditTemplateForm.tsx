import React, { useState, useRef } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Address } from "./types";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import { addressToSingleLine } from "./utils";

const placeholder = `My name is [YOUR NAME] and I am a resident of [BOROUGH]. Last April, NYC Mayor Bill De Blasio proposed major budget cuts for the Fiscal Year 2021, especially to education and youth programs, while refusing to slash the NYPD budget by any significant margin.

I am emailing today to demand that you vote no on the Mayor’s FY21 proposed budget. Furthermore, I urge you ONLY to vote for a budget that includes AT LEAST $1 billion in cuts to the NYPD with equal reallocation towards social services and education programs, effective at the beginning of FY21, July 1, 2020.

Governor Cuomo has doubled the presence of the NYPD on New York City streets. I am asking that city officials lobby the same amount of attention and effort towards finding sustainable, longterm change.`;

const PlacesAutocomplete = ({ addressSelected }: { addressSelected: (a: Address) => void }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect = async (val: any) => {
    console.log({ val });

    // 52 Ten Eyck Street, Brooklyn, NY, USA
    const [address_line1, address_city, address_state, address_country] = val.split(", ");

    // Get latitude and longitude via utility functions
    const results = await getGeocode({ address: val });
    const result = results[0];

    const address_zip =
      result.address_components.find((c) => c.types.includes("postal_code"))?.long_name || "XXXXX";

    const address: Address = {
      name: "",
      address_line1,
      address_city,
      address_state,
      address_country,
      address_zip,
    };

    addressSelected(address);
    setValue(val);
  };

  console.log({ status, data });

  return (
    <Combobox onSelect={handleSelect} aria-labelledby="demo">
      <ComboboxInput className="form-control" value={value} onChange={handleInput} disabled={!ready} placeholder="Representative's Address" />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

function AddEditTemplateForm() {
  const [addresses, setAddresses] = useState([] as Address[]);
  const [currentAddress, setCurrentAddress] = useState({} as Address);
  const [addressError, setAddressError] = useState("");
  const currentNameInput = useRef(undefined as unknown as HTMLInputElement);

  const addAddress = () => {
    const currentName = currentNameInput?.current?.value;
    console.log({currentAddress, currentName});
    if (!currentAddress || !currentName) {
      setAddressError('missing name or address');
      return;
    }
    addresses.push({
      ...currentAddress,
      name: currentName,
    });
    setAddresses(addresses);
    if (currentNameInput.current) {
      currentNameInput.current.value = '';
    }
    setCurrentAddress({} as Address);
  };

  const addressSelected = (address: Address) => {
    console.log({ address });
  };

  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Template Body</Form.Label>
        <Form.Control as="textarea" rows={20} placeholder={placeholder} />
        <Form.Text className="text-muted">
          Enter variables you want the user to enter like so: [BOROUGH], [YOUR NAME], [OTHER
          VARIABLE]
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>

      <Form.Group controlId="formAddresses">
        <Form.Label>Addresses</Form.Label>
        {addresses.map((address) => (
          <>
            <b>{address.name}</b> {addressToSingleLine(address)}
          </>
        ))}
        <Form.Control placeholder="Representative's Name" ref={currentNameInput}/>
        <PlacesAutocomplete addressSelected={addressSelected} />
        {addressError && <Alert variant='danger'>{addressError}</Alert>}
        <Button onClick={addAddress} variant="secondary">Add Address</Button>
      </Form.Group>
    </Form>
  );
}

export default AddEditTemplateForm;
