import React from "react";

const Spinner = props => {
  return (
    <div className="ui segment" style={{ minHeight: "100vh" }}>
      <div className="ui active inverted dimmer">
        <div className="ui text loader">{props.message}</div>
      </div>
    </div>
  );
};

export default Spinner;
