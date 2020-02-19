import React from "react";
import { NavLink, useHistory } from "react-router-dom";

const NavBar = ({ currentUser, onSignOut }) => {
  let history = useHistory();

  const handleSignOutClick = event => {
    event.preventDefault();
    if (typeof onSignOut === "function") {
      onSignOut();
      history.push("/");
    }
  };
  return (
    <div className="ui secondary pointing menu">
      <NavLink exact to="/" className="item">
        Home
      </NavLink>
      <NavLink exact to="/about" className="item">
        About Us
      </NavLink>
      <NavLink exact to="/statements" className="item">
        Statements
      </NavLink>
      <div className="right menu">
        {currentUser && (
          <>
            <div className="item">
              Hello,{" "}
              <NavLink exact to={`/users/${currentUser.id}/edit/`}>
                {currentUser.first_name + " " + currentUser.last_name}
              </NavLink>
            </div>
            <button
              className="ui inverted red button"
              onClick={handleSignOutClick}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
