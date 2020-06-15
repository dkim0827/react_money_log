import "./HomeBefore.css";
import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import "./HomeBefore.css";

const HomeBefore = props => {
  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh" }}
      verticalAlign="middle"
      className="HomeBefore__background"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Grid.Row>
          <h1 className="HomeBefore__title">Money.log(&nbsp;&nbsp;)</h1>
          <h5 className="HomeBefore__subtitle">
            P E R S O N A L &nbsp;&nbsp;&nbsp;A C C O U N T I N G
            &nbsp;&nbsp;&nbsp;B O O K
          </h5>
          <h5 className="HomeBefore__body">"Drop by drop fills the tub."</h5>
          <br />
          <a
            className="HomeBefore__button"
            onClick={() => props.history.push("/sign_in")}
          >
            Start
          </a>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default HomeBefore;
