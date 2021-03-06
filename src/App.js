import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import {
  HomeBefore,
  SignIn,
  SignUp,
  UserEdit,
  HomeAfter,
  PasswordEdit,
  StatementShow,
  StatementAll
} from "./pages";
import { User, Session } from "./api";
import { NavBar, Spinner } from "./components";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const App = props => {
  const [currentUser, setCurrentUser] = useState(null);

  const getUser = useCallback(() => {
    User.current().then(data => {
      if (typeof data.id !== "number") {
        setCurrentUser(null);
      } else {
        setCurrentUser(data);
      }
    });
  }, []);

  const destroySession = () => {
    Session.destroy().then(setCurrentUser(null));
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <BrowserRouter>
      {currentUser ? (
        <>
          {/* <header>
            <NavBar currentUser={currentUser} onSignOut={destroySession} />
          </header> */}
          <NavBar currentUser={currentUser} onSignOut={destroySession}></NavBar>
          <Switch>
            <Route exact path="/" component={HomeAfter} />
            <Route exact path="/statements" component={StatementAll} />
            <Route exact path="/statements/:id" component={StatementShow} />
            <Route
              exact
              path="/users/:id/edit/"
              render={routeProps => (
                <UserEdit
                  {...routeProps}
                  onUserEdit={getUser}
                  currentUser={currentUser}
                />
              )}
            />
            <Route
              exact
              path="/users/:id/edit/password"
              render={routeProps => (
                <PasswordEdit
                  {...routeProps}
                  onPasswordEdit={(getUser, destroySession)}
                  currentUser={currentUser}
                />
              )}
            />
          </Switch>
        </>
      ) : (
        <Switch>
          <Route exact path="/" component={HomeBefore} />
          <Route
            path="/sign_up"
            render={routeProps => <SignUp {...routeProps} onSignUp={getUser} />}
          />
          <Route
            path="/sign_in"
            render={routeProps => <SignIn {...routeProps} onSignIn={getUser} />}
          />
        </Switch>
      )}
    </BrowserRouter>
  );
};

export default App;
