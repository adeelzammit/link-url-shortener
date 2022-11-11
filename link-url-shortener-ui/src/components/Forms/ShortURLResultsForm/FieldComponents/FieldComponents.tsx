import { faBullseye, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Form } from "react-bootstrap";
import CommonFieldComponents from "../../CommonFieldComponents/CommonFieldComponents";

const FieldComponents = {
  OriginalURL: React.memo(() => {
    return (
      <CommonFieldComponents.TextInput
        name="originalURL"
        controlId="originalURL"
        label={
          <>
            <FontAwesomeIcon icon={faLink} />
            Long URL
          </>
        }
        disabled
      />
    );
  }),
  ShortenedURL: React.memo(() => {
    return (
      <>
        <Form.Group className="mb-3" controlId={"alias"}>
          <Form.Label>
            <>
              <FontAwesomeIcon icon={faBullseye} />
              Shortened URL
            </>
          </Form.Label>
          <CommonFieldComponents.TextOnlyInput name="alias" disabled />
        </Form.Group>
      </>
    );
  }),
};

export default FieldComponents;
