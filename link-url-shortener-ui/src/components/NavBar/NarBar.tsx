import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { APP_NAME } from "../../common/constants/constants";
import { LayoutContext } from "../../context/LayoutContext";
import ThemeButton from "../ThemeButton/ThemeButton";
import "./NavBar.scss";

const NavBar = () => {
  const { showHistoryCanvas } = React.useContext(LayoutContext);

  return (
    <Navbar bg="primary" expand="md" className="app-navbtr-ctr">
      <Container fluid>
        <Navbar.Brand className="brand-name-font brand-name-font-link">
          <Nav.Link>{APP_NAME}</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-options">
          <Nav.Item className="d-flex justify-content-center">
            <div className="nav-item-choice">
              <ThemeButton />
            </div>
            <Nav.Link className="nav-item-choice" onClick={showHistoryCanvas}>
              URL History
            </Nav.Link>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
