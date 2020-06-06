import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

import PostcardForm from './PostcardForm';
import About from './About';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  return <PostcardForm mailId={cardId} />
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/card">
            <Cards />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
