// import React, { useState, useEffect } from "react";
// import { User } from "../../api";
// import {
//   Button,
//   Form,
//   Grid,
//   Header,
//   Message,
//   Segment
// } from "semantic-ui-react";
// import "./UserEdit.css";
// import { Logo } from "../../components";

// const UserEdit = props => {
//   const [errors, setErrors] = useState([]);
//   const [user, setUser] = useState(props.currentUser);

//   //   useEffect(user => {
//   //     props.onUserEdit(user).then(user => {
//   //       setUser(user);
//   //     });
//   //   }, []);

//   const handleChangeUser = (inputName = event => {
//     if (inputName === "first_name") {
//       setUser({ ...user, first_name: event.target.value });
//     }
//   });

//   const handleSubmit = event => {
//     event.preventDefault();
//     const { currentTarget: form } = event;
//     const fd = new FormData(form);

//     const User = {
//       first_name: fd.get("first_name"),
//       last_name: fd.get("last_name"),
//       email: fd.get("email")
//     };

//     User.update(User).then(response => {
//       if (response.id) {
//         if (typeof props.onUserEdit === "function") {
//           props.onUserEdit();
//         }
//         props.history.push("/user_edit");
//       } else {
//         setErrors(response.errors);
//       }
//     });
//   };

//   return (
//     <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
//       <Grid.Column style={{ maxWidth: 450 }}>
//         <Grid.Row>
//           <Logo onLogoClick={() => props.history.push("/")} />
//         </Grid.Row>
//         <br />
//         <Form size="large" onSubmit={handleSubmit}>
//           <Segment stacked>
//             <Header
//               as="h2"
//               color="teal"
//               textAlign="center"
//               className="signInHeader"
//             ></Header>
//             {errors.length > 0 ? (
//               <div className="ui negative message">
//                 <div className="header">There was a problem</div>
//                 <p>{errors.join(", ")}</p>
//               </div>
//             ) : (
//               ""
//             )}
//             <Form.Input
//               fluid
//               value={user.first_name}
//               onChange={() => handleChangeUser("first_name")}
//               type="text"
//               name="first_name"
//               placeholder="First Name"
//             />
//             <Form.Input
//               fluid
//               type="text"
//               name="last_name"
//               placeholder="Last Name"
//             />
//             <Form.Input
//               fluid
//               icon="user"
//               iconPosition="left"
//               type="email"
//               name="email"
//               placeholder="E-mail address"
//               required
//             />
//             <Button color="teal" fluid size="large" type="submit">
//               Edit Profile
//             </Button>
//           </Segment>
//         </Form>
//         <Message>
//           <Button
//             color="teal"
//             fluid
//             size="large"
//             onClick={() => {
//               props.history.push("sign_in");
//             }}
//           >
//             Change Password
//           </Button>
//         </Message>
//       </Grid.Column>
//     </Grid>
//   );
// };

// export default UserEdit;
