import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast, ToastContainer } from "react-bootstrap";

export const SuccessToast = ({
  show,
  onClose,
  text = "Short Link Successfully Copied!",
}: any) => {
  return (
    <ToastContainer position={"bottom-end"}>
      <Toast show={show} onClose={onClose} autohide delay={2000} bg={"success"}>
        <Toast.Header className="w-100 d-flex justify-content-between">
          <div className="w-100 d-flex justify-content-start align-items-center">
            <FontAwesomeIcon icon={faCheck} className="me-1" />{" "}
            <span>{text}</span>
          </div>
        </Toast.Header>
      </Toast>
    </ToastContainer>
  );
};

export default SuccessToast;
