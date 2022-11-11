import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import React from "react";
import {
  Button,
  Form,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { DEFAULT_DELAY } from "../../../../common/constants/constants";
import { LocalStorageKeys } from "../../../../common/types/types";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import ErrorToast from "../../../ErrorToast/ErrorToast";
import "./CreateShortURLForm.scss";
import FieldComponents from "./FieldComponents/FieldComponents";
import { createShortURLFormSchema } from "./schema";

export interface ShortURLForm {
  originalURL: string;
  alias?: string;
  userID?: string;
  expiration?: string;
}

const CreateShortURLForm = ({
  postShortenLink,
  aggregatedHistory,
  setAlreadyGeneratedShortLink,
}: any) => {
  const [showErrorMessageToast, setShowErrorMessageToast] =
    React.useState<boolean>(false);
  const [serverErrorMessages, setServerErrorMessages] = React.useState<any>({});
  const [, setCookiesAccepted] = useLocalStorage(
    LocalStorageKeys.COOKIES_ACCEPTED,
    false
  );

  const _initialValues: ShortURLForm = {
    originalURL: "",
    alias: "",
    userID: "",
    expiration: "",
  };

  const turnEmptyStringsToNullValues = (body: any) => {
    return Object.keys(body).reduce((accumulator: any, key: string) => {
      return body[key as keyof ShortURLForm] === ""
        ? { ...accumulator, [key]: null }
        : { ...accumulator, [key]: body[key as keyof ShortURLForm] };
    }, {});
  };

  const handleSubmit = (body: ShortURLForm) => {
    setCookiesAccepted(true);
    const _body: any = turnEmptyStringsToNullValues(body);

    const alreadyGeneratedLink = aggregatedHistory?.find((h: any) => {
      return _body.originalURL === h.originalURL && !_body.alias;
    });

    if (alreadyGeneratedLink) {
      // No need to waste API calls if we already generated it...
      setAlreadyGeneratedShortLink(alreadyGeneratedLink);
    } else {
      postShortenLink.mutate(_body, {
        onError: (err: any) => {
          setServerErrorMessages(err.response.data.errors);
          setShowErrorMessageToast(true);
        },
      });
      setAlreadyGeneratedShortLink(null);
    }
  };

  const renderTooltip = (props: any, disabled: boolean) => {
    // Must return React Fragment instead of null otherwise application whites out
    if (!disabled) return <></>;
    return (
      <Tooltip {...props}>
        The form is invalid. Cannot Shorten URL until all fields are valid!
      </Tooltip>
    );
  };

  return (
    <>
      <Formik
        initialValues={_initialValues}
        onSubmit={handleSubmit}
        validationSchema={createShortURLFormSchema}
      >
        {(fk) => (
          <div className="create-short-urlform-ctr">
            <Form onSubmit={fk.handleSubmit}>
              <>
                <FieldComponents.OriginalURL />
                <FieldComponents.Alias
                  serverErrorMessage={serverErrorMessages?.alias}
                />
                <OverlayTrigger
                  placement="top"
                  delay={DEFAULT_DELAY}
                  overlay={(props) =>
                    renderTooltip(
                      props,
                      !fk.isValid || !fk.values.originalURL.length
                    )
                  }
                >
                  {/* OverlayTrigger cannot hover on disabled components so added <span> to allow for hover overlay */}
                  <span>
                    <Button
                      type="submit"
                      className="submit-btn px-4 py-2"
                      disabled={
                        !fk.isValid ||
                        !fk.values.originalURL.length ||
                        postShortenLink.isLoading
                      }
                    >
                      {postShortenLink.isLoading && (
                        <Spinner
                          as="span"
                          variant="light"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          animation="border"
                        />
                      )}
                      {!postShortenLink.isLoading && (
                        <FontAwesomeIcon icon={faWandMagicSparkles} />
                      )}
                      Make Link Shortened!
                    </Button>
                  </span>
                </OverlayTrigger>
              </>
            </Form>
            {/* Showing an error toast for UX */}
            <ErrorToast
              show={showErrorMessageToast}
              onClose={() => setShowErrorMessageToast(false)}
              text="Could not fetch a shortURL, Please try again"
            />
          </div>
        )}
      </Formik>
    </>
  );
};

export default CreateShortURLForm;
