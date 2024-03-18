"use client"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
         <Navbar.Brand href="/">CALENDAR VIEW</Navbar.Brand>
        <Navbar.Brand href="/dashboard">ADMIN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard/addAservice">Add a service</Nav.Link>
            <Nav.Link href="#link">general options</Nav.Link>
            <NavDropdown title="Listing" id="basic-nav-dropdown">
              <NavDropdown.Item href="/dashboard/getAllAppoitements">Appoitements</NavDropdown.Item>
              <NavDropdown.Item href="/dashboard/getAllServices">
                Services
              </NavDropdown.Item>
              <NavDropdown.Item href="/dashboard/users">users</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;