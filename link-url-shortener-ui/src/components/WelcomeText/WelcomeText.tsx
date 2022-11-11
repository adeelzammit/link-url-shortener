import { APP_NAME } from "../../common/constants/constants";
import "./WelcomeText.scss";

const WelcomeText = () => {
  return (
    <div className="me-lg-5 pe-lg-5 welcome-text-ctr">
      <h1>
        Welcome to <br />
        <span className="brand-name-font">{APP_NAME}</span>
      </h1>
    </div>
  );
};

export default WelcomeText;
