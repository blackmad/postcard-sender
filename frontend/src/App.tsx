import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { QueryParamProvider } from "use-query-params";
import { useQueryParam, StringParam } from "use-query-params";

import Create from "./Create";
import PostcardForm from "./PostcardForm";
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

function AdhocCard() {
  console.log(window.location.search);
  const [body, _setBody] = useQueryParam("body", StringParam);
  console.log({ body });
  return <PostcardForm templateBody={body || ""} />;
}

function App() {
  return (
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Mail Your Rep</Navbar.Brand>
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
          <Route path="/send">
            <AdhocCard />
          </Route>
          <Route path="/success">
            <Success />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </QueryParamProvider>
    </Router>
  );
}

export default App;
