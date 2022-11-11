import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { LayoutContext } from "../../../context/LayoutContext";
import ButtonChoices from "../../ButtonChoices/ButtonChoices";
import FieldComponents from "./FieldComponents/FieldComponents";

export interface ShortURLForm {
  originalURL: string;
  alias?: string;
  userID?: string;
  expiration?: string;
}

const ShortURLResultsForm = ({
  postShortenLink,
  alreadyGeneratedShortLink,
  setAlreadyGeneratedShortLink,
}: any) => {
  const { showHistoryCanvas } = React.useContext(LayoutContext);

  const url: any = postShortenLink?.data?.data || alreadyGeneratedShortLink;
  const { originalURL, alias, userID, expiration } = url;
  const _initialValues: ShortURLForm = {
    originalURL: originalURL,
    alias: alias,
    userID: userID,
    expiration: expiration,
  };

  return (
    <>
      <Formik initialValues={_initialValues} onSubmit={() => {}}>
        {(fk) => (
          <Form onSubmit={fk.handleSubmit} className="create-short-urlform-ctr">
            <>
              <FieldComponents.OriginalURL />
              <FieldComponents.ShortenedURL />
              <ButtonChoices url={url} />
              <div className="d-flex justify-content-center">
                <Button onClick={showHistoryCanvas} className="me-1">
                  <FontAwesomeIcon icon={faLink} className="me-1" />
                  Check URL History
                </Button>
                <Button
                  className="ms-1"
                  onClick={() => {
                    postShortenLink && postShortenLink?.reset();
                    setAlreadyGeneratedShortLink &&
                      setAlreadyGeneratedShortLink(null);
                  }}
                >
                  Shorten Another?
                </Button>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ShortURLResultsForm;
