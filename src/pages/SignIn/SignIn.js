import React, { useState } from "react";
import { Session } from "../../api";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { Logo } from "../../components";
import "./SignIn.css";

const SignIn = props => {
  const [errors, setErrors] = useState([]);

  const createSession = event => {
    event.preventDefault();
    const { currentTarget: form } = event;
    const fd = new FormData(form);

    Session.create({
      email: fd.get("email"),
      password: fd.get("password")
    }).then(response => {
      if (response.status === 404) {
        setErrors(response.errors);
      } else {
        props.history.push("/");
        if (typeof props.onSignIn === "function") {
          props.onSignIn();
        }
      }
    });
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column className="SignIn__template" style={{ maxWidth: 450 }}>
        <Grid.Row>
          <Logo onLogoClick={() => props.history.push("/")} />
        </Grid.Row>
        <br />
        <Form size="large" onSubmit={createSession}>
          <Segment stacked>
            <Header
              as="h2"
              color="teal"
              textAlign="center"
              className="signInHeader"
            >
              {/* <Grid.Row>Log-in to your account</Grid.Row> */}
            </Header>
            {errors.length > 0 ? (
              <div className="ui negative message">
                <div className="header">There was a problem</div>
                <p>{errors.join(", ")}</p>
              </div>
            ) : (
              ""
            )}
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              type="email"
              name="email"
              placeholder="E-mail address"
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              required
            />
            <Button color="teal" fluid size="large" type="submit">
              Sign-In
            </Button>
          </Segment>
        </Form>
        <Message>
          New to MoneyLog?&nbsp;
          <a
            className="link"
            onClick={() => {
              props.history.push("/sign_up");
            }}
          >
            Sign-Up
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default SignIn;
