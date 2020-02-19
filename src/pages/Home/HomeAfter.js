import "./HomeAfter.css";
import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import "./HomeAfter.css";

const HomeAfter = props => {
  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh" }}
      verticalAlign="middle"
      className="HomeAfter__background"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Grid.Row>
          <h1 className="HomeAfter__title">Money.log(&nbsp;&nbsp;)</h1>
          <h5 className="HomeAfter__subtitle">
            P E R S O N A L&nbsp;&nbsp;&nbsp;A C C O U N T I N G
            &nbsp;&nbsp;&nbsp;B O O K
          </h5>
          <h5 className="HomeAfter__body">"Drop by drop fills the tub."</h5>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default HomeAfter;
