import React, { useState, useEffect } from "react";
import { User } from "../../api";
import { Button, Form, Grid, Segment, Message } from "semantic-ui-react";
import { Logo, Spinner } from "../../components";
import "./PasswordEdit.css";

const PasswordEdit = props => {
  const [errors, setErrors] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(props.currentUser);

  const handleDelete = () => {
    User.destroy(props.match.params.id).then(response => {
      if (response.status === 200) {
        setErrors([]);
        props.onPasswordEdit();
        props.history.push("/");
      }
    });
  };

  const changePassword = event => {
    event.preventDefault();
    const { currentTarget } = event;
    const fd = new FormData(currentTarget);

    const updatedPassword = {
      password: fd.get("password"),
      new_password: fd.get("new_password"),
      new_password_confirmation: fd.get("new_password_confirmation")
    };

    console.log("updatedData: ", updatedPassword);
    User.password_update(props.match.params.id, updatedPassword).then(
      response => {
        if (response.status === 404) {
          setErrors([]);
          setErrors(response.errors);
        } else {
          setErrors([]);
          setCurrentUser(fd);
          props.onPasswordEdit();
          props.history.push("/sign_in");
        }
      }
    );
  };

  useEffect(() => {
    User.current(props.match.params.id).then(user => {
      setCurrentUser(user);
      setIsLoading(false);
    });
  }, [props.match.params.id]);

  if (isLoading) {
    return <Spinner message="Loading" />;
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column className="UserEdit__template" style={{ maxWidth: 450 }}>
        <Grid.Row>
          <Logo onLogoClick={() => props.history.push("/")} />
        </Grid.Row>
        <br />
        <Segment>
          <Form size="large" onSubmit={changePassword}>
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
              icon="lock"
              iconPosition="left"
              placeholder="Current Password"
              type="password"
              name="password"
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="New Password"
              type="password"
              name="new_password"
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="New Password Again"
              type="password"
              name="new_password_confirmation"
              required
            />
            <Button color="teal" fluid size="large" type="submit">
              Change Password
            </Button>
          </Form>
          <Message>
            By deleting an account, you will be no longer to access your
            information. If agree press "Delete Account"
          </Message>
          <Button
            className="UserEdit__passbutton"
            color="teal"
            fluid
            size="large"
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default PasswordEdit;
