import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faBullseye } from "@fortawesome/free-solid-svg-icons";
import CommonFieldComponents from "../../../CommonFieldComponents/CommonFieldComponents";

const FieldComponents = {
  OriginalURL: React.memo(() => {
    return (
      <CommonFieldComponents.TextInput
        name="originalURL"
        controlId="originalURL"
        label={
          <>
            <FontAwesomeIcon icon={faLink} />
            Long URL <span className="required-field-span">*</span>
          </>
        }
        placeholder="Place Long URL here..."
      />
    );
  }),
  Alias: React.memo(({ serverErrorMessage }: any) => {
    return (
      <>
        <CommonFieldComponents.TextInput
          name="alias"
          controlId="alias"
          label={
            <>
              <FontAwesomeIcon icon={faBullseye} />
              Target URL Name
            </>
          }
          placeholder="Place Target URL name here..."
          serverError={serverErrorMessage}
        />
      </>
    );
  }),
};

export default FieldComponents;
