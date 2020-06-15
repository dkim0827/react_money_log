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

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

// import {
//   Container,
//   Grid,
//   Header,
//   Icon,
//   Image,
//   Item,
//   Label,
//   Menu,
//   Segment,
//   Step,
//   Table
// } from "semantic-ui-react";

// const useStyles = makeStyles({
//   list: {
//     width: 250,
//   },
//   fullList: {
//     width: 'auto',
//   },
// });

// export default function NavBar() {
//   const classes = useStyles();
//   const [state, setState] = React.useState({
//     top: false,
//     left: false,
//     bottom: false,
//     right: false,
//   });

//   const toggleDrawer = (side, open) => event => {
//     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//       return;
//     }

//     setState({ ...state, [side]: open });
//   };

//   const sideList = side => (
//     <div
//       className={classes.list}
//       role="presentation"
//       onClick={toggleDrawer(side, false)}
//       onKeyDown={toggleDrawer(side, false)}
//     >
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   const fullList = side => (
//     <div
//       className={classes.fullList}
//       role="presentation"
//       onClick={toggleDrawer(side, false)}
//       onKeyDown={toggleDrawer(side, false)}
//     >
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <div>
//       <div className="sidebar__div" onClick={toggleDrawer('left', true)}><Icon name="angle right" size="small"  className="sidebar__icon"/></div>
//       <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
//         {sideList('left')}
//       </Drawer>
//       <Drawer anchor="top" open={state.top} onClose={toggleDrawer('top', false)}>
//         {fullList('top')}
//       </Drawer>
//       <Drawer anchor="bottom" open={state.bottom} onClose={toggleDrawer('bottom', false)}>
//         {fullList('bottom')}
//       </Drawer>
//       <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
//         {sideList('right')}
//       </Drawer>
//     </div>
//   );
// }