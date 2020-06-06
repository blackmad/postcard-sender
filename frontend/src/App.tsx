import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavItem from "react-bootstrap/NavItem";

import Create from "./Create";
import PostcardForm from "./PostcardForm";
import Login from "./Login";
import Success from "./Success";

import About from "./About";
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";

function Cards() {
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:cardId`}>
        <Card />
      </Route>
    </Switch>
  );
}

function Card() {
  let { cardId } = useParams();
  return <PostcardForm mailId={cardId} />;
}

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Post-to-Pol</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create">
              <Nav.Link>Create Campaign</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/card">
          <Cards />
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/success">
          <Success />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
