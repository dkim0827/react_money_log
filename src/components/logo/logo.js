import React from "react";
import { Route } from "react-router-dom";
import { Image } from "semantic-ui-react";
import LogoImage from "./logo.png";
import "./Logo.css";

const Logo = props => {
  return (
    <Image
      src={LogoImage}
      centered
      className="logo"
      onClick={props.onLogoClick}
    />
  );
};

export default Logo;
