import { faCopy, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import ErrorToast from "../ErrorToast/ErrorToast";
import OverlayButton from "../OverlayButton/OverlayButton";
import SuccessToast from "../SuccessToast/SuccessToast";
import "./ButtonChoices.scss";

const ButtonChoices = ({ url }: any) => {
  const [showCopyToast, setShowCopyToast] = React.useState(false);
  const [showCopyErrorToast, setShowCopyErrorToast] = React.useState(false);
  const redirectAction = () => {
    window.open(url.alias, "_blank");
  };
  const copyToClipboardAction = () => {
    // Azure cannot copy from clipboard normally so must be done like this
    const unsecuredCopyToClipboard = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Unable to copy to clipboard", err);
        setShowCopyErrorToast(true);
      }
      document.body.removeChild(textArea);
      setShowCopyToast(true);
    };

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(url.alias);
      setShowCopyToast(true);
    } else {
      unsecuredCopyToClipboard(url.alias);
    }
  };

  return (
    <>
      <SuccessToast
        show={showCopyToast}
        onClose={() => setShowCopyToast(false)}
      />
      <ErrorToast
        show={showCopyErrorToast}
        onClose={() => setShowCopyErrorToast(false)}
      />
      <div className="button-choices-ctr">
        <OverlayButton
          onClick={redirectAction}
          tooltipContent="Visit URL"
          icon={faExternalLink}
        />
        <OverlayButton
          onClick={copyToClipboardAction}
          tooltipContent="Copy to Clipboard"
          icon={faCopy}
          buttonText="Copy"
        />
      </div>
      <hr />
    </>
  );
};

export default ButtonChoices;
