import React, { useState, useEffect } from "react";

import * as _ from "lodash";

import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import "./App.css";

import { Template, Address, GoogleCivicRepsResponse } from "./types";
import CheckoutForm from "./CheckoutForm";
import MyAddressInput from "./MyAddressInput";
import { templatesCollection } from "./firebase";

const SpecialVars = ["YOUR NAME", "YOUR ADDRESS"];

function parseVars(template: string) {
  const match = template.match(/\[[^\]]+\]/g);
  return _.uniq(match?.map((s) => s.replace("[", "").replace("]", ""))).filter(
    (v) => !SpecialVars.includes(v)
  );
}

const addressToSingleLine = (address: Address): string => {
  const cityStateLine = [address.address_city, address.address_state, address.address_zip]
    .filter((a) => Boolean(a))
    .join(" ");
  const formattedAddress = [address.address_line1, address.address_line2, cityStateLine]
    .filter((l) => Boolean(l) && l !== "" && l !== " ")
    .join(", ");
  return formattedAddress;
};

type OfficialAddress = {
  officeName: string;
  address: Address;
};

const mungeReps = (reps: GoogleCivicRepsResponse): OfficialAddress[] => {
  if (!reps.offices) {
    return [];
  }

  const offices = reps.offices.filter((office) => {
    const isPresidenty =
      office.levels.includes("country") &&
      (office.roles.includes("headOfState") ||
        office.roles.includes("headOfGovernment") ||
        office.roles.includes("deputyHeadOfGovernment"));
    return !isPresidenty;
  });

  return _.flatMap(offices, (office) => {
    return office.officialIndices
      .map((officialIndex) => {
        console.log("looking for", officialIndex, "in", office);
        const official = reps.officials[officialIndex];
        console.log({ official });
        if (!official.address || official.address.length === 0) {
          return undefined;
        }
        const address = official.address[0];
        return {
          address: {
            name: official.name,
            address_line1: address.line1,
            address_line2: [address.line2, address.line3].join(" "),
            address_city: address.city,
            address_state: address.state,
            address_zip: address.zip,
            address_country: "US",
          },
          officeName: office.name,
        };
      })
      .filter((a) => a !== undefined) as OfficialAddress[];
  });
};

function Addresses({
  // addresses,
  onAddressSelected,
  reps,
}: {
  // addresses: Address[];
  reps: GoogleCivicRepsResponse;
  onAddressSelected: (b: boolean, c: Address) => void;
}) {
  const officialAddresses = mungeReps(reps);
  console.log(officialAddresses);

  return (
    <>
      {officialAddresses?.map((officialAddress) => {
        const address = officialAddress.address;
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onAddressSelected(event.target.checked, address);
        };
        return (
          <Row key={address.name}>
            <Form.Group controlId={address.name}>
              <Form.Check
                type="checkbox"
                label={
                  <>
                    <b>{address.name}</b> ({officialAddress.officeName}),{" "}
                    {addressToSingleLine(address)}
                  </>
                }
                onChange={onChange}
              />
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
            <Form.Label>{_.startCase(_.toLower(input))}</Form.Label>
            <Form.Control type="text" onChange={onChange} />
          </Form.Group>
        );
      })}
    </>
  );
}

interface Props {
  mailId?: string;
  templateBody?: string;
}

function PostcardForm({ mailId, templateBody }: Props) {
  const [template, setTemplate] = useState({} as Template);
  const [myAddress, setMyAddress] = useState({} as Address);
  const [variables, setVariables] = useState([] as string[]);
  const [variableMap, setVariableMap] = useState({} as Record<string, string>);
  const [checkedAddresses, setCheckedAddresses] = useState([] as Address[]);
  const [reps, setReps] = useState({} as GoogleCivicRepsResponse);

  const setTemplateAndVars = (template: Template) => {
    setTemplate(template);

    let variableKeys = parseVars(template.template) || [];
    const emailKey = _.find(variableKeys, (v) => v.toLocaleLowerCase().includes("email"));

    if (!emailKey) {
      variableKeys = [...variableKeys, "YOUR EMAIL"];
    }

    setVariables(variableKeys);
  };

  useEffect(() => {
    if (mailId) {
      templatesCollection
        .doc(mailId)
        .get()
        .then((value) => {
          const template = (value.data() as unknown) as Template;
          setTemplateAndVars(template);
        });
    }
  }, [mailId]);

  useEffect(() => {
    if (templateBody) {
      setTemplateAndVars({
        template: templateBody,
        addresses: [],
        name: "",
        id: "",
      } as Template);
    }
  }, [templateBody]);

  useEffect(() => {
    if (
      !myAddress.address_city ||
      !myAddress.address_line1 ||
      !myAddress.address_state ||
      !myAddress.address_zip
    ) {
      return;
    }

    console.log("searching reps for", addressToSingleLine(myAddress));

    const params = new URLSearchParams({
      address: addressToSingleLine(myAddress),
    }).toString();

    fetch("https://us-central1-political-postcards.cloudfunctions.net/api/findReps?" + params).then(
      (res) => {
        res.json().then((data) => setReps(data as GoogleCivicRepsResponse));
      }
    );
  }, [myAddress]);

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

    const newMap = { ...variableMap };
    newMap["YOUR NAME"] = address.name;
    newMap["YOUR ADDRESS"] = addressToSingleLine(address);
    setVariableMap(newMap);
  };

  let newBodyText = template.template;

  console.log(variableMap);

  _.forEach(variableMap, (value, key) => {
    newBodyText = newBodyText.replace(new RegExp(`\\[${key}\\]`, "g"), value);
  });

  const hasAllKeys = _.difference([...variables, ...SpecialVars], _.keys(variableMap)).length === 0;

  console.log(newBodyText);

  if (!template) {
    return <Container className="pt-5">Loading ...</Container>;
  }

  const emailKey = _.find(variables, (v) => v.toLocaleLowerCase().includes("email"));
  const email = variableMap[emailKey!];

  return (
    <Container className="pt-5">

  { window.location.host !== 'mail-your-rep-dev.web.app' && <Alert variant='danger'>TEST MODE</Alert> }
      <MyAddressInput updateAddress={updateAddress} />

      <Inputs inputs={variables} updateField={updateField} />
      <Row>
        {/* <Form.Control as="textarea" value={bodyText} /> */}
        <div
          style={{
            padding: "10px",
            background: "cornsilk",
            margin: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {newBodyText}
        </div>
      </Row>

      <Addresses reps={reps} onAddressSelected={onAddressSelected} />

      <CheckoutForm
        checkedAddresses={checkedAddresses}
        myAddress={myAddress}
        body={newBodyText}
        formValid={hasAllKeys}
        email={email}
        variables={variableMap}
      />
    </Container>
  );
}

export default PostcardForm;
