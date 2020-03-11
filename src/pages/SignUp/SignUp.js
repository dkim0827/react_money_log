import React, { useState } from "react";
import { User } from "../../api";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import "./SignUp.css";
import { Logo } from "../../components";

const SignUp = props => {
  const [errors, setErrors] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    const { currentTarget: form } = event;
    const fd = new FormData(form);

    const newUser = {
      user: {
        first_name: fd.get("first_name"),
        last_name: fd.get("last_name"),
        email: fd.get("email"),
        password: fd.get("password"),
        password_confirmation: fd.get("password_confirmation")
      }
    };

    User.create(newUser).then(response => {
      if (response.id) {
        if (typeof props.onSignUp === "function") {
          props.onSignUp();
        }
        props.history.push("/");
      } else {
        setErrors(response.errors);
      }
    });
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column className="SignUp__template" style={{ maxWidth: 450 }}>
        <Grid.Row>
          <Logo onLogoClick={() => props.history.push("/")} />
        </Grid.Row>
        <br />
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Header
              as="h2"
              color="teal"
              textAlign="center"
              className="signInHeader"
            ></Header>
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
              type="text"
              name="first_name"
              placeholder="First Name"
            />
            <Form.Input
              fluid
              type="text"
              name="last_name"
              placeholder="Last Name"
            />
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
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password Again"
              type="password"
              name="password_confirmation"
              required
            />
            <Button color="teal" fluid size="large" type="submit">
              Sign-Up
            </Button>
          </Segment>
        </Form>
        <Message>
          Already have an account?&nbsp;
          <a
            className="link"
            onClick={() => {
              props.history.push("/sign_in");
            }}
          >
            Sign In
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default SignUp;
