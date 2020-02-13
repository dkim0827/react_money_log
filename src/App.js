import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomeBefore, SignIn, SignUp } from "./pages";
import { User, Session } from "./api";
import { NavBar } from "./components";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
  }

  getUser = () => {
    User.current().then(data => {
      if (typeof data.id !== "number") {
        this.setState({ currentUser: null });
      } else {
        this.setState({ currentUser: data });
      }
    });
  };

  destroySession = () => {
    Session.destroy().then(this.setState({ currentUser: null }));
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    const { currentUser } = this.state;
    if (!currentUser) {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomeBefore} />
            <Route
              path="/sign_up"
              render={routeProps => (
                <SignUp {...routeProps} onSignUp={this.getUser} />
              )}
            />
            <Route
              path="/sign_in"
              render={routeProps => (
                <SignIn {...routeProps} onSignIn={this.getUser} />
              )}
            />
          </Switch>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <header>
            <NavBar
              currentUser={this.state.currentUser}
              onSignOut={this.destroySession}
            />
          </header>
          <Switch></Switch>
        </BrowserRouter>
      );
    }
  }
}

export default App;
