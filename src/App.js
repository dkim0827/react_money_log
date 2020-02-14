import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomeBefore, SignIn, SignUp, UserEdit } from "./pages";
import { User, Session } from "./api";
import { NavBar } from "./components";

const App = () => {
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
          <header>
            <NavBar currentUser={currentUser} onSignOut={destroySession} />
          </header>
          <Switch>
            <Route
              path="/user_edit"
              render={routeProps => (
                <UserEdit {...routeProps} currentUser={currentUser} />
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
//     const { currentUser } = this.state;
//     if (!currentUser) {
//       return (
//         <BrowserRouter>
//           <Switch>
//             <Route exact path="/" component={HomeBefore} />
//             <Route
//               path="/sign_up"
//               render={routeProps => (
//                 <SignUp {...routeProps} onSignUp={this.getUser} />
//               )}
//             />
//             <Route
//               path="/sign_in"
//               render={routeProps => (
//                 <SignIn {...routeProps} onSignIn={this.getUser} />
//               )}
//             />
//           </Switch>
//         </BrowserRouter>
//       );
//     } else {
//       return (
//         <BrowserRouter>
// <header>
//   <NavBar
//     currentUser={this.state.currentUser}
//     onSignOut={this.destroySession}
//   />
// </header>
// <Switch>
//   <Route
//     path="/user_edit"
//     render={routeProps => (
//       <UserEdit
//         {...routeProps}
//         currentUser={this.state.currentUser}
//       />
//     )}
//   />
// </Switch>
// </BrowserRouter>
// );
//   }
// }
// }

export default App;
