import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, InputGroup } from "react-bootstrap";
import "./SearchFilter.scss";

const SearchFilter = ({ value, setText }: any) => {
  return (
    <div className="mt-2">
      <InputGroup>
        <InputGroup.Text className="search-icon-label">
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          value={value}
          type="text"
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Search"
          className="search-input"
        />
        <InputGroup.Text
          onClick={() => setText("")}
          className="search-clear-btn"
        >
          <FontAwesomeIcon icon={faTimes} />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default SearchFilter;
