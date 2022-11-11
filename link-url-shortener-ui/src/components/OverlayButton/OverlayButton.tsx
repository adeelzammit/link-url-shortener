import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { DEFAULT_DELAY } from "../../common/constants/constants";

const OverlayButton = ({
  placement = "top",
  tooltipContent,
  icon,
  buttonText,
  onClick = () => {},
}: any) => {
  const renderTooltip = (props: any) => (
    <Tooltip {...props}>{tooltipContent}</Tooltip>
  );
  return (
    <OverlayTrigger
      placement={placement}
      delay={DEFAULT_DELAY}
      overlay={renderTooltip}
    >
      <Button className="mx-1" onClick={onClick}>
        {icon && <FontAwesomeIcon icon={icon} />} {buttonText}
      </Button>
    </OverlayTrigger>
  );
};

export default OverlayButton;
