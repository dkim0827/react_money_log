import React, { useState, useEffect } from "react";
import { User } from "../../api";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { Logo, Spinner } from "../../components";
import "./UserEdit.css";

const UserEdit = props => {
  const [errors, setErrors] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(props.currentUser);

  const updateUser = event => {
    event.preventDefault();
    const { currentTarget } = event;
    const fd = new FormData(currentTarget);

    const updatedUser = {
      first_name: fd.get("first_name"),
      last_name: fd.get("last_name"),
      email: fd.get("email")
    };

    console.log("updatedData: ", updatedUser);
    User.update(props.match.params.id, updatedUser).then(response => {
      if (response.status === 404) {
        setErrors([]);
        setErrors(response.errors);
      } else {
        setErrors([]);
        setCurrentUser(fd);
        props.onUserEdit();
        props.history.push("/users/:id/edit");
      }
    });
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
        <Form size="large" onSubmit={updateUser}>
          <Segment>
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
              defaultValue={props.currentUser.first_name}
            />
            <Form.Input
              fluid
              type="text"
              name="last_name"
              defaultValue={props.currentUser.last_name}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              type="email"
              name="email"
              defaultValue={props.currentUser.email}
              required
            />
            <Button color="teal" fluid size="large" type="submit">
              Update Profile
            </Button>
            <Button
              className="UserEdit__passbutton"
              color="teal"
              fluid
              size="large"
              onClick={() => {
                props.history.push(`/users/${currentUser.id}/edit/password`);
              }}
            >
              Change Password
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default UserEdit;
